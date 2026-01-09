"use client"

import { Sidebar } from "@/components/sidebar"
import { IntentCard } from "@/components/intent-card"
import { Search, Filter, Download, Clock, CheckCircle2, XCircle, AlertCircle, Bell } from "lucide-react"
import { useState, useEffect } from "react"
import type { Intent } from "@/components/inbox"

interface Lead extends Intent {
  savedAt: string
  status: "new" | "contacting" | "closed" | "abandoned"
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
      console.log("[v0] Loaded leads:", leadsArray.length)
    }

    loadLeads()

    // Listen for storage changes to update in real-time
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

  const handleExport = () => {
    const csv = [
      ["Platform", "Author", "Content", "Intent Score", "Saved At", "Status", "URL"].join(","),
      ...leads.map((lead) =>
        [
          lead.platform,
          `"${lead.author}"`,
          `"${lead.content.replace(/"/g, '""')}"`,
          lead.intentScore,
          lead.savedAt,
          lead.status,
          lead.sourceUrl,
        ].join(","),
      ),
    ].join("\n")

    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `intentradar-leads-${new Date().toISOString().split("T")[0]}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    console.log("[v0] Exported leads to CSV")
  }

  const StatusIcon = {
    new: Clock,
    contacting: AlertCircle,
    closed: CheckCircle2,
    abandoned: XCircle,
  }

  const handleUpdateStatus = (id: string, newStatus: Lead["status"]) => {
    const savedIntentsData = JSON.parse(localStorage.getItem("savedIntentsData") || "{}")
    if (savedIntentsData[id]) {
      savedIntentsData[id].status = newStatus
      localStorage.setItem("savedIntentsData", JSON.stringify(savedIntentsData))
      
      // Force update local state
      setLeads(Object.values(savedIntentsData).sort((a: any, b: any) => 
        new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime()
      ) as Lead[])
    }
  }

  const handleUpdateNote = (id: string, note: string) => {
    const savedIntentsData = JSON.parse(localStorage.getItem("savedIntentsData") || "{}")
    if (savedIntentsData[id]) {
      if (!savedIntentsData[id].notes) savedIntentsData[id].notes = []
      savedIntentsData[id].notes.push(note)
      localStorage.setItem("savedIntentsData", JSON.stringify(savedIntentsData))
      
      // Force update local state
      setLeads(Object.values(savedIntentsData).sort((a: any, b: any) => 
        new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime()
      ) as Lead[])
    }
  }

  return (
    <div className="flex h-screen bg-[#fbfbfb] text-[#212121]">
      <Sidebar />

      <main className="flex-1 flex flex-col overflow-y-auto">
         {/* Top Header */}
        <div className="px-10 py-6 flex items-center justify-between sticky top-0 bg-[#fbfbfb]/90 backdrop-blur-md z-10">
            <h1 className="font-['Merriweather'] text-[24px] font-bold text-[#1f2937] tracking-tight">
                Saved Leads
            </h1>
            
            <div className="flex items-center gap-6">
                 {/* Search Bar */}
                 <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search saved leads..."
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

        <div className="px-10 pb-4">
             {/* Header Controls */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex gap-1">
                    {(["all", "new", "contacting", "closed", "abandoned"] as const).map((status) => {
                    const Icon = status !== "all" ? StatusIcon[status] : null
                    return (
                        <button
                        key={status}
                        onClick={() => setFilter(status)}
                        className={`px-4 py-2 rounded-lg capitalize font-medium transition-all flex items-center gap-2 text-sm font-['Outfit'] ${
                            filter === status
                            ? "bg-[#212121] text-white shadow-md"
                            : "text-gray-500 hover:bg-gray-100"
                        }`}
                        >
                        {Icon && <Icon size={14} />}
                        {status} 
                        <span className={`ml-1 px-1.5 py-0.5 rounded text-[10px] ${filter === status ? "bg-white/20 text-white" : "bg-gray-100 text-gray-600"}`}>
                            {statusCounts[status]}
                        </span>
                        </button>
                    )
                    })}
                </div>
                
                 <button
                    onClick={handleExport}
                    disabled={leads.length === 0}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-[#212121] rounded-lg hover:bg-gray-50 transition-all text-sm font-medium shadow-sm disabled:opacity-50 disabled:cursor-not-allowed font-['Outfit']"
                    >
                    <Download size={16} />
                    Export CSV
                </button>
            </div>


            {/* Leads Grid */}
            <div className="min-h-[400px]">
            {leads.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-[400px] text-center bg-white rounded-2xl border border-dashed border-gray-200">
                <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mb-4">
                     <Clock className="text-gray-300" size={32} />
                </div>
                <h3 className="text-lg font-bold text-[#1f2937] mb-2 font-['Merriweather']">No saved leads yet</h3>
                <p className="text-gray-500 max-w-sm mb-6 font-['Roboto']">
                    Browse the Intent Inbox and click "Save" on high-quality intents to add them here for follow-up.
                </p>
                <a
                    href="/"
                    className="px-6 py-2.5 bg-[#212121] text-white rounded-xl hover:bg-black transition-all font-medium font-['Outfit'] shadow-lg"
                >
                    Go to Intent Inbox
                </a>
                </div>
            ) : filteredLeads.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-[200px] text-center">
                <p className="text-gray-400 font-['Roboto']">No leads found matching your filters.</p>
                </div>
            ) : (
                <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {filteredLeads.map((lead) => (
                    <IntentCard 
                    key={lead.id} 
                    intent={lead} 
                    showStatus={true}
                    onUpdateStatus={(newStatus) => handleUpdateStatus(lead.id, newStatus)}
                    onUpdateNote={(note) => handleUpdateNote(lead.id, note)}
                    />
                ))}
                </div>
            )}
            </div>
        </div>
      </main>
    </div>
  )
}
