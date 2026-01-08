import { generateText } from "ai"
import { createClient } from "@supabase/supabase-js"
import { createOpenAI } from "@ai-sdk/openai"

// Configure DeepSeek provider
const deepseek = createOpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY || "sk-6080582334574092bf5aba955a62c03b",
  baseURL: "https://api.deepseek.com",
})

export const runtime = "nodejs"

export async function POST(req: Request) {
  console.log("[Scanner]: Received request")
  
  try {
    const body = await req.json()
    const { business, keywords, platforms } = body
    const serpApiKey = process.env.SERPAPI_API_KEY || "d38a948247130a8183264f2ec20e1d3dcb8b1bb304c9ddc2ca031dc3aa0b7456"

    console.log("[Scanner]: Config parsed", { business, keywordsCount: keywords?.length })

    let allRealPosts: any[] = []

    // 1. SerpApi Fetch
    try {
      const platformQuery = (platforms && platforms.length > 0) ? `site:${platforms[0]}.com` : ""
      const firstKeyword = (keywords && keywords.length > 0) ? keywords[0] : business
      const searchQuery = `${platformQuery} "${firstKeyword}" (looking for OR need OR buying)`

      console.log("[Scanner]: SerpApi query:", searchQuery)
      
      const serpResponse = await fetch(
        `https://serpapi.com/search.json?engine=google&q=${encodeURIComponent(searchQuery)}&api_key=${serpApiKey}`
      )
      
      if (serpResponse.ok) {
        const searchData = await serpResponse.json()
        if (searchData.organic_results) {
          allRealPosts = searchData.organic_results.slice(0, 5).map((res: any) => ({
            title: res.title,
            snippet: res.snippet,
            link: res.link
          }))
        }
      } else {
        console.error("[Scanner]: SerpApi response not ok", serpResponse.status)
      }
    } catch (e: any) {
      console.error("[Scanner]: SerpApi error:", e.message)
    }

    // 2. AI Analysis
    let generatedIntents = []
    try {
      console.log("[Scanner]: Calling DeepSeek")
      const systemPrompt = `你是一个专业的社交媒体营销专家。分析搜索结果并转化为 JSON 数组。`
      
      const { text } = await generateText({
        model: deepseek("deepseek-chat"),
        system: systemPrompt,
        prompt: `业务: ${business}, 关键词: ${keywords?.join(',')}. 原始数据: ${JSON.stringify(allRealPosts)}. 
        请返回 3 条意向线索的 JSON 数组 (platform, author_name, content, ai_score, source_url, top_comment).`,
      })

      const jsonStr = text.replace(/```json|```/g, "").trim()
      generatedIntents = JSON.parse(jsonStr)
      console.log("[Scanner]: DeepSeek analysis done")
    } catch (e: any) {
      console.error("[Scanner]: AI/Parse error:", e.message)
    }

    // 3. Final Process
    const processedIntents = (generatedIntents.length > 0 ? generatedIntents : [
      {
        platform: platforms?.[0] || "xiaohongshu",
        author_name: "系统助手",
        content: `模拟线索: 发现有用户在寻找 ${business} 相关服务。`,
        ai_score: 88,
        source_url: "#",
        top_comment: { author: "IntentRadar", content: "实时监测中" }
      }
    ]).map((item: any, idx: number) => ({
      id: `id-${Date.now()}-${idx}`,
      platform: item.platform || (platforms?.[0] || "xiaohongshu"),
      author_name: item.author_name || "用户",
      author_avatar: `https://unavatar.io/${item.platform || 'twitter'}/user${idx}`,
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
      intents: processedIntents,
      message: "扫描完成"
    })

  } catch (error: any) {
    console.error("[Scanner]: Global error:", error.message)
    return Response.json({ error: "服务器内部错误", details: error.message }, { status: 500 })
  }
}
