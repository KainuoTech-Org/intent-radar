"use client"

import { PageLayout } from "@/components/page-layout"
import { Clock, Trash2, Filter } from "lucide-react"
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
      className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-[14px] shrink-0"
      style={{ backgroundColor: colors[platform] || "#333" }}
    >
      {initials[platform] || platform[0]}
    </div>
  )
}

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [filter, setFilter] = useState<"all" | "new" | "contacting" | "closed" | "abandoned">("all")

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
    return filter === "all" || lead.status === filter
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
    
    const leadsArray = Object.values(savedIntentsData) as Lead[]
    setLeads(leadsArray.sort((a, b) => new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime()))
  }

  return (
    <PageLayout title="Saved Leads" subtitle="Manage and track your high-intent prospects">
      <div className="max-w-[800px] mx-auto py-8 px-6">
        {/* Tabs */}
        <div className="flex gap-8 border-b border-[#E5E1D8] mb-8">
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

        {filteredLeads.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 bg-[#F5F3F0] rounded-full flex items-center justify-center mb-4">
              <Clock className="text-[#9B9690]" />
            </div>
            <h3 className="font-['Merriweather'] text-[20px] font-bold text-[#323333] mb-2">No leads found</h3>
            <p className="font-['Inter'] text-[#6B6660]">Save intents to manage them here.</p>
          </div>
        ) : (
          <div className="space-y-0">
            {filteredLeads.map((lead) => (
              <div key={lead.id} className="group border-b border-[#E5E1D8] py-6 hover:bg-white transition-all relative px-4 -mx-4 rounded-lg">
                <div className="flex items-start gap-4">
                  <PlatformIcon platform={lead.platform} />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-[#323333] text-[15px]">{lead.author}</span>
                        <span className="text-[#9B9690] text-[13px]">· {lead.platform}</span>
                      </div>
                      <span className="text-[#9B9690] text-[12px]">{lead.timeAgo}</span>
                    </div>
                    
                    <div className="mb-3">
                      <IntentTag score={lead.intentScore} />
                    </div>

                    <p className="text-[14px] text-[#6B6660] leading-relaxed line-clamp-2 font-['Inter'] mb-4">
                      {lead.content}
                    </p>

                    <div className="flex items-center gap-4">
                      <select 
                        value={lead.status}
                        onChange={(e) => handleUpdateStatus(lead.id, e.target.value as any)}
                        className="bg-[#F5F3F0] text-[#323333] text-[12px] px-3 py-1.5 rounded-[6px] border-none focus:ring-1 focus:ring-[#323333] cursor-pointer font-medium"
                      >
                        <option value="new">New</option>
                        <option value="contacting">Contacting</option>
                        <option value="closed">Closed</option>
                        <option value="abandoned">Abandoned</option>
                      </select>
                      
                      <button 
                        onClick={() => handleDelete(lead.id)}
                        className="p-2 text-[#9B9690] hover:text-[#EF4444] transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
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
