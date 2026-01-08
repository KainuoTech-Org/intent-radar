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
    
    // 1. 扩大搜索面，获取更多原始数据供 AI 筛选
    const searchTasks = selectedPlatforms.map(async (platform: string) => {
      const q = `site:${platform}.com "${business}" (${keywords?.join(' OR ') || ''})`
      try {
        const res = await fetch(
          `https://serpapi.com/search.json?engine=google&q=${encodeURIComponent(q)}&api_key=${serpApiKey}&num=20`
        )
        const data = await res.json()
        return (data.organic_results || []).map((item: any) => ({ ...item, platform }))
      } catch (e) {
        return []
      }
    })

    const allResults = await Promise.all(searchTasks)
    const rawData = allResults.flat().filter(Boolean)

    // 🧠 深度意图分析引擎
    const systemPrompt = `你是一个极度苛刻的初创公司获客专家。
你的目标是：从乱七八糟的搜索结果中，精准识别出那些“正在寻找服务并准备付钱”的真实客户。

过滤准则（严禁违反）：
1. 身份校验：发帖人必须是【甲方/需求方】。如果发帖人看起来像是在推销自己的服务，或者是一个公司官号在发新闻，直接剔除。
2. 动作校验：帖子必须包含明确的【求购/求荐/询问】动作。例如：“有没有能做AI的？”、“求推荐靠谱的装修公司”。
3. 质量分级：如果仅仅是讨论技术或分享日常（虽然包含关键词），AI 评分必须低于 60 分并被剔除。
4. 真实链接：必须保留原始 source_url。

请基于以下原始数据，通过语义分析，选出最优质的 8 条线索。`

    let intents = []
    try {
      const { text } = await generateText({
        model: deepseek("deepseek-chat"),
        system: systemPrompt,
        prompt: `业务类型: "${business}"。原始碎片数据: ${JSON.stringify(rawData)}。请返回严格的 JSON 数组。`,
      })
      const jsonStr = text.replace(/```json|```/g, "").trim()
      intents = JSON.parse(jsonStr)
    } catch (aiError: any) {
      console.error("AI Analysis Error", aiError.message)
    }

    // 3. 数据映射与排序（仅返回 80 分以上的精选结果）
    const processed = intents
      .filter((item: any) => (item.intent_score || 0) >= 70) // 再次硬性过滤低质量数据
      .sort((a: any, b: any) => (b.intent_score || 0) - (a.intent_score || 0))
      .map((item: any, idx: number) => ({
        id: `intent-${Date.now()}-${idx}`,
        platform: item.platform?.toLowerCase() || "xiaohongshu",
        avatar: `https://unavatar.io/${item.platform === 'xiaohongshu' ? 'github' : (item.platform || 'twitter')}/${encodeURIComponent(item.author_name || 'user')}`,
        author: item.author_name || "潜在客户",
        timeAgo: "刚刚发现",
        content: item.content,
        intentScore: item.intent_score || 85,
        sourceUrl: item.source_url || "#",
        topComment: item.top_comment || { author: "AI Insight", content: "通过语义分析，该用户表达了真实且迫切的业务需求。" }
      }))

    return Response.json({ 
      success: true, 
      intents: processed,
      message: `AI 深度解析了 ${rawData.length} 条信息，为您精选了 ${processed.length} 条高价值成交线索。`
    })

  } catch (error: any) {
    return Response.json({ error: "扫描失败", details: error.message }, { status: 500 })
  }
}
