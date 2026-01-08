"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ArrowRight, Sparkles, Send, Loader2, Check } from "lucide-react"
import { useRouter } from "next/navigation"
import { DEMO_INTENTS } from "@/lib/mock-data"
import type { Intent } from "./inbox"

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
]

export function AIQuestionnaire({ 
  onComplete, 
  isModal = false 
}: { 
  onComplete?: (results: Intent[]) => void, 
  isModal?: boolean 
}) {
  const router = useRouter()
  const [mode, setMode] = useState<"choice" | "chat" | "form" | "scanning">("choice")
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

    // Simulate AI thinking and extracting keywords
    try {
      // In a real app, this would call /api/chat and return a recommendation
      await new Promise(resolve => setTimeout(resolve, 1500))
      const aiResponse: Message = { 
        role: "assistant", 
        content: `太棒了！我已经理解您需要监测“${userMessage.content}”相关的意向。我已经为您配置好了关键词和社交平台。现在可以开始扫描实时意向了吗？` 
      }
      setChatMessages(prev => [...prev, aiResponse])
    } catch (error) {
      console.error("Chat error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleComplete = async () => {
    setMode("scanning")
    setIsLoading(true)
    
    try {
      // 提取关键词 (从 formData 或 chatMessages)
      const business = formData.business as string || "Web Development"
      const keywords = typeof formData.keywords === 'string' ? formData.keywords.split(/[，, ]+/) : ["service", "need"]
      const platforms = (formData.platforms as string[]) || ["xiaohongshu", "linkedin"]

      const response = await fetch("/api/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ business, keywords, platforms }),
      })

      const data = await response.json()
      
      if (data.success && data.intents) {
        // 转换后端数据结构为前端 Intent 接口
        const formattedResults: Intent[] = data.intents.map((item: any) => ({
          id: item.id,
          platform: item.platform,
          avatar: item.author_avatar,
          author: item.author_name,
          timeAgo: "刚刚发现",
          content: item.content,
          intentScore: item.ai_score,
          sourceUrl: item.source_url,
          timestamp: new Date(item.posted_at),
        }))

        if (onComplete) {
          onComplete(formattedResults)
        } else {
          localStorage.setItem("scannedIntents", JSON.stringify(formattedResults))
          router.push("/")
        }
      }
    } catch (error) {
      console.error("Scanning failed:", error)
      // Fallback if API fails
      const results = [...DEMO_INTENTS].sort(() => Math.random() - 0.5).slice(0, 3)
      if (onComplete) onComplete(results)
    } finally {
      setIsLoading(false)
    }
  }

  if (mode === "scanning") {
    return (
      <div className={`min-h-[500px] w-full flex items-center justify-center p-8 bg-white ${isModal ? 'rounded-2xl' : 'min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50'}`}>
        <div className="text-center">
          <div className="relative mb-8">
            <div className="w-24 h-24 rounded-full border-4 border-purple-100 border-t-purple-600 animate-spin mx-auto" />
            <Sparkles className="w-8 h-8 text-purple-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">正在全网扫描意向...</h2>
          <p className="text-gray-500">AI 正在小红书、LinkedIn、X 等平台搜索匹配线索</p>
          <div className="mt-8 flex flex-col gap-2 max-w-xs mx-auto">
            <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-purple-600 animate-[progress_3s_ease-in-out]" style={{ width: '100%' }} />
            </div>
            <div className="flex justify-between text-[10px] font-bold text-gray-400 uppercase">
              <span>Initializing</span>
              <span>Finalizing</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (mode === "choice") {
    return (
      <div className={`w-full flex items-center justify-center p-4 ${isModal ? '' : 'min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50'}`}>
        <div className={`${isModal ? 'w-full' : 'max-w-5xl w-full'} bg-white p-12 rounded-[32px] shadow-2xl border border-gray-100`}>
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900">AI 意向搜索助手</h1>
            </div>
            <p className="text-xl text-gray-600">告诉 AI 您的业务，我们会为您全网实时追踪潜在客户</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <button
              onClick={() => setMode("chat")}
              className="group relative overflow-hidden bg-white rounded-2xl p-8 border-2 border-gray-200 hover:border-purple-500 transition-all hover:shadow-xl text-left"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-100 to-transparent rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform" />
              <div className="relative">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center mb-4">
                  <Sparkles className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">对话式搜索</h3>
                <p className="text-gray-600">只需几句话，AI 就能理解您的需求并开始实时抓取线索</p>
                <div className="mt-6 flex items-center text-purple-600 font-medium">
                  立即开始 <ArrowRight className="ml-2 w-5 h-5" />
                </div>
              </div>
            </button>

            <button
              onClick={() => setMode("form")}
              className="group relative overflow-hidden bg-white rounded-2xl p-8 border-2 border-gray-200 hover:border-blue-500 transition-all hover:shadow-xl text-left"
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
                <h3 className="text-xl font-bold text-gray-900 mb-2">问卷精准配置</h3>
                <p className="text-gray-600">通过结构化问卷，精确定义您关注的平台、地区和关键词</p>
                <div className="mt-6 flex items-center text-blue-600 font-medium">
                  按步骤填写 <ArrowRight className="ml-2 w-5 h-5" />
                </div>
              </div>
            </button>
          </div>

          <div className="mt-8 text-center">
            <button onClick={() => isModal ? onComplete?.([]) : router.push("/")} className="text-gray-400 hover:text-gray-600 text-sm font-medium">
              暂时跳过，进入控制台
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (mode === "chat") {
    return (
      <div className={`w-full flex items-center justify-center p-4 ${isModal ? '' : 'min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50'}`}>
        <div className="max-w-3xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-8 text-white">
            <h2 className="text-2xl font-bold">AI 对话搜索</h2>
            <p className="text-purple-100 mt-1 opacity-90">描述您的业务，我们将为您定位潜在客户</p>
          </div>

          <div className="h-[450px] overflow-y-auto p-8 space-y-6 bg-gray-50/30">
            {chatMessages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] rounded-2xl px-5 py-3 shadow-sm ${
                    msg.role === "user"
                      ? "bg-purple-600 text-white"
                      : "bg-white text-gray-800 border border-gray-100"
                  }`}
                >
                  <p className="text-[15px] leading-relaxed">{msg.content}</p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-100 rounded-2xl px-5 py-3 shadow-sm">
                  <Loader2 className="w-5 h-5 text-purple-600 animate-spin" />
                </div>
              </div>
            )}
          </div>

          <form onSubmit={handleChatSubmit} className="p-6 bg-white border-t border-gray-100 flex gap-3">
            <Input
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="例如：我是一家做香港网站建设的公司，想找需要开发服务的客户..."
              className="flex-1 py-6 rounded-xl border-gray-200 focus:ring-purple-500/20"
              disabled={isLoading}
            />
            <Button type="submit" disabled={isLoading || !chatInput.trim()} className="h-auto px-6 rounded-xl bg-purple-600 hover:bg-purple-700 shadow-md">
              <Send className="w-5 h-5" />
            </Button>
          </form>

          <div className="px-8 py-5 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
            <Button variant="ghost" onClick={() => setMode("choice")} className="text-gray-500">
              返回
            </Button>
            <Button 
              onClick={handleComplete} 
              className="bg-green-600 hover:bg-green-700 text-white rounded-lg px-8 font-bold"
              disabled={chatMessages.length < 2}
            >
              开始全网扫描
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Form mode
  const currentQuestion = questions[currentStep]
  const progress = ((currentStep + 1) / questions.length) * 100

  return (
    <div className={`w-full flex items-center justify-center p-4 ${isModal ? '' : 'min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50'}`}>
      <div className="max-w-2xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">精准意向配置</h2>
            <span className="text-purple-100 text-sm font-bold bg-white/10 px-3 py-1 rounded-full">
              步骤 {currentStep + 1} / {questions.length}
            </span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-2">
            <div className="bg-white h-2 rounded-full transition-all duration-500 ease-out shadow-[0_0_8px_rgba(255,255,255,0.5)]" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <div className="p-10 min-h-[300px]">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">{currentQuestion.question}</h3>

          {currentQuestion.type === "text" && (
            <Input
              value={(formData[currentQuestion.id] as string) || ""}
              onChange={(e) => setFormData({ ...formData, [currentQuestion.id]: e.target.value })}
              placeholder={currentQuestion.placeholder}
              className="text-lg py-7 rounded-xl border-2 focus:border-purple-500/50"
            />
          )}

          {currentQuestion.type === "textarea" && (
            <Textarea
              value={(formData[currentQuestion.id] as string) || ""}
              onChange={(e) => setFormData({ ...formData, [currentQuestion.id]: e.target.value })}
              placeholder={currentQuestion.placeholder}
              className="text-lg min-h-[150px] rounded-xl border-2 focus:border-purple-500/50"
            />
          )}

          {currentQuestion.type === "multiselect" && currentQuestion.options && (
            <div className="grid grid-cols-2 gap-3">
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
                    className={`text-left px-5 py-4 rounded-xl border-2 transition-all flex items-center justify-between ${
                      selected 
                      ? "border-purple-600 bg-purple-50 text-purple-700 shadow-sm" 
                      : "border-gray-100 hover:border-gray-200 bg-gray-50/50"
                    }`}
                  >
                    <span className="font-bold text-[15px]">{option}</span>
                    {selected && <div className="w-5 h-5 bg-purple-600 rounded-full flex items-center justify-center"><Check className="w-3 h-3 text-white" /></div>}
                  </button>
                )
              })}
            </div>
          )}
        </div>

        <div className="border-t p-8 flex justify-between bg-gray-50/50">
          <Button variant="ghost" onClick={handleFormBack} disabled={currentStep === 0} className="text-gray-500 px-8">
            上一步
          </Button>
          <div className="flex gap-3">
            <Button variant="ghost" onClick={() => setMode("choice")} className="text-gray-400">
              取消
            </Button>
            <Button onClick={handleFormNext} className="bg-purple-600 hover:bg-purple-700 text-white rounded-lg px-10 font-bold shadow-lg transition-transform active:scale-95">
              {currentStep === questions.length - 1 ? "完成并开始扫描" : "下一步"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
