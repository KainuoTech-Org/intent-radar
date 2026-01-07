"use client"
import type { Intent } from "./inbox"
import { ExternalLink, Bookmark, BookmarkCheck } from "lucide-react"
import { useState, useEffect } from "react"

const PlatformIcons = {
  xiaohongshu: ({ size = 36 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <text x="50%" y="70%" fontSize="16" fontWeight="bold" textAnchor="middle" fill="white">
        小红书
      </text>
    </svg>
  ),
  linkedin: ({ size = 36 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  ),
  x: ({ size = 36 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  ),
  telegram: ({ size = 36 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
    </svg>
  ),
  reddit: ({ size = 36 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <circle cx="9" cy="12" r="1.5" />
      <circle cx="15" cy="12" r="1.5" />
      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.01 13.5c.07 1.5-1.5 2.5-3 3-1.5.5-3.5.5-5 0s-3.07-1.5-3-3c0-.5.5-1 1-1s1 .5 1 1c-.03.5.5 1 1.5 1.5s2.5.5 3.5 0 1.53-1 1.5-1.5c0-.5.5-1 1-1s1 .5.5 1z" />
    </svg>
  ),
  facebook: ({ size = 36 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  ),
  instagram: ({ size = 36 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.057 1.645.069 4.849.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 0a4 4 0 110 8 4 4 0 010-8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  ),
}

const PLATFORM_CONFIG: Record<string, { bg: string; textColor: string }> = {
  xiaohongshu: { bg: "bg-red-500", textColor: "text-white" },
  linkedin: { bg: "bg-blue-600", textColor: "text-white" },
  x: { bg: "bg-black", textColor: "text-white" },
  telegram: { bg: "bg-cyan-400", textColor: "text-white" },
  reddit: { bg: "bg-orange-500", textColor: "text-white" },
  facebook: { bg: "bg-blue-700", textColor: "text-white" },
  instagram: { bg: "bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500", textColor: "text-white" },
}

export function IntentCard({ intent }: { intent: Intent }) {
  const [isSaved, setIsSaved] = useState(false)
  const platformConfig = PLATFORM_CONFIG[intent.platform]
  const PlatformIcon = PlatformIcons[intent.platform]

  useEffect(() => {
    const savedLeads = JSON.parse(localStorage.getItem("savedLeads") || "[]")
    setIsSaved(savedLeads.includes(intent.id))
  }, [intent.id])

  const handleViewPost = () => {
    console.log("[v0] Opening external platform:", intent.platform, intent.sourceUrl)
    if (intent.sourceUrl) {
      window.open(intent.sourceUrl, "_blank", "noopener,noreferrer")
    }
  }

  const handleSave = () => {
    const savedLeads = JSON.parse(localStorage.getItem("savedLeads") || "[]")
    const savedIntentsData = JSON.parse(localStorage.getItem("savedIntentsData") || "{}")

    if (isSaved) {
      const newSavedLeads = savedLeads.filter((id: string) => id !== intent.id)
      localStorage.setItem("savedLeads", JSON.stringify(newSavedLeads))
      delete savedIntentsData[intent.id]
      localStorage.setItem("savedIntentsData", JSON.stringify(savedIntentsData))
      setIsSaved(false)
      console.log("[v0] Intent unsaved:", intent.id)
    } else {
      savedLeads.push(intent.id)
      localStorage.setItem("savedLeads", JSON.stringify(savedLeads))
      savedIntentsData[intent.id] = {
        ...intent,
        savedAt: new Date().toISOString(),
        status: "new",
      }
      localStorage.setItem("savedIntentsData", JSON.stringify(savedIntentsData))
      setIsSaved(true)
      console.log("[v0] Intent saved:", intent.id)
    }
  }

  return (
    <div className="relative group">
      <div className="rounded-2xl p-6 relative h-full flex flex-col bg-white/90 backdrop-blur-sm border border-gray-200/50 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
        <div
          className={`absolute -top-7 -right-7 ${platformConfig.bg} ${platformConfig.textColor} w-[72px] h-[72px] rounded-2xl flex items-center justify-center shadow-lg transform group-hover:scale-110 group-hover:-translate-y-1 transition-all duration-300 border-4 border-white`}
          style={{ zIndex: 10 }}
        >
          <PlatformIcon size={36} />
        </div>

        <div className="mb-5">
          <div className="flex items-center gap-3 mb-5">
            <img
              src={intent.avatar || "/placeholder.svg"}
              alt={intent.author}
              className="w-12 h-12 rounded-full border-2 border-gray-200 object-cover shadow-sm"
            />
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900 text-[15px]">{intent.author}</p>
              <p className="text-xs text-gray-500">{intent.timeAgo}</p>
            </div>
          </div>

          <button
            onClick={handleViewPost}
            className="text-left w-full hover:bg-gray-50/80 -mx-2 px-2 py-2.5 rounded-lg transition-colors group/text"
          >
            <p className="text-sm text-gray-700 leading-relaxed line-clamp-3 group-hover/text:text-gray-900">
              {intent.content}
            </p>
          </button>
        </div>

        <div className="mt-auto space-y-2.5">
          <div className="flex justify-between items-center">
            <span className="text-xs font-medium text-gray-500">AI Intent Score</span>
            <span className="text-sm font-bold text-purple-600">
              {intent.intentScore}%{" "}
              <span className="text-gray-500 font-normal">
                ({intent.intentScore >= 90 ? "High" : intent.intentScore >= 80 ? "Medium" : "Low"})
              </span>
            </span>
          </div>
          <div className="h-2.5 rounded-full overflow-hidden bg-gray-100">
            <div
              className="h-full rounded-full transition-all duration-700 ease-out"
              style={{
                background: "linear-gradient(to right, rgb(139, 92, 246), rgb(168, 85, 247), rgb(192, 132, 252))",
                boxShadow: "0 0 16px rgba(139, 92, 246, 0.6), 0 2px 8px rgba(139, 92, 246, 0.3)",
                width: `${intent.intentScore}%`,
              }}
            />
          </div>
        </div>

        <div className="flex gap-2.5 mt-5 pt-5 border-t border-gray-200">
          <button
            onClick={handleViewPost}
            className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white hover:from-purple-700 hover:to-purple-800 rounded-lg py-2.5 transition-all text-sm font-medium shadow-sm hover:shadow-md"
          >
            <ExternalLink size={16} />
            View Post
          </button>
          <button
            onClick={handleSave}
            className={`flex-1 flex items-center justify-center gap-2 rounded-lg py-2.5 transition-all text-sm font-medium ${
              isSaved
                ? "bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200"
                : "bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200"
            }`}
          >
            {isSaved ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
            {isSaved ? "Saved" : "Save"}
          </button>
        </div>
      </div>
    </div>
  )
}
