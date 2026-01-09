"use client"
import { useState, useEffect } from "react"
import { Sidebar } from "./sidebar"
import { IntentCard } from "./intent-card"
import { Search, Grid2x2, List, Bell, Sparkles, Plus, TrendingUp, MoreHorizontal, ArrowUpRight } from "lucide-react"
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
  const [view, setView] = useState<"grid" | "list">("list")
  const [searchQuery, setSearchQuery] = useState("")
  const [intents, setIntents] = useState<Intent[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [dailyScans, setDailyScans] = useState(0)
  const MAX_FREE_SCANS = 9999
  const MAX_FREE_VIEW = 9999

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
    <div className="flex h-screen bg-[#fbfbfb] text-[#212121]">
      <Sidebar />

      <main className="flex-1 flex flex-col overflow-y-auto">
        {/* Top Header */}
        <div className="px-10 py-6 flex items-center justify-between sticky top-0 bg-[#fbfbfb]/90 backdrop-blur-md z-10">
            <h1 className="font-['Merriweather'] text-[24px] font-bold text-[#1f2937] tracking-tight">
                Dashboard
            </h1>
            
            <div className="flex items-center gap-6">
                 {/* Search Bar */}
                 <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search intents..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-[280px] bg-white text-gray-900 placeholder:text-gray-400 rounded-lg pl-10 pr-4 py-2 border border-gray-200 focus:outline-none focus:ring-1 focus:ring-gray-300 transition-all font-['Roboto'] text-sm shadow-sm"
                    />
                </div>

                {/* Notifications */}
                <button className="relative p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <Bell size={20} className="text-gray-600" />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-[#fbfbfb]" />
                </button>

                 {/* User Profile */}
                <div className="flex items-center gap-3 cursor-pointer">
                    <div className="text-right hidden md:block">
                        <p className="text-sm font-semibold text-[#212121]">Johnson G.</p>
                        <p className="text-xs text-gray-500">Premium Plan</p>
                    </div>
                    <img
                        src="https://unavatar.io/github/johnson"
                        alt="User"
                        className="w-10 h-10 rounded-full object-cover border border-gray-200"
                    />
                </div>
            </div>
        </div>

        <div className="px-10 pb-10 space-y-8">
            {/* KPI Cards Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Intents Processed Card */}
                <div className="bg-white rounded-2xl p-6 border border-[#e5e5e5] shadow-sm flex flex-col justify-between h-[160px]">
                    <div className="flex justify-between items-start">
                        <span className="font-['Roboto'] text-[16px] font-semibold text-[#1f2937]">Intents Processed</span>
                        <MoreHorizontal size={20} className="text-gray-400 cursor-pointer" />
                    </div>
                    <div>
                        <div className="flex items-end gap-3 mb-1">
                            <span className="font-['Merriweather'] text-[36px] font-bold text-[#1f2937] leading-none">
                                {filteredIntents.length > 0 ? filteredIntents.length * 12 + 34 : "0"}
                            </span>
                            <span className="text-sm font-medium text-green-600 mb-1 flex items-center bg-green-50 px-1.5 py-0.5 rounded">
                                +5% <TrendingUp size={12} className="ml-1" />
                            </span>
                        </div>
                        <p className="text-xs text-gray-400">Total intents analyzed this month</p>
                    </div>
                </div>

                {/* AI Assistant Trigger Card */}
                <div className="col-span-2 bg-gradient-to-r from-[#212121] to-[#374151] rounded-2xl p-8 text-white shadow-lg flex items-center justify-between relative overflow-hidden group">
                     <div className="absolute right-0 top-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
                     <div className="relative z-10">
                        <h3 className="font-['Merriweather'] text-2xl font-bold mb-2">New Scan Available</h3>
                        <p className="text-gray-300 max-w-md mb-6 font-['Roboto']">
                            Start a new comprehensive AI scan across all social platforms to find your next customer.
                        </p>
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
                                    className="bg-white text-[#212121] px-6 py-2.5 rounded-lg font-bold flex items-center gap-2 hover:bg-gray-100 transition-colors active:scale-95"
                                >
                                    <Sparkles size={18} />
                                    {dailyScans >= MAX_FREE_SCANS ? "Limit Reached" : "Start Radar Scan"}
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
                     </div>
                     <div className="hidden lg:block relative z-10">
                        <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/20">
                            <Sparkles size={40} className="text-white" />
                        </div>
                     </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Intents List (Left 2/3) */}
                <div className="lg:col-span-2 bg-white rounded-2xl border border-[#e5e5e5] shadow-sm flex flex-col overflow-hidden min-h-[600px]">
                    <div className="px-6 py-5 border-b border-[#e5e5e5] flex justify-between items-center bg-gray-50/50">
                        <h3 className="font-['Roboto'] text-[18px] font-semibold text-[#1f2937]">Recent Intents</h3>
                        <div className="flex gap-2 bg-white p-1 rounded-lg border border-gray-200">
                             <button
                                onClick={() => setView("list")}
                                className={`p-1.5 rounded-md transition-all ${
                                view === "list" ? "bg-gray-100 text-gray-900" : "text-gray-400 hover:text-gray-600"
                                }`}
                            >
                                <List size={16} />
                            </button>
                            <button
                                onClick={() => setView("grid")}
                                className={`p-1.5 rounded-md transition-all ${
                                view === "grid" ? "bg-gray-100 text-gray-900" : "text-gray-400 hover:text-gray-600"
                                }`}
                            >
                                <Grid2x2 size={16} />
                            </button>
                        </div>
                    </div>

                    <div className="p-6 overflow-y-auto max-h-[600px] bg-white">
                        {filteredIntents.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 text-center">
                                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                                    <Search className="text-gray-400" size={24} />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 mb-2">No intents found</h3>
                                <p className="text-gray-500 max-w-xs">Try starting a new scan to find potential customers.</p>
                            </div>
                        ) : (
                             <div className={`grid gap-4 ${view === "grid" ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1"}`}>
                                {filteredIntents.slice(0, MAX_FREE_VIEW).map((intent) => (
                                    <IntentCard key={intent.id} intent={intent} />
                                ))}
                             </div>
                        )}
                    </div>
                </div>

                {/* Intent Summary (Right 1/3) */}
                <div className="bg-white rounded-2xl border border-[#e5e5e5] shadow-sm flex flex-col overflow-hidden h-fit">
                    <div className="px-6 py-5 border-b border-[#e5e5e5] flex justify-between items-center bg-gray-50/50">
                        <h3 className="font-['Roboto'] text-[18px] font-semibold text-[#1f2937]">Intent Summary</h3>
                        <MoreHorizontal size={18} className="text-gray-400" />
                    </div>
                    <div className="p-6">
                        <div className="relative pl-6 border-l-2 border-gray-100 space-y-8">
                             {/* Timeline Items */}
                            {[
                                { label: "High Intent", count: 12, color: "bg-green-500" },
                                { label: "Medium Intent", count: 45, color: "bg-yellow-500" },
                                { label: "Low Intent", count: 28, color: "bg-gray-400" },
                                { label: "Archived", count: 105, color: "bg-gray-300" }
                            ].map((item, idx) => (
                                <div key={idx} className="relative">
                                    <span className={`absolute -left-[31px] top-1 w-4 h-4 rounded-full border-2 border-white ${item.color} shadow-sm`}></span>
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="font-['Outfit'] font-medium text-[#1f2937]">{item.label}</span>
                                        <span className="text-sm font-bold text-gray-900">{item.count}</span>
                                    </div>
                                    <div className="w-full bg-gray-100 rounded-full h-1.5 mt-2">
                                        <div className={`h-1.5 rounded-full ${item.color}`} style={{ width: `${Math.random() * 60 + 20}%` }}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        <div className="mt-8 pt-6 border-t border-gray-100">
                             <h4 className="font-['Outfit'] text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Top Platforms</h4>
                             <div className="flex gap-4">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                                    <span className="text-sm font-medium text-gray-600">LinkedIn</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                    <span className="text-sm font-medium text-gray-600">Xiaohongshu</span>
                                </div>
                             </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </main>
    </div>
  )
}
