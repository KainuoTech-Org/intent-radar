"use client"

import { Sidebar } from "@/components/sidebar"
import { Bell, Globe, Key, User, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"

export default function SettingsPage() {
  const settingSections = [
    {
      icon: User,
      title: "个人信息",
      description: "管理您的账户信息",
      fields: [
        { label: "姓名", value: "User Name", type: "text" },
        { label: "邮箱", value: "you@example.com", type: "email" },
      ],
    },
    {
      icon: Bell,
      title: "通知设置",
      description: "控制您接收的通知类型",
      toggles: [
        { label: "新意向提醒", enabled: true },
        { label: "每日摘要", enabled: true },
        { label: "周报", enabled: false },
      ],
    },
    {
      icon: Globe,
      title: "监测平台",
      description: "选择要监测的社交平台",
      toggles: [
        { label: "小红书", enabled: true },
        { label: "LinkedIn", enabled: true },
        { label: "X (Twitter)", enabled: true },
        { label: "Reddit", enabled: false },
        { label: "Facebook", enabled: false },
        { label: "Instagram", enabled: false },
      ],
    },
    {
      icon: Key,
      title: "API密钥",
      description: "管理您的API访问权限",
      fields: [{ label: "API Key", value: "sk_test_••••••••••••", type: "password" }],
    },
  ]

  return (
    <div className="flex h-screen bg-[#fbfbfb] text-[#212121]">
      <Sidebar />
      <main className="flex-1 flex flex-col overflow-y-auto">
        {/* Top Header */}
        <div className="px-10 py-6 flex items-center justify-between sticky top-0 bg-[#fbfbfb]/90 backdrop-blur-md z-10">
            <h1 className="font-['Merriweather'] text-[24px] font-bold text-[#1f2937] tracking-tight">
                Settings
            </h1>
            
            <div className="flex items-center gap-6">
                 {/* Search Bar */}
                 <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search settings..."
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

        <div className="px-10 pb-10 max-w-4xl">
            <p className="text-gray-500 mb-8 font-['Roboto']">管理您的账户和偏好设置</p>

          <div className="space-y-6">
            {settingSections.map((section) => {
              const Icon = section.icon
              return (
                <div key={section.title} className="bg-white rounded-2xl p-8 border border-[#e5e5e5] shadow-sm">
                  <div className="flex items-start gap-5 mb-8">
                    <div className="w-12 h-12 rounded-xl bg-[#f3e8ff] flex items-center justify-center">
                      <Icon className="w-6 h-6 text-[#9333ea]" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold font-['Roboto'] text-[#1f2937]">{section.title}</h3>
                      <p className="text-sm text-gray-500 font-['Outfit']">{section.description}</p>
                    </div>
                  </div>

                  {section.fields && (
                    <div className="space-y-6">
                      {section.fields.map((field) => (
                        <div key={field.label}>
                          <label className="text-sm font-semibold mb-2 block font-['Outfit'] text-[#374151]">{field.label}</label>
                          <Input 
                            type={field.type} 
                            defaultValue={field.value} 
                            className="bg-white border-gray-200 focus:ring-[#212121] focus:border-[#212121] h-12 rounded-lg font-['Roboto']"
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  {section.toggles && (
                    <div className="space-y-4">
                      {section.toggles.map((toggle) => (
                        <div key={toggle.label} className="flex items-center justify-between py-1">
                          <span className="text-sm font-medium font-['Outfit'] text-[#374151]">{toggle.label}</span>
                          <Switch defaultChecked={toggle.enabled} className="data-[state=checked]:bg-[#212121]" />
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end">
                    <Button className="bg-[#212121] hover:bg-black text-white px-6 py-2 h-10 rounded-lg font-['Outfit'] font-medium">保存更改</Button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </main>
    </div>
  )
}
