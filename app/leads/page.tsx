"use client"

import { Sidebar } from "@/components/sidebar"
import { Footer } from "@/components/footer"
import { Search, Filter, Download, Clock, CheckCircle2, XCircle, AlertCircle, Trash2 } from "lucide-react"
import { useState, useEffect } from "react"
import type { Intent } from "@/components/inbox"

interface Lead extends Intent {
  savedAt: string
  status: "new" | "contacting" | "closed" | "abandoned"
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

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [filter, setFilter] = useState<"all" | "new" | "contacting" | "closed" | "abandoned">("all")
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    const loadLeads = () => {
      const savedIntentsData = JSON.parse(localStorage.getItem("savedIntentsData") || "{}")
      const leadsArray = Object.values(savedIntentsData) as Lead[]
      setLeads(leadsArray.sort((a, b) => new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime()))
    }

    loadLeads()
    window.addEventListener("storage", loadLeads)
    return () => window.removeEventListener("storage", loadLeads)
  }, [])

  const filteredLeads = leads.filter((lead) => {
    const matchesFilter = filter === "all" || lead.status === filter
    const searchLower = searchQuery.toLowerCase()
    const matchesSearch =
      lead.author.toLowerCase().includes(searchLower) ||
      lead.content.toLowerCase().includes(searchLower) ||
      lead.platform.toLowerCase().includes(searchLower)
    return matchesFilter && matchesSearch
  })

  const statusCounts = {
    all: leads.length,
    new: leads.filter((l) => l.status === "new").length,
    contacting: leads.filter((l) => l.status === "contacting").length,
    closed: leads.filter((l) => l.status === "closed").length,
    abandoned: leads.filter((l) => l.status === "abandoned").length,
  }

  const handleUpdateStatus = (id: string, newStatus: Lead["status"]) => {
    const savedIntentsData = JSON.parse(localStorage.getItem("savedIntentsData") || "{}")
    if (savedIntentsData[id]) {
      savedIntentsData[id].status = newStatus
      localStorage.setItem("savedIntentsData", JSON.stringify(savedIntentsData))
      const leadsArray = Object.values(savedIntentsData) as Lead[]
      setLeads(leadsArray.sort((a, b) => new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime()))
    }
  }

  const handleDelete = (id: string) => {
    const savedIntentsData = JSON.parse(localStorage.getItem("savedIntentsData") || "{}")
    const savedLeads = JSON.parse(localStorage.getItem("savedLeads") || "[]")
    
    delete savedIntentsData[id]
    const newSavedLeads = savedLeads.filter((leadId: string) => leadId !== id)
    
    localStorage.setItem("savedIntentsData", JSON.stringify(savedIntentsData))
    localStorage.setItem("savedLeads", JSON.stringify(newSavedLeads))
    
    // Force reload
    const leadsArray = Object.values(savedIntentsData) as Lead[]
    setLeads(leadsArray.sort((a, b) => new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime()))
  }

  return (
    <div className="flex h-screen bg-[#FBF9F6]">
      <Sidebar />

      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header Area */}
        <div className="h-[151.5px] border-b border-[#E5E1D8] px-6 pt-6 bg-[#FEFCFA] flex flex-col justify-between shrink-0">
            <div>
                <h1 className="font-['Merriweather'] text-[28px] font-bold text-[#323333]">Saved Leads</h1>
                <div className="flex gap-4 mt-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9B9690]" size={20} />
                        <input
                            type="text"
                            placeholder="Search saved leads..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full h-[44.5px] bg-[#FBF9F6] border border-[#E5E1D8] rounded-[10px] pl-10 pr-4 text-[#323333] placeholder-[#9B9690] focus:outline-none focus:border-[#323333] transition-colors font-['Inter']"
                        />
                    </div>
                    <button className="h-[44.5px] px-4 flex items-center gap-2 border border-[#E5E1D8] rounded-[10px] bg-[#FEFCFA] hover:bg-[#FBF9F6] text-[#6B6660]">
                        <Filter size={18} />
                        <span className="font-['Inter'] text-[14px]">Filter</span>
                    </button>
                </div>
            </div>
            
            {/* Tabs */}
            <div className="flex gap-8">
                {(["all", "new", "contacting", "closed", "abandoned"] as const).map((status) => (
                    <button
                        key={status}
                        onClick={() => setFilter(status)}
                        className={`pb-3 border-b-2 font-['Inter'] text-[14px] capitalize transition-colors flex items-center gap-2 ${
                            filter === status
                                ? "border-[#323333] text-[#323333] font-medium"
                                : "border-transparent text-[#9B9690] hover:text-[#6B6660]"
                        }`}
                    >
                        {status} 
                        <span className={`px-1.5 py-0.5 rounded-full text-[11px] ${filter === status ? "bg-[#EDE9E0] text-[#323333]" : "bg-[#F5F3F0] text-[#9B9690]"}`}>
                            {statusCounts[status]}
                        </span>
                    </button>
                ))}
            </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto bg-[#FBF9F6]">
            <div className="max-w-[800px] mx-auto py-6 px-6">
                {filteredLeads.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="w-16 h-16 bg-[#E5E1D8] rounded-full flex items-center justify-center mb-4">
                            <Clock className="text-[#6B6660]" />
                        </div>
                        <h3 className="font-['Merriweather'] text-[20px] font-bold text-[#323333] mb-2">No leads here yet</h3>
                        <p className="font-['Inter'] text-[#6B6660]">Save high-quality intents to manage them here.</p>
                    </div>
                ) : (
                    <div className="space-y-0">
                        {filteredLeads.map((lead) => (
                            <div key={lead.id} className="border-b border-[#E5E1D8] py-5 hover:bg-white transition-colors group relative pr-20">
                                <div className="flex items-start">
                                    <PlatformIcon platform={lead.platform} />
                                    <div className="ml-3 flex-1">
                                        <div className="flex items-center mb-1">
                                            <span className="font-['Inter'] text-[15px] font-semibold text-[#323333]">{lead.author}</span>
                                            <span className="font-['Inter'] text-[13px] text-[#6B6660] ml-2">· {lead.platform}</span>
                                            <span className="font-['Inter'] text-[12px] text-[#9B9690] ml-auto">{lead.timeAgo}</span>
                                        </div>
                                        
                                        <div className="mb-2">
                                            <IntentTag score={lead.intentScore} />
                                        </div>

                                        <p className="font-['Inter'] text-[14px] text-[#6B6660] line-clamp-2 leading-relaxed mb-3">
                                            {lead.content}
                                        </p>

                                        {/* Quick Actions */}
                                        <div className="flex gap-2">
                                            <select 
                                                value={lead.status}
                                                onChange={(e) => handleUpdateStatus(lead.id, e.target.value as any)}
                                                className="bg-[#F5F3F0] text-[#6B6660] text-[12px] px-2 py-1 rounded border-none focus:ring-0 cursor-pointer"
                                            >
                                                <option value="new">New</option>
                                                <option value="contacting">Contacting</option>
                                                <option value="closed">Closed</option>
                                                <option value="abandoned">Abandoned</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Delete Action (Hover) */}
                                <button 
                                    onClick={() => handleDelete(lead.id)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-[#9B9690] hover:text-[#EF4444] opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            
            <Footer />
        </div>
      </main>
    </div>
  )
}
