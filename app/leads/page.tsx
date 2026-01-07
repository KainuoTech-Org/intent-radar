"use client"

import { Sidebar } from "@/components/sidebar"
import { IntentCard } from "@/components/intent-card"
import { Search, Filter, Download, Clock, CheckCircle2, XCircle, AlertCircle } from "lucide-react"
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
    <div className="flex h-screen bg-background">
      <Sidebar />

      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="border-b border-border px-8 py-6 bg-background">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-foreground">Saved Leads</h1>
            <button
              onClick={handleExport}
              disabled={leads.length === 0}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download size={18} />
              Export
            </button>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <input
                type="text"
                placeholder="Search leads..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-input text-foreground placeholder:text-muted-foreground rounded-xl pl-12 pr-4 py-3 border-0 focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-3 bg-secondary text-foreground rounded-xl hover:bg-gray-200 transition-colors">
              <Filter size={18} />
              Filters
            </button>
          </div>
        </div>

        {/* Status Tabs */}
        <div className="px-8 pt-6 pb-4 bg-background border-b border-border">
          <div className="flex gap-6">
            {(["all", "new", "contacting", "closed", "abandoned"] as const).map((status) => {
              const Icon = status !== "all" ? StatusIcon[status] : null
              return (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`pb-3 capitalize font-medium transition-colors flex items-center gap-2 ${
                    filter === status
                      ? "text-foreground border-b-2 border-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {Icon && <Icon size={16} />}
                  {status} ({statusCounts[status]})
                </button>
              )
            })}
          </div>
        </div>

        {/* Leads Grid */}
        <div className="flex-1 overflow-auto px-8 py-6 bg-background">
          {leads.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-24 h-24 rounded-full bg-secondary flex items-center justify-center mb-6">
                <svg
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  className="text-muted-foreground"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">No saved leads yet</h3>
              <p className="text-muted-foreground max-w-sm mb-6">
                Browse the Intent Inbox and click "Save" on high-quality intents to add them here for follow-up.
              </p>
              <a
                href="/"
                className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity font-medium"
              >
                Go to Intent Inbox
              </a>
            </div>
          ) : filteredLeads.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <p className="text-muted-foreground">No leads found with search/status: {searchQuery || filter}</p>
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
      </main>
    </div>
  )
}
