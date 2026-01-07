"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ArrowRight, Sparkles, Send } from "lucide-react"
import { useRouter } from "next/navigation"

interface Message {
  role: "assistant" | "user"
  content: string
}

interface QuestionStep {
  id: string
  question: string
  placeholder: string
  type: "text" | "textarea" | "multiselect"
  options?: string[]
}

const questions: QuestionStep[] = [
  {
    id: "business",
    question: "您的业务类型是什么？",
    placeholder: "例如：SaaS软件、电商、咨询服务...",
    type: "text",
  },
  {
    id: "target",
    question: "您想要寻找什么样的潜在客户？",
    placeholder: "例如：正在寻找网站开发的初创公司创始人...",
    type: "textarea",
  },
  {
    id: "platforms",
    question: "您希望在哪些社交平台上监测意向？",
    placeholder: "选择平台",
    type: "multiselect",
    options: ["小红书", "LinkedIn", "X (Twitter)", "Reddit", "Facebook", "Instagram"],
  },
  {
    id: "keywords",
    question: "请提供一些关键词或短语来帮助我们识别意向",
    placeholder: "例如：找前端开发、需要UI设计师、寻求合作...",
    type: "textarea",
  },
  {
    id: "location",
    question: "您关注的地理位置？",
    placeholder: "例如：香港、深圳、全球...",
    type: "text",
  },
]

export function AIQuestionnaire() {
  const router = useRouter()
  const [mode, setMode] = useState<"choice" | "chat" | "form">("choice")
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState<Record<string, string | string[]>>({})
  const [chatMessages, setChatMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "您好！我是IntentRadar AI助手。让我帮您设置意向监测。请告诉我您的业务类型和目标客户特征。",
    },
  ])
  const [chatInput, setChatInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleFormNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      handleComplete()
    }
  }

  const handleFormBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!chatInput.trim()) return

    const userMessage: Message = { role: "user", content: chatInput }
    setChatMessages([...chatMessages, userMessage])
    setChatInput("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...chatMessages, userMessage],
          systemPrompt:
            "你是IntentRadar的AI助手。帮助用户设置他们的意向监测系统。收集：业务类型、目标客户特征、关注平台、关键词、地理位置。用简洁友好的中文回复。",
        }),
      })

      const data = await response.json()
      setChatMessages([...chatMessages, userMessage, { role: "assistant", content: data.message }])
    } catch (error) {
      console.error("Chat error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleComplete = () => {
    // Save preferences and redirect to inbox
    localStorage.setItem("intentRadarConfig", JSON.stringify(formData))
    router.push("/")
  }

  if (mode === "choice") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center p-4">
        <div className="max-w-4xl w-full">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900">IntentRadar</h1>
            </div>
            <p className="text-xl text-gray-600">让AI帮您找到最有意向的潜在客户</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <button
              onClick={() => setMode("chat")}
              className="group relative overflow-hidden bg-white rounded-2xl p-8 border-2 border-gray-200 hover:border-purple-500 transition-all hover:shadow-xl"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-100 to-transparent rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform" />
              <div className="relative">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center mb-4">
                  <Sparkles className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">AI对话模式</h3>
                <p className="text-gray-600 text-left">通过自然对话，让AI理解您的需求并自动配置监测系统</p>
                <div className="mt-6 flex items-center text-purple-600 font-medium">
                  开始对话 <ArrowRight className="ml-2 w-5 h-5" />
                </div>
              </div>
            </button>

            <button
              onClick={() => setMode("form")}
              className="group relative overflow-hidden bg-white rounded-2xl p-8 border-2 border-gray-200 hover:border-blue-500 transition-all hover:shadow-xl"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-100 to-transparent rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform" />
              <div className="relative">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mb-4">
                  <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">问卷表单模式</h3>
                <p className="text-gray-600 text-left">按照结构化问卷逐步填写，精确配置您的监测偏好</p>
                <div className="mt-6 flex items-center text-blue-600 font-medium">
                  填写问卷 <ArrowRight className="ml-2 w-5 h-5" />
                </div>
              </div>
            </button>
          </div>

          <div className="mt-8 text-center">
            <button onClick={() => router.push("/")} className="text-gray-500 hover:text-gray-700 text-sm font-medium">
              跳过，直接进入控制台
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (mode === "chat") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center p-4">
        <div className="max-w-3xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6">
            <h2 className="text-2xl font-bold text-white">AI对话配置</h2>
            <p className="text-purple-100 mt-1">告诉我您的需求，我会帮您设置监测系统</p>
          </div>

          <div className="h-[500px] overflow-y-auto p-6 space-y-4">
            {chatMessages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    msg.role === "user"
                      ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white"
                      : "bg-gray-100 text-gray-900"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-2xl px-4 py-3">
                  <div className="flex gap-1">
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    />
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    />
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          <form onSubmit={handleChatSubmit} className="border-t p-4 flex gap-2">
            <Input
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="输入您的需求..."
              className="flex-1"
              disabled={isLoading}
            />
            <Button type="submit" disabled={isLoading} size="icon">
              <Send className="w-4 h-4" />
            </Button>
          </form>

          <div className="border-t p-4 bg-gray-50 flex justify-between">
            <Button variant="outline" onClick={() => setMode("choice")}>
              返回
            </Button>
            <Button onClick={handleComplete}>完成配置</Button>
          </div>
        </div>
      </div>
    )
  }

  // Form mode
  const currentQuestion = questions[currentStep]
  const progress = ((currentStep + 1) / questions.length) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-white">配置监测系统</h2>
            <span className="text-purple-100 text-sm">
              {currentStep + 1} / {questions.length}
            </span>
          </div>
          <div className="w-full bg-purple-300/30 rounded-full h-2">
            <div className="bg-white h-2 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <div className="p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4">{currentQuestion.question}</h3>

          {currentQuestion.type === "text" && (
            <Input
              value={(formData[currentQuestion.id] as string) || ""}
              onChange={(e) => setFormData({ ...formData, [currentQuestion.id]: e.target.value })}
              placeholder={currentQuestion.placeholder}
              className="text-lg"
            />
          )}

          {currentQuestion.type === "textarea" && (
            <Textarea
              value={(formData[currentQuestion.id] as string) || ""}
              onChange={(e) => setFormData({ ...formData, [currentQuestion.id]: e.target.value })}
              placeholder={currentQuestion.placeholder}
              className="text-lg min-h-[120px]"
            />
          )}

          {currentQuestion.type === "multiselect" && currentQuestion.options && (
            <div className="space-y-2">
              {currentQuestion.options.map((option) => {
                const selected = ((formData[currentQuestion.id] as string[]) || []).includes(option)
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => {
                      const current = (formData[currentQuestion.id] as string[]) || []
                      const updated = selected ? current.filter((item) => item !== option) : [...current, option]
                      setFormData({ ...formData, [currentQuestion.id]: updated })
                    }}
                    className={`w-full text-left px-4 py-3 rounded-lg border-2 transition-all ${
                      selected ? "border-purple-500 bg-purple-50" : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{option}</span>
                      {selected && (
                        <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </div>
                  </button>
                )
              })}
            </div>
          )}
        </div>

        <div className="border-t p-6 flex justify-between bg-gray-50">
          <Button variant="outline" onClick={handleFormBack} disabled={currentStep === 0}>
            上一步
          </Button>
          <div className="flex gap-2">
            <Button variant="ghost" onClick={() => setMode("choice")}>
              取消
            </Button>
            <Button onClick={handleFormNext}>{currentStep === questions.length - 1 ? "完成" : "下一步"}</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
