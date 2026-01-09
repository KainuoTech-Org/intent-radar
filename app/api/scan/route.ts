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

      // 构建精准的搜索查询 - 添加需求方关键词
      const demandKeywords = ['需要', '寻找', '求推荐', '有人知道', '哪里可以找', '招聘', '找人', '求助']
      const demandQuery = demandKeywords.slice(0, 3).join(' OR ')
      
      let q = `site:${siteQuery} "${business}" (${demandQuery}) ${keywords?.join(' ') || ''}`
      
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
          const broadQuery = `site:${platform}.com "${business}" (${demandQuery}) ${keywords?.join(' ') || ''}`
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

    // 2. 🧠 改进的意图分析引擎 - 精准识别需求方
    const systemPrompt = `你是一个专业的客户意向识别专家。你的任务是从社交媒体搜索结果中识别**正在寻求服务的潜在客户**（需求方），而不是提供服务的供应商。

**用户业务**: ${business}
**关键需求**: ${keywords?.join('、') || '无'}

🚨 **关键判断标准 - 需求方 vs 供应方**：

**✅ 需求方（我们要找的）**：
- "我想找..."、"需要..."、"求推荐..."、"有人知道..."
- "哪里可以找到..."、"寻找..."、"招聘..."
- 提问形式："有没有推荐的XX？"
- 示例："我想开发一个网站，有靠谱的开发团队推荐吗？"

**❌ 供应方（必须过滤）**：
- "我们提供..."、"我是XX公司"、"专业XX服务"
- "承接XX业务"、"我们可以帮你..."
- 教程/指南："如何做XX"、"XX教程"、"XX步骤"
- 示例："我们是专业建站公司，提供网站开发服务"

**❌ 无关内容（必须过滤）**：
- 纯技术讨论、教程、新闻
- 没有明确需求的讨论
- 仅包含关键词但无意向

意向评分标准：

1. **高度相关 (80-100分)**：
   - 明确的需求方表达
   - 具体的项目需求或预算
   - 主动寻求服务提供商
   - 示例："急需前端开发，React项目，预算2万"

2. **中度相关 (60-79分)**：
   - 隐含的需求方意图
   - 询问推荐或建议
   - 示例："有人知道香港哪里可以找到靠谱的设计师吗？"

3. **低度相关 (50-69分)**：
   - 相关问题但需求不明确
   - 可能有潜在需求
   - 示例："做电商网站一般要多少钱？"

4. **必须过滤 (< 50分)**：
   - 供应方内容
   - 教程/指南
   - 无明确需求

输出要求：
- 返回 JSON 数组
- 每个意向包含：platform, author_name, content, intent_score, demand_type, relevance_reason, source_url
- demand_type: "需求方" 或 "供应方" 或 "无关"（只返回"需求方"）
- relevance_reason: 说明为什么判断为需求方（1-2句话）
- source_url 必须直接从原始数据的 'link' 字段提取
- 如果 link 包含 /search 或 /search_result，跳过
- **只返回 demand_type = "需求方" 且评分 >= 50 的结果**
- 将内容翻译为中文

请返回纯 JSON 数组。`

    let intents = []
    if (rawData.length > 0) {
      try {
        const { text } = await generateText({
          model: deepseek("deepseek-chat"),
          system: systemPrompt,
          prompt: `业务类型: "${business}"。关键词: ${keywords?.join('、') || '无'}。

原始搜索结果: ${JSON.stringify(rawData.slice(0, 25))}

请仔细分析每条结果：
1. 判断是"需求方"（寻求服务）还是"供应方"（提供服务）
2. 过滤所有供应方、教程、无关内容
3. 只返回真正的潜在客户（需求方）
4. 评分 >= 50 的高质量结果

返回纯 JSON 数组。`,
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
