"use client"

import { Sidebar } from "@/components/sidebar"
import { BarChart3, TrendingUp, Users, Zap, Bell, Search } from "lucide-react"

export default function AnalyticsPage() {
  const stats = [
    { label: "总意向数", value: "1,247", change: "+12.5%", icon: Zap, color: "bg-[#f3e8ff]", iconColor: "text-[#9333ea]" },
    { label: "高意向", value: "342", change: "+8.2%", icon: TrendingUp, color: "bg-[#dcfce7]", iconColor: "text-[#16a34a]" },
    { label: "已联系", value: "156", change: "+15.3%", icon: Users, color: "bg-[#dbeafe]", iconColor: "text-[#2563eb]" },
    { label: "转化率", value: "12.5%", change: "+2.1%", icon: BarChart3, color: "bg-[#ffedd5]", iconColor: "text-[#ea580c]" },
  ]

  return (
    <div className="flex h-screen bg-[#fbfbfb] text-[#212121]">
      <Sidebar />
      <main className="flex-1 flex flex-col overflow-y-auto">
        {/* Top Header */}
        <div className="px-10 py-6 flex items-center justify-between sticky top-0 bg-[#fbfbfb]/90 backdrop-blur-md z-10">
            <h1 className="font-['Merriweather'] text-[24px] font-bold text-[#1f2937] tracking-tight">
                Analytics
            </h1>
            
            <div className="flex items-center gap-6">
                 {/* Search Bar */}
                 <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search stats..."
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

        <div className="px-10 pb-10">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat) => {
                const Icon = stat.icon
                return (
                <div key={stat.label} className="bg-white rounded-2xl p-6 border border-[#e5e5e5] shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                    <div
                        className={`w-10 h-10 rounded-lg ${stat.color} flex items-center justify-center`}
                    >
                        <Icon
                        className={`w-5 h-5 ${stat.iconColor}`}
                        />
                    </div>
                    <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded font-['Roboto']">
                        {stat.change}
                    </span>
                    </div>
                    <p className="text-xs font-medium text-gray-500 mb-1 font-['Outfit']">{stat.label}</p>
                    <p className="text-3xl font-bold text-[#1f2937] font-['Merriweather'] tracking-tight">{stat.value}</p>
                </div>
                )
            })}
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
            {/* Platform Distribution */}
            <div className="bg-white rounded-2xl p-8 border border-[#e5e5e5] shadow-sm">
                <h3 className="text-lg font-bold mb-6 font-['Roboto'] text-[#1f2937]">平台分布</h3>
                <div className="space-y-6">
                {[
                    { platform: "小红书", count: 456, percent: 37, color: "bg-gradient-to-r from-blue-500 to-blue-600" },
                    { platform: "LinkedIn", count: 392, percent: 31, color: "bg-gradient-to-r from-indigo-500 to-indigo-600" },
                    { platform: "X (Twitter)", count: 234, percent: 19, color: "bg-gradient-to-r from-blue-400 to-blue-500" },
                    { platform: "Reddit", count: 165, percent: 13, color: "bg-gradient-to-r from-orange-500 to-red-500" },
                ].map((item) => (
                    <div key={item.platform}>
                    <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium font-['Outfit'] text-gray-700">{item.platform}</span>
                        <span className="text-sm text-gray-400 font-['Roboto']">{item.count}</span>
                    </div>
                    <div className="w-full bg-gray-50 rounded-full h-2">
                        <div
                        className={`h-2 rounded-full ${item.color}`}
                        style={{ width: `${item.percent}%` }}
                        />
                    </div>
                    </div>
                ))}
                </div>
            </div>

            {/* Intent Trends */}
            <div className="bg-white rounded-2xl p-8 border border-[#e5e5e5] shadow-sm flex flex-col">
                <h3 className="text-lg font-bold mb-6 font-['Roboto'] text-[#1f2937]">意向趋势</h3>
                <div className="flex-1 flex items-end justify-around gap-4 min-h-[250px] pb-2 border-b border-gray-100">
                {[65, 72, 58, 81, 75, 88, 92].map((height, idx) => (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-3 group cursor-pointer">
                    <div
                        className="w-full bg-gray-100 rounded-t-lg relative overflow-hidden group-hover:bg-gray-200 transition-colors"
                        style={{ height: `${height}%` }}
                    >
                         <div className="absolute bottom-0 left-0 w-full h-1 bg-[#212121] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </div>
                    <span className="text-[10px] font-bold text-gray-400 font-['Outfit'] uppercase">Day {idx + 1}</span>
                    </div>
                ))}
                </div>
            </div>
            </div>
        </div>
      </main>
    </div>
  )
}
