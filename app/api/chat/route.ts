import { generateText } from "ai"

export const runtime = "nodejs"

export async function POST(req: Request) {
  try {
    const { messages, systemPrompt } = await req.json()

    const { text } = await generateText({
      model: "openai/gpt-4o-mini",
      system: systemPrompt || "You are a helpful assistant.",
      messages: messages.map((msg: { role: string; content: string }) => ({
        role: msg.role,
        content: msg.content,
      })),
    })

    return Response.json({ message: text })
  } catch (error) {
    console.error("Chat API error:", error)
    return Response.json({ error: "Failed to generate response" }, { status: 500 })
  }
}
