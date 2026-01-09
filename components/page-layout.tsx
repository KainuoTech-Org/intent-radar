"use client"

import { Sidebar } from "./sidebar"
import { Footer } from "./footer"
import { Search, Bell, Plus } from "lucide-react"
import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"
import { AIQuestionnaire } from "./ai-questionnaire"

interface PageLayoutProps {
  children: React.ReactNode
  title: string
  subtitle?: string
  showSearch?: boolean
  showNewScan?: boolean
  onScanComplete?: (results: any[], query?: any, message?: string) => void
}

export function PageLayout({
  children,
  title,
  subtitle,
  showSearch = true,
  showNewScan = false,
  onScanComplete,
}: PageLayoutProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  return (
    <div className="flex h-screen bg-[#FBF9F6] text-[#323333]">
      <Sidebar />

      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Unified Header - Height 151.5px per Figma */}
        <header className="h-[151.5px] border-b border-[#E5E1D8] px-8 pt-8 bg-[#FEFCFA] flex flex-col justify-between shrink-0 z-20">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="font-['Merriweather'] text-[28px] font-bold text-[#323333] leading-none">{title}</h1>
              {subtitle && (
                <p className="font-['Inter'] text-[14px] text-[#6B6660] mt-2">{subtitle}</p>
              )}
            </div>

            <div className="flex items-center gap-6">
              {showNewScan && (
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <button className="flex items-center gap-2 bg-[#323333] text-white px-5 py-2.5 rounded-[10px] hover:bg-black transition-all active:scale-95 shadow-sm">
                      <Plus size={18} />
                      <span className="font-['Inter'] text-[14px] font-medium">New Scan</span>
                    </button>
                  </DialogTrigger>
                  <DialogContent className="max-w-[1000px] p-0 overflow-hidden bg-transparent border-none shadow-none focus:outline-none">
                    <VisuallyHidden>
                      <DialogTitle>AI Search</DialogTitle>
                      <DialogDescription>Start a new search</DialogDescription>
                    </VisuallyHidden>
                    <AIQuestionnaire isModal onComplete={(results) => {
                      onScanComplete?.(results)
                      setIsDialogOpen(false)
                    }} />
                  </DialogContent>
                </Dialog>
              )}

              {/* User Profile - Fixed Figma Style */}
              <div className="flex items-center gap-3 cursor-pointer group">
                <div className="text-right hidden md:block">
                  <p className="text-[14px] font-semibold text-[#323333]">Johnson G.</p>
                  <p className="text-[12px] text-[#9B9690]">Premium Plan</p>
                </div>
                <div className="w-10 h-10 rounded-full border border-[#E5E1D8] overflow-hidden bg-[#F5F3F0] group-hover:border-[#323333] transition-colors">
                  <img
                    src="https://unavatar.io/github/johnson"
                    alt="User"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Search Bar - Fixed Figma Style */}
          {showSearch && (
            <div className="pb-6 w-full max-w-[800px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9B9690]" size={18} />
                <input
                  type="text"
                  placeholder={`Search ${title.toLowerCase()}...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-[44.5px] bg-[#FBF9F6] border border-[#E5E1D8] rounded-[10px] pl-10 pr-4 text-[#323333] placeholder-[#9B9690] focus:outline-none focus:border-[#323333] transition-colors font-['Inter'] text-[14px]"
                />
              </div>
            </div>
          )}
        </header>

        {/* Content Area - Scrollable */}
        <div className="flex-1 overflow-y-auto flex flex-col bg-[#FBF9F6]">
          <div className="flex-1">
            {children}
          </div>
          
          {/* Footer - Always at bottom of content */}
          <Footer />
        </div>
      </main>
    </div>
  )
}
