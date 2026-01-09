"use client"

import { PageLayout } from "@/components/page-layout"
import { TrendingUp, Users, Zap, BarChart3, ArrowUpRight } from "lucide-react"
import { useState, useEffect } from "react"

export default function AnalyticsPage() {
  const [stats, setStats] = useState([
    { label: "Total Leads", value: "0", change: "+0%", icon: Zap },
    { label: "Conversion Rate", value: "0%", change: "+0%", icon: TrendingUp },
    { label: "Revenue Generated", value: "$0", change: "+0%", icon: BarChart3 },
    { label: "Avg Intent Score", value: "0", change: "+0%", icon: Users },
  ])

  const [platformData, setPlatformData] = useState([
    { name: "LinkedIn", count: 0, color: "bg-[#0A66C2]" },
    { name: "Xiaohongshu", count: 0, color: "bg-[#FF2442]" },
    { name: "Facebook", count: 0, color: "bg-[#1877F2]" },
    { name: "X (Twitter)", count: 0, color: "bg-[#000000]" },
  ])

  useEffect(() => {
    const saved = localStorage.getItem("scannedIntents")
    if (saved) {
      try {
        const intents = JSON.parse(saved)
        const total = intents.length
        if (total > 0) {
          const avgScore = Math.round(intents.reduce((acc: number, curr: any) => acc + curr.intentScore, 0) / total)
          const platforms = intents.reduce((acc: any, curr: any) => {
            acc[curr.platform] = (acc[curr.platform] || 0) + 1
            return acc
          }, {})

          setStats([
            { label: "Total Leads", value: total.toLocaleString(), change: "+12%", icon: Zap },
            { label: "Conversion Rate", value: "42.9%", change: "+8%", icon: TrendingUp },
            { label: "Revenue Generated", value: `$${(total * 1.2).toFixed(1)}K`, change: "+15%", icon: BarChart3 },
            { label: "Avg Intent Score", value: avgScore.toString(), change: "+19%", icon: Users },
          ])

          setPlatformData([
            { name: "LinkedIn", count: platforms.linkedin || 0, color: "bg-[#0A66C2]" },
            { name: "Xiaohongshu", count: platforms.xiaohongshu || 0, color: "bg-[#FF2442]" },
            { name: "Facebook", count: platforms.facebook || 0, color: "bg-[#1877F2]" },
            { name: "X (Twitter)", count: platforms.x || 0, color: "bg-[#000000]" },
          ])
        }
      } catch (e) {
        console.error("Failed to parse intents for analytics", e)
      }
    }
  }, [])

  return (
    <PageLayout 
      title="Analytics Dashboard" 
      subtitle="Track your lead generation performance across all platforms"
      showSearch={false}
    >
      <div className="max-w-[1200px] mx-auto py-8 px-8 space-y-8">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-white rounded-[14px] p-6 border border-[#E5E1D8] shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded-[10px] bg-[#F5F3F0] flex items-center justify-center">
                  <stat.icon className="w-6 h-6 text-[#323333]" />
                </div>
                <div className="flex items-center gap-1 text-[#2D5F2D] font-semibold text-[14px]">
                  <ArrowUpRight size={16} />
                  <span>{stat.change}</span>
                </div>
              </div>
              <p className="text-[14px] font-medium text-[#9B9690] mb-1 font-['Inter']">{stat.label}</p>
              <p className="text-[32px] font-bold text-[#323333] font-['Merriweather'] leading-tight">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Lead Conversion Trend */}
          <div className="bg-white rounded-[14px] p-8 border border-[#E5E1D8] shadow-sm">
            <h3 className="text-[20px] font-bold font-['Merriweather'] text-[#323333] mb-8">Lead Conversion Trend</h3>
            <div className="h-[300px] w-full flex items-end justify-between gap-4 border-b border-[#E5E1D8] pb-2 relative">
              {/* Dynamic bars based on total leads or mock trend */}
              {[40, 60, 45, 80, 70, 90, 85].map((h, i) => {
                const total = parseInt(stats[0].value.replace(/,/g, '')) || 0
                const dynamicHeight = total > 0 ? Math.min(100, (h * (total / 10))) : h
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                    <div className="w-full bg-[#F5F3F0] rounded-t-sm group-hover:bg-[#EDE9E0] transition-colors relative" style={{ height: `${dynamicHeight}%` }}>
                      <div className="absolute bottom-0 left-0 w-full h-1 bg-[#323333] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </div>
                    <span className="text-[12px] text-[#9B9690] font-medium">Day {i+1}</span>
                  </div>
                )
              })}
            </div>
            <div className="mt-6 flex justify-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-[#323333] rounded-full"></div>
                <span className="text-[14px] text-[#6B6660]">Converted</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-[#E5E1D8] rounded-full"></div>
                <span className="text-[14px] text-[#6B6660]">Total Leads</span>
              </div>
            </div>
          </div>

          {/* Platform Distribution */}
          <div className="bg-white rounded-[14px] p-8 border border-[#E5E1D8] shadow-sm">
            <h3 className="text-[20px] font-bold font-['Merriweather'] text-[#323333] mb-8">Platform Distribution</h3>
            <div className="space-y-6">
              {platformData.map((p) => (
                <div key={p.name}>
                  <div className="flex justify-between mb-2 items-center">
                    <span className="text-[14px] font-medium text-[#323333]">{p.name}</span>
                    <span className="text-[14px] text-[#9B9690]">{p.count}</span>
                  </div>
                  <div className="w-full bg-[#F5F3F0] h-2 rounded-full overflow-hidden">
                    <div className={`h-full ${p.color}`} style={{ width: `${p.count > 0 ? (p.count / platformData.reduce((a,b)=>a+b.count,0)) * 100 : 0}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
