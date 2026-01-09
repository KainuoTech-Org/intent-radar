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
                {/* Replaced with simple placeholder icon from design */}
                <div className="w-8 h-8 bg-[#323333] rounded-lg flex items-center justify-center">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
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
