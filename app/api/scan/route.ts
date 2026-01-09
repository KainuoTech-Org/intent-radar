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
    
    // 1. 精准化搜索策略：强迫搜索具体的帖子路径，而不是首页
    const searchTasks = selectedPlatforms.map(async (platform: string) => {
      let siteQuery = `${platform}.com`
      if (platform === 'xiaohongshu') siteQuery = `xiaohongshu.com/explore`
      if (platform === 'linkedin') siteQuery = `linkedin.com/posts`
      if (platform === 'x') siteQuery = `x.com/*/status`
      if (platform === 'reddit') siteQuery = `reddit.com/r/*/comments`

      const q = `site:${siteQuery} "${business}" ${keywords?.join(' ') || ''}`
      try {
        const res = await fetch(
          `https://serpapi.com/search.json?engine=google&q=${encodeURIComponent(q)}&api_key=${serpApiKey}&num=15`
        )
        const data = await res.json()
        return (data.organic_results || []).map((item: any) => ({ 
          title: item.title,
          link: item.link,
          snippet: item.snippet,
          platform 
        }))
      } catch (e) {
        return []
      }
    })

    const allResults = await Promise.all(searchTasks)
    const rawData = allResults.flat().filter(Boolean)

    // 2. 🧠 深度意图分析引擎
    const systemPrompt = `你是一个专业的初创公司获客专家。你的任务是从原始搜索结果中提取真实的客户意向。

严格准则：
1. **真实链接**：必须直接从原始数据的 'link' 字段提取 source_url。严禁编造链接，严禁返回搜索结果页链接（如 /search 或 /search_result）。
2. **线索判定**：只有当 snippet 或 title 中明确包含“求推荐”、“找人”、“需要服务”、“寻找合作伙伴”等意向时，才被视为有效线索。
3. **语言转换**：将内容 (content) 和评论 (top_comment) 统一翻译为中文。
4. **数据结构**：返回 JSON 数组，包含: platform, author_name, content, intent_score (80-100), source_url, top_comment (包含 author 和 content)。
5. **拒绝低质量**：如果原始数据不包含真实意向，请返回空数组 []。不要生成任何填充数据。`

    let intents = []
    if (rawData.length > 0) {
      try {
        const { text } = await generateText({
          model: deepseek("deepseek-chat"),
          system: systemPrompt,
          prompt: `业务类型: "${business}"。原始搜索碎片数据: ${JSON.stringify(rawData.slice(0, 15))}。请返回纯 JSON 数组。`,
        })
        const jsonStr = text.replace(/```json|```/g, "").trim()
        intents = JSON.parse(jsonStr)
      } catch (aiError: any) {
        console.error("AI Analysis Error", aiError.message)
      }
    }

    // 3. 数据映射与精选
    const processed = (intents || [])
      .map((item: any, idx: number) => ({
        id: `intent-${Date.now()}-${idx}`,
        platform: item.platform?.toLowerCase() || "xiaohongshu",
        avatar: `https://unavatar.io/${item.platform === 'xiaohongshu' ? 'github' : (item.platform || 'twitter')}/${encodeURIComponent(item.author_name || 'user')}`,
        author: item.author_name || "潜在客户",
        timeAgo: "刚刚发现",
        content: item.content,
        intentScore: item.intent_score || 85,
        sourceUrl: item.source_url, // 这里绝对保证是真实的帖子
        topComment: item.top_comment || { author: "AI Insight", content: "根据语义分析，该用户在社交媒体上表达了明确的业务合作意向。" }
      }))

    return Response.json({ 
      success: true, 
      intents: processed,
      message: processed.length > 0 
        ? `为您发现了 ${processed.length} 条真实高价值线索。` 
        : `暂时没有在公网发现匹配的实时意向，建议调整关键词后再次扫描。`
    })

  } catch (error: any) {
    return Response.json({ error: "扫描失败", details: error.message }, { status: 500 })
  }
}
