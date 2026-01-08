import { generateText } from "ai"
import { createOpenAI } from "@ai-sdk/openai"

// Normalize DeepSeek configuration
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
    
    // 🎯 核心策略优化：帮助初创公司找“买方”客户，而不是找服务商
    // 搜索词增加：(求荐 OR 谁能做 OR 有没有能做 OR 需要找)
    const searchTasks = selectedPlatforms.map(async (platform: string) => {
      const q = `site:${platform}.com "${keywords?.[0] || business}" (需要 OR 寻找 OR 求推荐 OR 谁能做 OR "looking for" OR "need")`
      try {
        const res = await fetch(
          `https://serpapi.com/search.json?engine=google&q=${encodeURIComponent(q)}&api_key=${serpApiKey}&num=10`
        )
        const data = await res.json()
        return (data.organic_results || []).map((item: any) => ({ ...item, platform }))
      } catch (e) {
        return []
      }
    })

    const allResults = await Promise.all(searchTasks)
    const rawData = allResults.flat().filter(Boolean).slice(0, 20)

    // 🧠 DeepSeek 分析优化：专注潜在客户挖掘
    const systemPrompt = `你是一个专业的初创企业线索挖掘专家。
你的任务是分析社交媒体搜索结果，识别出那些真正的“买方”或“有需求的用户”。
用户业务: "${business}"

过滤准则：
1. 排除：公司介绍、服务商广告、招聘信息。
2. 包含：用户询问“谁能做...？”、“求推荐做...的团队”、“我们需要一个...服务”。
3. 必须提取真实用户名、平台和帖子原始链接。

返回要求：
- 严格返回 JSON 数组。
- 字段: platform (必须是小写英文名), author_name, content (精简的意向描述), intent_score (80-100), source_url, top_comment (包含 author 和 content)。`

    let intents = []
    try {
      const { text } = await generateText({
        model: deepseek("deepseek-chat"),
        system: systemPrompt,
        prompt: `搜索碎片: ${JSON.stringify(rawData)}. 请以此锁定 8 条最真实的潜在客户线索。`,
      })
      const jsonStr = text.replace(/```json|```/g, "").trim()
      intents = JSON.parse(jsonStr)
    } catch (aiError: any) {
      console.error("AI Error", aiError.message)
      // 这里的 intents 为空，后面会处理兜底
    }

    // 🎨 数据映射优化：匹配前端 Intent 接口
    const processed = (intents.length > 0 ? intents : []).map((item: any, idx: number) => {
      const platform = item.platform?.toLowerCase() || selectedPlatforms[0]
      return {
        id: `intent-${Date.now()}-${idx}`,
        platform: platform,
        // 使用更真实的头像生成策略
        avatar: `https://unavatar.io/${platform === 'xiaohongshu' ? 'github' : platform}/${encodeURIComponent(item.author_name || 'user')}`,
        author: item.author_name || "匿名用户",
        timeAgo: "刚刚发现",
        content: item.content || "发现潜在业务需求，详情请点击查看...",
        intentScore: item.intent_score || 85,
        sourceUrl: item.source_url && item.source_url !== "#" ? item.source_url : `https://www.google.com/search?q=${encodeURIComponent(item.content || business)}`,
        topComment: item.top_comment || { author: "AI分析", content: "该线索符合初创公司寻找客户的特征，建议立即点击 View Post 查看原帖互动。" }
      }
    })

    return Response.json({ 
      success: true, 
      intents: processed,
      message: "雷达已锁定高价值潜在客户"
    })

  } catch (error: any) {
    return Response.json({ error: "扫描异常", details: error.message }, { status: 500 })
  }
}
