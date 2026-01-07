"use client"
import { useState } from "react"
import { Sidebar } from "./sidebar"
import { IntentCard } from "./intent-card"
import { Search, Grid2x2, List, Bell } from "lucide-react"
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
}

export function Inbox() {
  const [view, setView] = useState<"grid" | "list">("grid")
  const [intents] = useState<Intent[]>(DEMO_INTENTS)

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
                  placeholder="Search intents..."
                  className="w-full bg-gray-50 text-gray-900 placeholder:text-gray-400 rounded-xl pl-11 pr-4 py-3 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 transition-all"
                />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button className="relative p-2.5 hover:bg-gray-100 rounded-xl transition-colors">
                <Bell size={20} className="text-gray-700" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
              </button>
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-200 shadow-sm">
                <img
                  src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop"
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
                All
                <span className="ml-2 text-sm text-gray-500">({intents.length})</span>
              </button>
              <button className="text-gray-500 hover:text-gray-900 pb-3 flex items-center gap-1.5 font-medium transition-colors">
                AI Inbox
                <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
                  <path d="M6 8L2 4h8L6 8z" />
                </svg>
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
          <div
            className={`grid gap-8 ${view === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3" : "grid-cols-1 max-w-4xl"}`}
          >
            {intents.map((intent) => (
              <IntentCard key={intent.id} intent={intent} />
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
