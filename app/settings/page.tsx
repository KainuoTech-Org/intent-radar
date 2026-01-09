"use client"

import { Sidebar } from "@/components/sidebar"
import { Footer } from "@/components/footer"
import { Bell, Globe, Key, User, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"

export default function SettingsPage() {
  const settingSections = [
    {
      icon: User,
      title: "Profile",
      description: "Manage your account information",
      fields: [
        { label: "Full Name", value: "Johnson G.", type: "text" },
        { label: "Email Address", value: "johnson@kainuo.com", type: "email" },
      ],
    },
    {
      icon: Bell,
      title: "Notifications",
      description: "Control what you receive",
      toggles: [
        { label: "New Lead Alerts", enabled: true },
        { label: "Daily Digest", enabled: true },
        { label: "Weekly Report", enabled: false },
      ],
    },
    {
      icon: Globe,
      title: "Platforms",
      description: "Select platforms to monitor",
      toggles: [
        { label: "Xiaohongshu", enabled: true },
        { label: "LinkedIn", enabled: true },
        { label: "X (Twitter)", enabled: true },
        { label: "Reddit", enabled: false },
        { label: "Facebook", enabled: false },
        { label: "Instagram", enabled: false },
      ],
    },
    {
      icon: Key,
      title: "API Keys",
      description: "Manage API access",
      fields: [{ label: "Secret Key", value: "sk_test_••••••••••••", type: "password" }],
    },
  ]

  return (
    <div className="flex h-screen bg-[#FBF9F6] text-[#323333]">
      <Sidebar />
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <div className="h-[151.5px] border-b border-[#E5E1D8] px-6 pt-6 bg-[#FEFCFA] flex flex-col justify-between shrink-0">
            <div>
                <h1 className="font-['Merriweather'] text-[28px] font-bold text-[#323333]">Settings</h1>
                <div className="mt-4 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9B9690]" size={20} />
                    <input
                        type="text"
                        placeholder="Search settings..."
                        className="w-full h-[44.5px] bg-[#FBF9F6] border border-[#E5E1D8] rounded-[10px] pl-10 pr-4 text-[#323333] placeholder-[#9B9690] focus:outline-none focus:border-[#323333] transition-colors font-['Inter']"
                    />
                </div>
            </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto bg-[#FBF9F6]">
            <div className="max-w-[800px] mx-auto py-8 px-6 space-y-6">
                {settingSections.map((section) => {
                const Icon = section.icon
                return (
                    <div key={section.title} className="bg-[#FEFCFA] rounded-[10px] p-8 border border-[#E5E1D8] shadow-sm">
                        <div className="flex items-start gap-5 mb-8">
                            <div className="w-12 h-12 rounded-[10px] bg-[#F5F3F0] flex items-center justify-center">
                                <Icon className="w-6 h-6 text-[#323333]" />
                            </div>
                            <div>
                                <h3 className="text-[18px] font-bold font-['Merriweather'] text-[#323333]">{section.title}</h3>
                                <p className="text-[14px] text-[#6B6660] font-['Inter']">{section.description}</p>
                            </div>
                        </div>

                        {section.fields && (
                            <div className="space-y-6">
                            {section.fields.map((field) => (
                                <div key={field.label}>
                                <label className="text-[14px] font-semibold mb-2 block font-['Inter'] text-[#323333]">{field.label}</label>
                                <Input 
                                    type={field.type} 
                                    defaultValue={field.value} 
                                    className="bg-[#FFFFFF] border-[#E5E1D8] focus:ring-[#323333] focus:border-[#323333] h-[44px] rounded-[8px] font-['Inter'] text-[#323333]"
                                />
                                </div>
                            ))}
                            </div>
                        )}

                        {section.toggles && (
                            <div className="space-y-4">
                            {section.toggles.map((toggle) => (
                                <div key={toggle.label} className="flex items-center justify-between py-1">
                                <span className="text-[14px] font-medium font-['Inter'] text-[#323333]">{toggle.label}</span>
                                <Switch defaultChecked={toggle.enabled} className="data-[state=checked]:bg-[#323333]" />
                                </div>
                            ))}
                            </div>
                        )}

                        <div className="mt-8 pt-6 border-t border-[#E5E1D8] flex justify-end">
                            <Button className="bg-[#323333] hover:bg-black text-white px-6 h-[40px] rounded-[8px] font-['Inter'] font-medium">Save Changes</Button>
                        </div>
                    </div>
                )
                })}
            </div>
            
            <Footer />
        </div>
      </main>
    </div>
  )
}
