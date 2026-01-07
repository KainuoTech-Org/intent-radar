"use client"

import { Sidebar } from "@/components/sidebar"
import { BarChart3, TrendingUp, Users, Zap } from "lucide-react"

export default function AnalyticsPage() {
  const stats = [
    { label: "总意向数", value: "1,247", change: "+12.5%", icon: Zap, color: "purple" },
    { label: "高意向", value: "342", change: "+8.2%", icon: TrendingUp, color: "green" },
    { label: "已联系", value: "156", change: "+15.3%", icon: Users, color: "blue" },
    { label: "转化率", value: "12.5%", change: "+2.1%", icon: BarChart3, color: "orange" },
  ]

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 bg-background p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Analytics Dashboard</h1>
          <p className="text-muted-foreground">实时监测和分析您的意向数据</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <div key={stat.label} className="bg-white rounded-xl p-6 border hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div
                    className={`w-12 h-12 rounded-lg bg-${stat.color}-100 flex items-center justify-center`}
                    style={{
                      background:
                        stat.color === "purple"
                          ? "#f3e8ff"
                          : stat.color === "green"
                            ? "#dcfce7"
                            : stat.color === "blue"
                              ? "#dbeafe"
                              : "#fed7aa",
                    }}
                  >
                    <Icon
                      className="w-6 h-6"
                      style={{
                        color:
                          stat.color === "purple"
                            ? "#9333ea"
                            : stat.color === "green"
                              ? "#16a34a"
                              : stat.color === "blue"
                                ? "#2563eb"
                                : "#ea580c",
                      }}
                    />
                  </div>
                  <span className="text-sm font-medium text-green-600 bg-green-50 px-2 py-1 rounded">
                    {stat.change}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                <p className="text-3xl font-bold text-foreground">{stat.value}</p>
              </div>
            )
          })}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl p-6 border">
            <h3 className="text-lg font-bold mb-4">平台分布</h3>
            <div className="space-y-4">
              {[
                { platform: "小红书", count: 456, percent: 37 },
                { platform: "LinkedIn", count: 392, percent: 31 },
                { platform: "X (Twitter)", count: 234, percent: 19 },
                { platform: "Reddit", count: 165, percent: 13 },
              ].map((item) => (
                <div key={item.platform}>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">{item.platform}</span>
                    <span className="text-sm text-muted-foreground">{item.count}</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full"
                      style={{ width: `${item.percent}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border">
            <h3 className="text-lg font-bold mb-4">意向趋势</h3>
            <div className="h-64 flex items-end justify-around gap-2">
              {[65, 72, 58, 81, 75, 88, 92].map((height, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                  <div
                    className="w-full bg-gradient-to-t from-purple-600 to-purple-400 rounded-t"
                    style={{ height: `${height}%` }}
                  />
                  <span className="text-xs text-muted-foreground">Day {idx + 1}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
