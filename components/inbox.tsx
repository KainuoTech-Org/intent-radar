"use client"
import { useState, useEffect } from "react"
import { Sidebar } from "./sidebar"
import { Footer } from "./footer"
import { Search, Sparkles, Plus, MoreVertical } from "lucide-react"
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

const IntentTag = ({ score }: { score: number }) => {
  if (score >= 80) {
    return (
      <div className="flex items-center gap-2">
        <div className="bg-[#D4E7D4] px-2 py-0.5 rounded-full flex items-center">
          <span className="text-[#2D5F2D] text-[13px] font-medium font-['Inter']">{score}% Purchase Intent</span>
        </div>
        <span className="bg-[#D4E7D4] px-2 py-0.5 rounded-full text-[#2D5F2D] text-[12px] font-medium font-['Inter']">positive</span>
      </div>
    )
  }
  return (
    <div className="flex items-center gap-2">
      <div className="bg-[#E8E5E0] px-2 py-0.5 rounded-full flex items-center">
        <span className="text-[#5A5550] text-[13px] font-medium font-['Inter']">{score}% Inquiry</span>
      </div>
      <span className="bg-[#E8E5E0] px-2 py-0.5 rounded-full text-[#5A5550] text-[12px] font-medium font-['Inter']">neutral</span>
    </div>
  )
}

const PlatformIcon = ({ platform }: { platform: string }) => {
  const colors: Record<string, string> = {
    linkedin: "#0A66C2",
    xiaohongshu: "#FF2442",
    facebook: "#1877F2",
    instagram: "#E4405F",
    reddit: "#FF4500",
    x: "#000000"
  }
  
  const initials: Record<string, string> = {
    linkedin: "in",
    xiaohongshu: "小",
    facebook: "f",
    instagram: "ig",
    reddit: "r",
    x: "x"
  }

  return (
    <div 
      className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-[14px]"
      style={{ backgroundColor: colors[platform] || "#333" }}
    >
      {initials[platform] || platform[0]}
    </div>
  )
}

export function Inbox() {
  const [searchQuery, setSearchQuery] = useState("")
  const [intents, setIntents] = useState<Intent[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [dailyScans, setDailyScans] = useState(0)
  const MAX_FREE_SCANS = 9999

  // Initialize from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("scannedIntents")
    if (saved) {
      try {
        setIntents(JSON.parse(saved))
      } catch (e) {
        console.error("Failed to load scanned intents", e)
      }
    }

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
    const today = new Date().toDateString()
    const newCount = dailyScans + 1
    localStorage.setItem("scanUsage", JSON.stringify({ date: today, count: newCount }))
    setDailyScans(newCount)

    if (results && results.length > 0) {
      setIntents(results)
      localStorage.setItem("scannedIntents", JSON.stringify(results))
    } else {
      alert("No new intents found. Keeping previous results.")
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
    <div className="flex h-screen bg-[#FBF9F6]">
      <Sidebar />

      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header Area */}
        <div className="h-[151.5px] border-b border-[#E5E1D8] px-6 pt-6 bg-[#FEFCFA] flex flex-col justify-between shrink-0">
            <div>
                <h1 className="font-['Merriweather'] text-[28px] font-bold text-[#323333]">Intent Inbox</h1>
                <div className="mt-4 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9B9690]" size={20} />
                    <input
                        type="text"
                        placeholder="Search leads..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full h-[44.5px] bg-[#FBF9F6] border border-[#E5E1D8] rounded-[10px] pl-10 pr-4 text-[#323333] placeholder-[#9B9690] focus:outline-none focus:border-[#323333] transition-colors font-['Inter']"
                    />
                </div>
            </div>
            
            {/* AI Trigger (Hidden in strict UI but kept for functionality) */}
            <div className="absolute top-6 right-6">
                 <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <button className="flex items-center gap-2 bg-[#323333] text-white px-4 py-2 rounded-[10px] hover:bg-black transition-colors">
                            <Plus size={18} />
                            <span className="font-['Inter'] text-[14px] font-medium">New Scan</span>
                        </button>
                    </DialogTrigger>
                    <DialogContent className="max-w-[1000px] p-0 overflow-hidden bg-transparent border-none shadow-none focus:outline-none">
                        <VisuallyHidden>
                            <DialogTitle>AI Search</DialogTitle>
                            <DialogDescription>Start a new search</DialogDescription>
                        </VisuallyHidden>
                        <AIQuestionnaire isModal onComplete={handleScanComplete} />
                    </DialogContent>
                </Dialog>
            </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto bg-[#FBF9F6]">
            <div className="max-w-[800px] mx-auto py-6 px-6">
                {filteredIntents.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="w-16 h-16 bg-[#E5E1D8] rounded-full flex items-center justify-center mb-4">
                            <Sparkles className="text-[#6B6660]" />
                        </div>
                        <h3 className="font-['Merriweather'] text-[20px] font-bold text-[#323333] mb-2">Ready to find customers?</h3>
                        <p className="font-['Inter'] text-[#6B6660] mb-6">Start a new scan to populate your inbox.</p>
                    </div>
                ) : (
                    <div className="space-y-0">
                        {filteredIntents.map((intent) => (
                            <div key={intent.id} className="h-[161.5px] border-b border-[#E5E1D8] flex items-start py-5 hover:bg-white transition-colors group cursor-pointer relative">
                                <PlatformIcon platform={intent.platform} />
                                <div className="ml-3 flex-1">
                                    {/* Author Line */}
                                    <div className="flex items-center mb-1">
                                        <span className="font-['Inter'] text-[15px] font-semibold text-[#323333]">{intent.author}</span>
                                        <span className="font-['Inter'] text-[13px] text-[#6B6660] ml-2">· {intent.platform}</span>
                                        <span className="font-['Inter'] text-[12px] text-[#9B9690] ml-auto">{intent.timeAgo}</span>
                                    </div>
                                    
                                    {/* Intent Tags */}
                                    <div className="mb-2">
                                        <IntentTag score={intent.intentScore} />
                                    </div>

                                    {/* Content */}
                                    <p className="font-['Inter'] text-[14px] text-[#6B6660] line-clamp-2 leading-relaxed">
                                        {intent.content}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            
            {/* Footer attached to bottom of scroll area */}
            <Footer />
        </div>
      </main>
    </div>
  )
}
