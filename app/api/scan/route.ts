import { generateText } from "ai"
import { createOpenAI } from "@ai-sdk/openai"

// Normalize DeepSeek configuration
const deepseek = createOpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY || "sk-6080582334574092bf5aba955a62c03b",
  baseURL: "https://api.deepseek.com/v1", // Standard OpenAI compatible path
})

export const runtime = "nodejs"

export async function POST(req: Request) {
  try {
    const { business, keywords, platforms } = await req.json()
    const serpApiKey = process.env.SERPAPI_API_KEY || "d38a948247130a8183264f2ec20e1d3dcb8b1bb304c9ddc2ca031dc3aa0b7456"

    const selectedPlatforms = platforms && platforms.length > 0 ? platforms : ["xiaohongshu", "linkedin", "x"]
    
    // 1. Concurrent Search via SerpApi
    const searchTasks = selectedPlatforms.map(async (platform: string) => {
      const q = `site:${platform}.com "${keywords?.[0] || business}" (需要 OR 寻找 OR 推荐)`
      try {
        const res = await fetch(
          `https://serpapi.com/search.json?engine=google&q=${encodeURIComponent(q)}&api_key=${serpApiKey}&num=10`
        )
        const data = await res.json()
        return data.organic_results || []
      } catch (e) {
        return []
      }
    })

    const allResults = await Promise.all(searchTasks)
    const rawData = allResults.flat().filter(Boolean).slice(0, 15)

    // 2. AI Analysis with robust fallback
    let intents = []
    try {
      const { text } = await generateText({
        model: deepseek("deepseek-chat"),
        system: "你是一个意向线索分析专家。请根据搜索结果返回 JSON 数组。",
        prompt: `业务: ${business}. 搜索数据: ${JSON.stringify(rawData)}. 请提取 6 条意向线索。`,
      })
      const jsonStr = text.replace(/```json|```/g, "").trim()
      intents = JSON.parse(jsonStr)
    } catch (aiError: any) {
      console.error("AI Error, using raw fallback", aiError.message)
      // Fallback: If AI fails, use raw search results directly
      intents = rawData.map((res: any) => ({
        platform: selectedPlatforms[0],
        author_name: "全网监测",
        content: res.snippet || res.title,
        ai_score: 85,
        source_url: res.link,
        top_comment: { author: "系统", content: "通过全网搜索引擎实时捕获。" }
      }))
    }

    const processed = intents.map((item: any, idx: number) => ({
      id: `intent-${Date.now()}-${idx}`,
      platform: item.platform?.toLowerCase() || selectedPlatforms[0],
      author_name: item.author_name || "意向博主",
      author_avatar: `https://unavatar.io/${item.platform || 'twitter'}/${idx}`,
      content: item.content,
      posted_at: new Date().toISOString(),
      ai_score: item.ai_score || 85,
      score_level: (item.ai_score || 85) >= 90 ? "high" : "medium",
      source_url: item.source_url || "#",
      status: "inbox",
      topComment: item.top_comment
    }))

    return Response.json({ 
      success: true, 
      intents: processed,
      message: "雷达扫描完成"
    })

  } catch (error: any) {
    return Response.json({ error: "系统繁忙", details: error.message }, { status: 500 })
  }
}
