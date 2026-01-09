"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ArrowRight, Sparkles, Send, Loader2, Check } from "lucide-react"
import { useRouter } from "next/navigation"
import { DEMO_INTENTS } from "@/lib/mock-data"

export interface Intent {
  id: string
  platform: "xiaohongshu" | "linkedin" | "x" | "telegram" | "reddit" | "facebook" | "instagram"
  avatar: string
  author: string
  timeAgo: string
  content: string
  intentScore: number
  sourceUrl: string
  timestamp?: Date
  topComment?: {
    author: string
    content: string
  }
}

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
        const formattedResults: Intent[] = data.intents.map((item: any) => ({
          id: item.id,
          platform: item.platform,
          avatar: item.avatar || "",
          author: item.author || "潜在客户",
          timeAgo: "刚刚发现",
          content: item.content,
          intentScore: item.intentScore,
          sourceUrl: item.sourceUrl,
          timestamp: new Date(),
          topComment: item.topComment
        }))

        if (onComplete) {
          // Pass results, the query info, and the message back to parent
          (onComplete as any)(formattedResults, { business, keywords }, data.message)
        } else {
          localStorage.setItem("scannedIntents", JSON.stringify(formattedResults))
          localStorage.setItem("lastScanQuery", JSON.stringify({ business, keywords }))
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
      <div className={`min-h-[500px] w-full flex items-center justify-center p-8 bg-[#FBF9F6] ${isModal ? 'rounded-[20px]' : 'min-h-screen'}`}>
        <div className="text-center">
          <div className="relative mb-8 flex justify-center">
            <div className="w-24 h-24 rounded-full border-4 border-[#E5E1D8] border-t-[#323333] animate-spin" />
            <Sparkles className="w-8 h-8 text-[#323333] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          </div>
          <h2 className="font-['Merriweather'] text-[24px] font-bold text-[#323333] mb-2">正在全网扫描意向...</h2>
          <p className="font-['Inter'] text-[#6B6660]">AI 正在小红书、LinkedIn、X 等平台搜索匹配线索</p>
          <div className="mt-8 flex flex-col gap-2 max-w-xs mx-auto">
            <div className="h-1.5 w-full bg-[#E5E1D8] rounded-full overflow-hidden">
              <div className="h-full bg-[#323333] animate-[progress_3s_ease-in-out]" style={{ width: '100%' }} />
            </div>
            <div className="flex justify-between text-[10px] font-bold text-[#9B9690] uppercase tracking-wider">
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
      <div className={`w-full flex items-center justify-center p-4 ${isModal ? '' : 'min-h-screen bg-[#FBF9F6]'}`}>
        <div className={`${isModal ? 'w-full' : 'max-w-5xl w-full'} bg-white p-12 rounded-[24px] shadow-sm border border-[#E5E1D8]`}>
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-[12px] bg-[#323333] flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h1 className="font-['Merriweather'] text-[32px] font-bold text-[#323333]">AI 意向搜索助手</h1>
            </div>
            <p className="font-['Inter'] text-[18px] text-[#6B6660]">告诉 AI 您的业务，我们会为您全网实时追踪潜在客户</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <button
              onClick={() => setMode("chat")}
              className="group relative overflow-hidden bg-[#FEFCFA] rounded-[16px] p-8 border border-[#E5E1D8] hover:border-[#323333] transition-all hover:shadow-md text-left"
            >
              <div className="relative">
                <div className="w-14 h-14 rounded-[12px] bg-[#F5F3F0] flex items-center justify-center mb-6 group-hover:bg-[#EDE9E0] transition-colors">
                  <Sparkles className="w-7 h-7 text-[#323333]" />
                </div>
                <h3 className="font-['Merriweather'] text-[20px] font-bold text-[#323333] mb-2">对话式搜索</h3>
                <p className="font-['Inter'] text-[#6B6660] leading-relaxed">只需几句话，AI 就能理解您的需求并开始实时抓取线索</p>
                <div className="mt-8 flex items-center text-[#8B6F47] font-semibold text-[15px]">
                  立即开始 <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </button>

            <button
              onClick={() => setMode("form")}
              className="group relative overflow-hidden bg-[#FEFCFA] rounded-[16px] p-8 border border-[#E5E1D8] hover:border-[#323333] transition-all hover:shadow-md text-left"
            >
              <div className="relative">
                <div className="w-14 h-14 rounded-[12px] bg-[#F5F3F0] flex items-center justify-center mb-6 group-hover:bg-[#EDE9E0] transition-colors">
                  <svg className="w-7 h-7 text-[#323333]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h3 className="font-['Merriweather'] text-[20px] font-bold text-[#323333] mb-2">问卷精准配置</h3>
                <p className="font-['Inter'] text-[#6B6660] leading-relaxed">通过结构化问卷，精确定义您关注的平台、地区和关键词</p>
                <div className="mt-8 flex items-center text-[#8B6F47] font-semibold text-[15px]">
                  按步骤填写 <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </button>
          </div>

          <div className="mt-12 text-center">
            <button onClick={() => isModal ? onComplete?.([]) : router.push("/")} className="font-['Inter'] text-[#9B9690] hover:text-[#323333] text-[14px] font-medium transition-colors">
              暂时跳过，进入控制台
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (mode === "chat") {
    return (
      <div className={`w-full flex items-center justify-center p-4 ${isModal ? '' : 'min-h-screen bg-[#FBF9F6]'}`}>
        <div className="max-w-3xl w-full bg-white rounded-[24px] shadow-sm overflow-hidden border border-[#E5E1D8]">
          <div className="bg-[#FEFCFA] border-b border-[#E5E1D8] p-8">
            <h2 className="font-['Merriweather'] text-[24px] font-bold text-[#323333]">AI 对话搜索</h2>
            <p className="font-['Inter'] text-[#6B6660] mt-1">描述您的业务，我们将为您定位潜在客户</p>
          </div>

          <div className="h-[450px] overflow-y-auto p-8 space-y-6 bg-[#FBF9F6]/50">
            {chatMessages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] rounded-[16px] px-5 py-3 shadow-sm font-['Inter'] ${
                    msg.role === "user"
                      ? "bg-[#323333] text-white"
                      : "bg-white text-[#323333] border border-[#E5E1D8]"
                  }`}
                >
                  <p className="text-[15px] leading-relaxed">{msg.content}</p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-[#E5E1D8] rounded-[16px] px-5 py-3 shadow-sm">
                  <Loader2 className="w-5 h-5 text-[#323333] animate-spin" />
                </div>
              </div>
            )}
          </div>

          <form onSubmit={handleChatSubmit} className="p-6 bg-white border-t border-[#E5E1D8] flex gap-3">
            <Input
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="例如：我是一家做香港网站建设的公司，想找需要开发服务的客户..."
              className="flex-1 py-6 rounded-[12px] border-[#E5E1D8] focus:ring-[#323333]/10 font-['Inter']"
              disabled={isLoading}
            />
            <Button type="submit" disabled={isLoading || !chatInput.trim()} className="h-auto px-6 rounded-[12px] bg-[#323333] hover:bg-black shadow-sm">
              <Send className="w-5 h-5 text-white" />
            </Button>
          </form>

          <div className="px-8 py-5 bg-[#FEFCFA] border-t border-[#E5E1D8] flex justify-between items-center">
            <Button variant="ghost" onClick={() => setMode("choice")} className="font-['Inter'] text-[#6B6660] hover:text-[#323333]">
              返回
            </Button>
            <Button 
              onClick={handleComplete} 
              className="bg-[#2D5F2D] hover:bg-[#1E401E] text-white rounded-[10px] px-8 font-bold font-['Inter']"
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
    <div className={`w-full flex items-center justify-center p-4 ${isModal ? '' : 'min-h-screen bg-[#FBF9F6]'}`}>
      <div className="max-w-2xl w-full bg-white rounded-[24px] shadow-sm overflow-hidden border border-[#E5E1D8]">
        <div className="bg-[#FEFCFA] p-8 border-b border-[#E5E1D8]">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-['Merriweather'] text-[24px] font-bold text-[#323333]">精准意向配置</h2>
            <span className="font-['Inter'] text-[#9B9690] text-sm font-semibold bg-[#F5F3F0] px-3 py-1 rounded-full">
              步骤 {currentStep + 1} / {questions.length}
            </span>
          </div>
          <div className="w-full bg-[#E5E1D8] rounded-full h-1.5">
            <div className="bg-[#323333] h-1.5 rounded-full transition-all duration-500 ease-out" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <div className="p-10 min-h-[300px] bg-[#FBF9F6]/30">
          <h3 className="font-['Merriweather'] text-[22px] font-bold text-[#323333] mb-8">{currentQuestion.question}</h3>

          {currentQuestion.type === "text" && (
            <Input
              value={(formData[currentQuestion.id] as string) || ""}
              onChange={(e) => setFormData({ ...formData, [currentQuestion.id]: e.target.value })}
              placeholder={currentQuestion.placeholder}
              className="text-lg py-7 rounded-[12px] border border-[#E5E1D8] focus:border-[#323333] bg-white font-['Inter']"
            />
          )}

          {currentQuestion.type === "textarea" && (
            <Textarea
              value={(formData[currentQuestion.id] as string) || ""}
              onChange={(e) => setFormData({ ...formData, [currentQuestion.id]: e.target.value })}
              placeholder={currentQuestion.placeholder}
              className="text-lg min-h-[150px] rounded-[12px] border border-[#E5E1D8] focus:border-[#323333] bg-white font-['Inter']"
            />
          )}

          {currentQuestion.type === "multiselect" && currentQuestion.options && (
            <div className="grid grid-cols-2 gap-4">
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
                    className={`text-left px-5 py-4 rounded-[12px] border transition-all flex items-center justify-between font-['Inter'] ${
                      selected 
                      ? "border-[#323333] bg-[#EDE9E0] text-[#323333] shadow-sm" 
                      : "border-[#E5E1D8] hover:border-[#323333] bg-white text-[#6B6660]"
                    }`}
                  >
                    <span className="font-semibold text-[15px]">{option}</span>
                    {selected && <div className="w-5 h-5 bg-[#323333] rounded-full flex items-center justify-center"><Check className="w-3 h-3 text-white" /></div>}
                  </button>
                )
              })}
            </div>
          )}
        </div>

        <div className="border-t border-[#E5E1D8] p-8 flex justify-between bg-[#FEFCFA]">
          <Button variant="ghost" onClick={handleFormBack} disabled={currentStep === 0} className="font-['Inter'] text-[#6B6660] px-8">
            上一步
          </Button>
          <div className="flex gap-3">
            <Button variant="ghost" onClick={() => setMode("choice")} className="font-['Inter'] text-[#9B9690] hover:text-[#323333]">
              取消
            </Button>
            <Button onClick={handleFormNext} className="bg-[#323333] hover:bg-black text-white rounded-[10px] px-10 font-bold font-['Inter'] shadow-sm transition-transform active:scale-95">
              {currentStep === questions.length - 1 ? "完成并开始扫描" : "下一步"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
