"use client"
import { useState, useEffect } from "react"
import { Sidebar } from "./sidebar"
import { IntentCard } from "./intent-card"
import { Search, Grid2x2, List, Bell, Sparkles, Plus } from "lucide-react"
import { AIQuestionnaire } from "./ai-questionnaire"
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"

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

export function Inbox() {
  const [view, setView] = useState<"grid" | "list">("grid")
  const [searchQuery, setSearchQuery] = useState("")
  const [intents, setIntents] = useState<Intent[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [dailyScans, setDailyScans] = useState(0)
  const MAX_FREE_SCANS = 3
  const MAX_FREE_VIEW = 5

  // Initialize from localStorage
  useEffect(() => {
    // 1. Load Intents
    const saved = localStorage.getItem("scannedIntents")
    if (saved) {
      try {
        setIntents(JSON.parse(saved))
      } catch (e) {
        console.error("Failed to load scanned intents", e)
      }
    }

    // 2. Manage Daily Scans
    const today = new Date().toDateString()
    const scanData = JSON.parse(localStorage.getItem("scanUsage") || "{}")
    if (scanData.date !== today) {
      localStorage.setItem("scanUsage", JSON.stringify({ date: today, count: 0 }))
      setDailyScans(0)
    } else {
      setDailyScans(scanData.count)
    }
  }, [])

  const handleScanComplete = (results: Intent[]) => {
    // 1. Increment scan count
    const today = new Date().toDateString()
    const newCount = dailyScans + 1
    localStorage.setItem("scanUsage", JSON.stringify({ date: today, count: newCount }))
    setDailyScans(newCount)

    // 2. Logic: If results is empty, don't clear the old successful scan!
    if (results && results.length > 0) {
      setIntents(results)
      localStorage.setItem("scannedIntents", JSON.stringify(results))
    } else {
      alert("全网雷达监测中：本次扫描未发现符合您业务特征的新意向，已为您保留之前的线索。建议尝试更换关键词或稍后再试。")
    }
    
    setIsDialogOpen(false)
  }

  const filteredIntents = intents.filter((intent) => {
    const searchLower = searchQuery.toLowerCase()
    return (
      intent.author.toLowerCase().includes(searchLower) ||
      intent.content.toLowerCase().includes(searchLower) ||
      intent.platform.toLowerCase().includes(searchLower)
    )
  })

  return (
    <div className="flex h-screen bg-[#f5f6fa] text-foreground">
      <Sidebar />

      <main className="flex-1 flex flex-col overflow-hidden">
        <div className="border-b border-gray-200 px-8 py-5 bg-white/80 backdrop-blur-sm shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex-1 max-w-xl">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search intents across all platforms..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-gray-50 text-gray-900 placeholder:text-gray-400 rounded-xl pl-11 pr-4 py-3 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 transition-all"
                />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden md:flex flex-col items-end mr-2">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Daily Radar</p>
                <p className="text-xs font-bold text-purple-600">{dailyScans} / {MAX_FREE_SCANS} Scans</p>
              </div>
              <Dialog open={isDialogOpen} onOpenChange={(open) => {
                if (open && dailyScans >= MAX_FREE_SCANS) {
                  alert("今日免费扫描次数已用完，明天再来或升级 Pro 版解锁无限扫描！");
                  return;
                }
                setIsDialogOpen(open);
              }}>
                <DialogTrigger asChild>
                  <button 
                    disabled={dailyScans >= MAX_FREE_SCANS}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold transition-all shadow-md ${
                      dailyScans >= MAX_FREE_SCANS 
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
                      : "bg-purple-600 text-white hover:bg-purple-700 active:scale-95 shadow-purple-100"
                    }`}
                  >
                    <Sparkles size={18} />
                    {dailyScans >= MAX_FREE_SCANS ? "次数已满" : "AI搜索助手"}
                  </button>
                </DialogTrigger>
                <DialogContent className="max-w-[1000px] p-0 overflow-hidden bg-transparent border-none shadow-none focus:outline-none">
                  <VisuallyHidden>
                    <DialogTitle>AI Search Assistant</DialogTitle>
                    <DialogDescription>
                      Configure your search parameters using AI to find potential leads.
                    </DialogDescription>
                  </VisuallyHidden>
                  <AIQuestionnaire isModal onComplete={handleScanComplete} />
                </DialogContent>
              </Dialog>

              <button className="relative p-2.5 hover:bg-gray-100 rounded-xl transition-colors">
                <Bell size={20} className="text-gray-700" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
              </button>
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-200 shadow-sm">
                <img
                  src="https://unavatar.io/github/johnson"
                  alt="User"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="px-8 pt-8 pb-5 bg-[#f5f6fa]">
          <h1 className="text-[32px] font-bold mb-7 text-gray-900 tracking-tight">Unified Intent Inbox</h1>

          <div className="flex items-center justify-between">
            <div className="flex gap-8">
              <button className="text-gray-900 font-semibold pb-3 border-b-2 border-purple-600 relative">
                最近意向
                <span className="ml-2 text-sm text-gray-400">({filteredIntents.length})</span>
              </button>
            </div>

            <div className="flex items-center gap-1.5 bg-white rounded-lg p-1 shadow-sm border border-gray-200">
              <button
                onClick={() => setView("grid")}
                className={`p-2.5 rounded-md transition-all ${
                  view === "grid"
                    ? "bg-purple-600 text-white shadow-sm"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                }`}
              >
                <Grid2x2 size={18} />
              </button>
              <button
                onClick={() => setView("list")}
                className={`p-2.5 rounded-md transition-all ${
                  view === "list"
                    ? "bg-purple-600 text-white shadow-sm"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                }`}
              >
                <List size={18} />
              </button>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-auto px-8 py-6 bg-[#f5f6fa]">
          {filteredIntents.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center max-w-md mx-auto">
              <div className="w-20 h-20 rounded-2xl bg-purple-50 flex items-center justify-center mb-6">
                <Sparkles className="w-10 h-10 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {searchQuery ? "未找到匹配意向" : "您的雷达尚未启动"}
              </h3>
              <p className="text-gray-500 mb-8 leading-relaxed">
                {searchQuery 
                  ? `没有找到包含 "${searchQuery}" 的意向帖子，请尝试更换关键词。`
                  : "点击右上角的 AI搜索助手，通过对话或问卷告诉 AI 您的业务需求，我们将为您全网搜寻潜在客户。"}
              </p>
              {!searchQuery && (
                <button 
                  onClick={() => setIsDialogOpen(true)}
                  className="flex items-center gap-2 px-8 py-3 rounded-xl font-bold bg-purple-600 text-white hover:bg-purple-700 transition-all shadow-lg shadow-purple-100 active:scale-95"
                >
                  <Plus size={20} />
                  立即配置雷达
                </button>
              )}
            </div>
          ) : (
            <div
              className={`grid gap-8 ${view === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3" : "grid-cols-1 max-w-4xl"}`}
            >
              {filteredIntents.slice(0, MAX_FREE_VIEW).map((intent) => (
                <IntentCard key={intent.id} intent={intent} />
              ))}
              
              {filteredIntents.length > MAX_FREE_VIEW && (
                <div className="rounded-2xl p-8 flex flex-col items-center justify-center text-center bg-gradient-to-b from-purple-50/50 to-white border-2 border-dashed border-purple-200 shadow-sm min-h-[300px]">
                  <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center mb-4">
                    <Plus className="w-8 h-8 text-purple-600" />
                  </div>
                  <h4 className="text-lg font-bold text-gray-900 mb-2">雷达探测到更多结果</h4>
                  <p className="text-sm text-gray-500 mb-6 px-4">
                    当前关键词下还有 <span className="font-bold text-purple-600">{filteredIntents.length - MAX_FREE_VIEW}</span> 条匹配线索。
                    升级到 <span className="font-bold text-gray-900">Pro 计划</span> 即可查看全部高意向商机并开启实时监测推送。
                  </p>
                  <button className="px-6 py-2.5 rounded-xl font-bold bg-gray-900 text-white hover:bg-black transition-all active:scale-95 shadow-lg shadow-gray-200">
                    了解 Pro 计划
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
