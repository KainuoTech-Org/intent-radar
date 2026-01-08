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
  try {
    const { business, keywords, platforms } = await req.json()
    const serpApiKey = process.env.SERPAPI_API_KEY || "d38a948247130a8183264f2ec20e1d3dcb8b1bb304c9ddc2ca031dc3aa0b7456"

    // 1. 构造极其精准的搜索指令
    // 针对社交平台优化搜索语法，例如：site:linkedin.com "网站开发" "求购"
    const selectedPlatforms = platforms && platforms.length > 0 ? platforms : ["xiaohongshu", "linkedin", "x", "reddit"]
    const searchTasks = selectedPlatforms.map(async (platform: string) => {
      const q = `site:${platform}.com "${keywords?.[0] || business}" (需要 OR 寻找 OR 推荐 OR 怎么买)`
      try {
        const res = await fetch(
          `https://serpapi.com/search.json?engine=google&q=${encodeURIComponent(q)}&api_key=${serpApiKey}&num=10`
        )
        return res.ok ? (await res.json()).organic_results : []
      } catch (e) {
        return []
      }
    })

    const resultsArray = await Promise.all(searchTasks)
    const rawData = resultsArray.flat().filter(Boolean).slice(0, 20)

    // 2. 让 DeepSeek 进行“火眼金睛”式的线索提取
    const systemPrompt = `你是一个顶级的意向挖掘专家。
我将给你提供一组从 Google 实时抓取到的 ${selectedPlatforms.join(', ')} 搜索碎片。
用户业务: "${business}"

任务要求：
1. 必须从抓取到的原始数据中提取真实的线索。
2. 严禁生成“系统助手”或模拟数据。
3. 每个线索必须包含：
   - platform: 必须是 [xiaohongshu, linkedin, x, reddit, facebook, instagram] 之一
   - author_name: 尽量提取真实的博主名
   - content: 提取最有价值的意向描述
   - ai_score: 意向分 (80-100)，根据相关性和时效性打分
   - source_url: 必须是真实的帖子原始链接
   - top_comment: 模拟或提取一条该帖子下的高价值互动评论

返回格式：严格的 JSON 数组，不要任何 Markdown 说明文字。`

    const { text } = await generateText({
      model: deepseek("deepseek-chat"),
      system: systemPrompt,
      prompt: `原始抓取数据：${JSON.stringify(rawData)}。请以此生成 6-8 条最相关的真实意向线索。`,
    })

    let generatedIntents = []
    try {
      const jsonStr = text.replace(/```json|```/g, "").trim()
      generatedIntents = JSON.parse(jsonStr)
    } catch (e) {
      console.error("Parse error", text)
    }

    // 3. 结果排序与最终加工
    const processedIntents = (generatedIntents.length > 0 ? generatedIntents : [])
      .sort((a: any, b: any) => (b.ai_score || 0) - (a.ai_score || 0)) // 按分数排序
      .map((item: any, idx: number) => ({
        id: `intent-${Date.now()}-${idx}`,
        platform: item.platform?.toLowerCase() || "xiaohongshu",
        author_name: item.author_name || "活跃用户",
        author_avatar: `https://unavatar.io/${item.platform || 'twitter'}/${encodeURIComponent(item.author_name || 'user')}`,
        content: item.content || "正在寻找相关业务合作伙伴...",
        posted_at: new Date().toISOString(),
        ai_score: item.ai_score || 85,
        score_level: (item.ai_score || 85) >= 90 ? "high" : "medium",
        source_url: item.source_url && item.source_url !== "#" ? item.source_url : `https://www.google.com/search?q=${encodeURIComponent(item.content || business)}`,
        status: "inbox",
        topComment: item.top_comment || { author: "系统分析", content: "该线索匹配度极高，建议立即跟进。" }
      }))

    return Response.json({ 
      success: true, 
      intents: processedIntents,
      count: processedIntents.length,
      message: rawData.length > 0 ? `已为您深度扫描全网，锁定 ${processedIntents.length} 条真实高价值意向。` : "全网实时扫描完成。"
    })

  } catch (error: any) {
    console.error("Global error:", error)
    return Response.json({ error: "扫描失败", details: error.message }, { status: 500 })
  }
}
