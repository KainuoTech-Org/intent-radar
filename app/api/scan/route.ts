import { generateText } from "ai"
import { createOpenAI } from "@ai-sdk/openai"

const deepseek = createOpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY || "sk-6080582334574092bf5aba955a62c03b",
  baseURL: "https://api.deepseek.com/v1",
})

export const runtime = "nodejs"

export async function POST(req: Request) {
  try {
    const { business, keywords, platforms } = await req.json()
    const serpApiKey = process.env.SERPAPI_API_KEY || "d38a948247130a8183264f2ec20e1d3dcb8b1bb304c9ddc2ca031dc3aa0b7456"

    const selectedPlatforms = platforms && platforms.length > 0 ? platforms : ["xiaohongshu", "linkedin", "x", "reddit"]
    
    // 1. 多策略搜索：先尝试精确搜索，如果结果少则放宽范围
    const searchTasks = selectedPlatforms.map(async (platform: string) => {
      // 策略 1: 精确路径搜索
      let siteQuery = `${platform}.com`
      if (platform === 'xiaohongshu') siteQuery = `xiaohongshu.com/explore`
      if (platform === 'linkedin') siteQuery = `linkedin.com/posts`
      if (platform === 'x') siteQuery = `x.com/*/status`
      if (platform === 'reddit') siteQuery = `reddit.com/r/*/comments`

      let q = `site:${siteQuery} "${business}" ${keywords?.join(' ') || ''}`
      
      try {
        let res = await fetch(
          `https://serpapi.com/search.json?engine=google&q=${encodeURIComponent(q)}&api_key=${serpApiKey}&num=30`,
          { signal: AbortSignal.timeout(10000) }
        )
        let data = await res.json()
        let results = data.organic_results || []
        
        // 策略 2: 如果结果少于 10 条，放宽到整个域名
        if (results.length < 10) {
          console.log(`[Scan] Platform ${platform}: 精确搜索仅 ${results.length} 条，尝试宽泛搜索`)
          const broadQuery = `site:${platform}.com "${business}" ${keywords?.join(' ') || ''}`
          res = await fetch(
            `https://serpapi.com/search.json?engine=google&q=${encodeURIComponent(broadQuery)}&api_key=${serpApiKey}&num=30`,
            { signal: AbortSignal.timeout(10000) }
          )
          data = await res.json()
          results = data.organic_results || []
        }
        
        return results.map((item: any) => ({ 
          title: item.title,
          link: item.link,
          snippet: item.snippet,
          platform 
        }))
      } catch (e: any) {
        console.error(`[Scan] Platform ${platform} 搜索失败:`, e.message)
        return []
      }
    })

    const allResults = await Promise.all(searchTasks)
    const rawData = allResults.flat().filter(Boolean)
    
    console.log(`[Scan] 共获取 ${rawData.length} 条原始搜索结果`)

    // 2. 🧠 改进的意图分析引擎 - 精准匹配用户需求
    const systemPrompt = `你是一个专业的客户意向识别专家。你的任务是从社交媒体搜索结果中识别与用户业务高度相关的潜在客户意向。

**用户业务**: ${business}
**关键需求**: ${keywords?.join('、') || '无'}

意向评估标准：

1. **高度相关 (80-100分)**：
   - 内容明确表达对该业务的需求
   - 包含明确的行动意图："寻找"、"需要"、"招聘"、"求推荐"
   - 与用户业务类型和关键词高度匹配
   - 示例："需要一个前端开发帮忙做 React 项目"

2. **中度相关 (60-79分)**：
   - 内容暗示对该业务的潜在需求
   - 包含隐含意图："有人知道"、"求助"、"推荐一下"
   - 与用户业务相关但不完全匹配
   - 示例："有人知道香港哪里可以找到靠谱的设计师吗？"

3. **低度相关 (50-69分)**：
   - 内容提出与业务相关的问题
   - 可能有潜在需求但不明确
   - 示例："做电商网站应该用什么技术栈？"

4. **相关性不足 (< 50分)**：
   - 仅包含关键词但没有明确需求
   - 与用户业务关联度低
   - **这类内容应该被过滤，不要返回**

评分要点：
- 内容是否直接提到用户的业务类型？(+20分)
- 是否包含明确的需求表达？(+20分)
- 是否包含用户提供的关键词？(+15分)
- 语境是否表明有购买/合作意向？(+15分)
- 是否有具体的项目描述或预算？(+10分)

输出要求：
- 返回 JSON 数组
- 每个意向包含：platform, author_name, content, intent_score, relevance_reason, source_url
- relevance_reason: 简短说明为什么这条内容相关（1-2句话）
- source_url 必须直接从原始数据的 'link' 字段提取
- 如果 link 包含 /search 或 /search_result，跳过该结果
- **只返回评分 >= 50 的结果**
- 将内容翻译为中文
- 优先返回评分最高的结果

请返回纯 JSON 数组。`

    let intents = []
    if (rawData.length > 0) {
      try {
        const { text } = await generateText({
          model: deepseek("deepseek-chat"),
          system: systemPrompt,
          prompt: `业务类型: "${business}"。关键词: ${keywords?.join('、') || '无'}。原始搜索结果: ${JSON.stringify(rawData.slice(0, 25))}。请仔细评估每条结果与用户业务的相关性，只返回高质量的意向线索（评分 >= 50）。返回纯 JSON 数组。`,
        })
        const jsonStr = text.replace(/```json|```/g, "").trim()
        intents = JSON.parse(jsonStr)
        console.log(`[Scan] AI 分析识别出 ${intents.length} 条意向`)
      } catch (aiError: any) {
        console.error("[Scan] AI 分析失败:", aiError.message)
        // 降级：返回原始搜索结果
        intents = rawData.slice(0, 8).map((item: any) => ({
          platform: item.platform,
          author_name: "未知用户",
          content: item.snippet || item.title,
          intent_score: 50,
          relevance_reason: "AI 分析失败，这是原始搜索结果",
          source_url: item.link
        }))
      }
    }

    // 3. 数据映射与精选 - 按评分排序
    const processed = (intents || [])
      .filter((item: any) => {
        // 过滤无效 URL
        if (!item.source_url || item.source_url.includes('/search')) {
          return false
        }
        // 只保留评分 >= 50 的结果
        if (item.intent_score < 50) {
          return false
        }
        return true
      })
      .sort((a: any, b: any) => b.intent_score - a.intent_score) // 按评分降序排序
      .map((item: any, idx: number) => ({
        id: `intent-${Date.now()}-${idx}`,
        platform: item.platform?.toLowerCase() || "xiaohongshu",
        avatar: `https://unavatar.io/${item.platform === 'xiaohongshu' ? 'github' : (item.platform || 'twitter')}/${encodeURIComponent(item.author_name || 'user')}`,
        author: item.author_name || "潜在客户",
        timeAgo: "刚刚发现",
        content: item.content,
        intentScore: item.intent_score || 85,
        sourceUrl: item.source_url,
        topComment: item.top_comment || { 
          author: "AI 相关性分析", 
          content: item.relevance_reason || "根据语义分析，该用户在社交媒体上表达了明确的业务合作意向。" 
        }
      }))

    console.log(`[Scan] 最终返回 ${processed.length} 条有效意向`)

    return Response.json({ 
      success: true, 
      intents: processed,
      message: processed.length > 0 
        ? `为您发现了 ${processed.length} 条真实高价值线索。` 
        : `暂时没有在公网发现匹配的实时意向，建议调整关键词后再次扫描。`,
      diagnostics: {
        rawResultsCount: rawData.length,
        aiAnalyzedCount: intents.length,
        finalCount: processed.length
      }
    })

  } catch (error: any) {
    console.error("[Scan] 扫描失败:", error)
    return Response.json({ 
      success: false,
      error: "扫描失败", 
      details: error.message,
      suggestion: "请检查网络连接和 API 配置，或尝试调整搜索关键词。"
    }, { status: 500 })
  }
}
