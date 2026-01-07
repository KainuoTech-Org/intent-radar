"use client"

import { Inbox, Users, BarChart3, Settings, Bell, Sparkles } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const menuItems = [
    { icon: Inbox, label: "Inbox", href: "/", active: pathname === "/" },
    { icon: Users, label: "Leads", href: "/leads", active: pathname === "/leads" },
    { icon: BarChart3, label: "Analytics", href: "/analytics", active: pathname === "/analytics" },
    { icon: Settings, label: "Settings", href: "/settings", active: pathname === "/settings" },
  ]

  return (
    <aside className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col">
      {/* Logo Area */}
      <div className="p-6 border-b border-sidebar-border">
        <button
          onClick={() => router.push("/")}
          className="flex items-center gap-3 hover:opacity-80 transition-opacity"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="2" strokeOpacity="0.3" />
              <circle cx="12" cy="12" r="6" stroke="white" strokeWidth="2" strokeOpacity="0.5" />
              <circle cx="12" cy="12" r="2" fill="white" />
              <path d="M12 2 L12 12" stroke="white" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          <h2 className="font-bold text-lg text-sidebar-foreground">IntentRadar</h2>
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon
          return (
            <button
              key={item.label}
              onClick={() => router.push(item.href)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                item.active
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent"
              }`}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </button>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-sidebar-border p-4 space-y-3">
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent transition-colors">
          <Bell size={20} />
          <span className="text-sm">Notifications</span>
        </button>
        <div className="px-4 py-3 rounded-lg bg-sidebar-accent/50 flex items-center gap-3 border border-sidebar-border/50">
          <img 
            src="https://unavatar.io/github/johnson" 
            className="w-8 h-8 rounded-full border border-purple-200"
            alt="User"
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-sidebar-foreground truncate tracking-tight">Johnson GAO</p>
            <p className="text-[10px] font-medium text-sidebar-foreground/40 uppercase tracking-widest">Premium Radar</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
