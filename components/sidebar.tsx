"use client"

import { LayoutDashboard, Inbox, BarChart3, Settings, HelpCircle, Download } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard", active: pathname === "/dashboard" },
    { icon: Inbox, label: "Intent Inbox", href: "/", active: pathname === "/" },
    { icon: BarChart3, label: "Reports", href: "/analytics", active: pathname === "/analytics" },
    { icon: Settings, label: "Settings", href: "/settings", active: pathname === "/settings" },
    { icon: HelpCircle, label: "Help", href: "/help", active: pathname === "/help" },
  ]

  return (
    <aside className="w-[320px] bg-white flex flex-col p-10 h-screen sticky top-0 overflow-y-auto">
      {/* Logo Area */}
      <div className="flex items-center gap-1 mb-14">
        <div className="w-7 h-7 flex items-center justify-center">
            {/* Logo placeholder from design */}
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="28" height="28" rx="6" fill="#212121"/>
            <path d="M14 6L14 22M6 14L22 14" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            </svg>
        </div>
        <span className="font-['Merriweather'] text-[24px] font-bold text-[#1f2937] tracking-tight ml-2">
            IntentRadar
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-4">
        {menuItems.map((item) => {
          const Icon = item.icon
          return (
            <button
              key={item.label}
              onClick={() => router.push(item.href)}
              className={`w-full flex items-center gap-4 px-6 py-3.5 rounded-xl transition-all ${
                item.active
                  ? "bg-[#57575729] text-[#212121] font-medium"
                  : "text-[#646464] hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <Icon size={22} className={item.active ? "text-[#212121]" : "text-[#646464]"} strokeWidth={1.5} />
              <span className="text-[15px] font-medium font-['Outfit']">{item.label}</span>
            </button>
          )
        })}
      </nav>

      {/* Footer Area: Download App */}
      <div className="mt-auto pt-8">
        <div className="flex items-center gap-3 mb-6 px-2">
            <div className="text-[15px] font-medium text-[#212121] font-['Outfit'] flex items-center gap-2 cursor-pointer hover:opacity-80">
                Download app
                <Download size={16} />
            </div>
            <div className="h-4 w-[1px] bg-gray-300 mx-2"></div>
            <div className="text-[15px] font-medium text-[#212121] font-['Outfit'] cursor-pointer hover:opacity-80">
                Log in
            </div>
        </div>
        
        <button className="w-full bg-[#f3f4f6] text-[#030303] py-3 rounded-xl font-['Outfit'] font-medium text-[15px] hover:bg-gray-200 transition-colors">
            Try it free
        </button>
      </div>
    </aside>
  )
}
