"use client"

import { LayoutDashboard, Inbox, BarChart3, Settings, HelpCircle, CreditCard, LifeBuoy } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const menuItems = [
    { icon: Inbox, label: "Intent Inbox", href: "/", active: pathname === "/" },
    { icon: BarChart3, label: "Analytics", href: "/analytics", active: pathname === "/analytics" },
    { icon: CreditCard, label: "Billing", href: "/billing", active: pathname === "/billing" },
    { icon: LifeBuoy, label: "Subscription", href: "/subscription", active: pathname === "/subscription" },
    { icon: Settings, label: "Settings", href: "/settings", active: pathname === "/settings" },
    { icon: HelpCircle, label: "Help", href: "/help", active: pathname === "/help" },
  ]

  return (
    <aside className="w-[280px] bg-[#FBF9F6] border-r border-[#E5E1D8] flex flex-col h-screen sticky top-0 overflow-y-auto">
      {/* Logo Area - Height 101px */}
      <div className="h-[101px] border-b border-[#E5E1D8] flex items-center px-6">
        <div className="flex items-center gap-3">
            <div className="w-8 h-8 flex items-center justify-center">
                {/* Updated to match the new Radar icon */}
                <div className="w-8 h-8 bg-[#323333] rounded-lg flex items-center justify-center overflow-hidden">
                    <svg width="24" height="24" viewBox="0 0 180 180" fill="none" xmlns="http://www.w3.org/2000/svg" className="scale-[0.5]">
                        <circle cx="90" cy="90" r="60" stroke="white" strokeWidth="4" opacity="0.2"/>
                        <circle cx="90" cy="90" r="40" stroke="white" strokeWidth="4" opacity="0.4"/>
                        <circle cx="90" cy="90" r="20" stroke="white" strokeWidth="4" opacity="0.6"/>
                        <path d="M90 30L90 150M30 90L150 90" stroke="white" strokeWidth="4" opacity="0.2"/>
                        <path d="M90 90L135 45" stroke="white" strokeWidth="12" strokeLinecap="round"/>
                        <circle cx="120" cy="60" r="16" fill="#D4E7D4"/>
                    </svg>
                </div>
            </div>
            <span className="font-['Merriweather'] text-[24px] font-bold text-[#323333] tracking-tight">
                IntentRadar
            </span>
        </div>
      </div>

      {/* Navigation - Padding top 24px */}
      <nav className="flex-1 px-4 py-6 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon
          return (
            <button
              key={item.label}
              onClick={() => router.push(item.href)}
              className={`w-full flex items-center gap-3 px-4 h-[46.5px] rounded-[10px] transition-all ${
                item.active
                  ? "bg-[#EDE9E0] text-[#323333] font-medium"
                  : "text-[#6B6660] hover:bg-[#F5F3F0] hover:text-[#323333]"
              }`}
            >
              <Icon size={20} className={item.active ? "text-[#323333]" : "text-[#6B6660]"} strokeWidth={1.5} />
              <span className="text-[15px] font-['Inter']">{item.label}</span>
            </button>
          )
        })}
      </nav>

      {/* Footer Area - Height 52.5px */}
      <div className="h-[52.5px] border-t border-[#E5E1D8] flex items-center px-6">
        <span className="font-['Inter'] text-[13px] text-[#9B9690] font-normal">
            Powered by Kainuo
        </span>
      </div>
    </aside>
  )
}
