"use client"

"use client"

import { useState, useEffect } from "react"
import { PageLayout } from "@/components/page-layout"
import { Sparkles } from "lucide-react"

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
      className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-[14px] shrink-0"
      style={{ backgroundColor: colors[platform] || "#333" }}
    >
      {initials[platform] || platform[0]}
    </div>
  )
}

export default function Page() {
  const [intents, setIntents] = useState<Intent[]>([])

  useEffect(() => {
    const saved = localStorage.getItem("scannedIntents")
    if (saved) {
      try {
        setIntents(JSON.parse(saved))
      } catch (e) {
        console.error("Failed to load scanned intents", e)
      }
    }
  }, [])

  const handleScanComplete = (results: Intent[]) => {
    if (results && results.length > 0) {
      setIntents(results)
      localStorage.setItem("scannedIntents", JSON.stringify(results))
    }
  }

  return (
    <PageLayout 
      title="Intent Inbox" 
      showNewScan={true}
      onScanComplete={handleScanComplete}
    >
      <div className="max-w-[800px] mx-auto py-8 px-6">
        {intents.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="w-16 h-16 bg-[#F5F3F0] rounded-full flex items-center justify-center mb-6">
              <Sparkles className="text-[#9B9690]" size={32} />
            </div>
            <h3 className="font-['Merriweather'] text-[24px] font-bold text-[#323333] mb-3">Ready to find customers?</h3>
            <p className="font-['Inter'] text-[#6B6660] max-w-sm">
              Start a new AI scan to populate your inbox with high-intent leads from social media.
            </p>
          </div>
        ) : (
          <div className="space-y-0">
            {intents.map((intent) => (
              <div 
                key={intent.id} 
                className="group border-b border-[#E5E1D8] py-6 hover:bg-white transition-all cursor-pointer relative px-4 -mx-4 rounded-lg"
                onClick={() => window.open(intent.sourceUrl, "_blank")}
              >
                <div className="flex items-start gap-4">
                  <PlatformIcon platform={intent.platform} />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-[#323333] text-[15px]">{intent.author}</span>
                        <span className="text-[#9B9690] text-[13px]">· {intent.platform}</span>
                      </div>
                      <span className="text-[#9B9690] text-[12px]">{intent.timeAgo}</span>
                    </div>
                    
                    <div className="mb-3">
                      <IntentTag score={intent.intentScore} />
                    </div>

                    <p className="text-[14px] text-[#6B6660] leading-relaxed line-clamp-2 font-['Inter']">
                      {intent.content}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </PageLayout>
  )
}
