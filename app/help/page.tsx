"use client"

import { PageLayout } from "@/components/page-layout"
import { Mail, MessageCircle, Book, ExternalLink } from "lucide-react"

export default function HelpPage() {
  const helpCards = [
    { icon: Book, title: "Documentation", desc: "Read our detailed guides", cta: "View Docs" },
    { icon: MessageCircle, title: "Live Chat", desc: "Chat with our support team", cta: "Start Chat" },
    { icon: Mail, title: "Email Support", desc: "Get help via email", cta: "Send Email" },
  ]

  return (
    <PageLayout 
      title="Help & Support" 
      subtitle="Need assistance? Our team is here to help."
      showSearch={false}
    >
      <div className="max-w-[1000px] mx-auto py-16 px-6 text-center">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {helpCards.map((card) => (
            <div key={card.title} className="bg-white rounded-[14px] p-8 border border-[#E5E1D8] shadow-sm hover:border-[#323333] transition-all group cursor-pointer">
              <div className="w-16 h-16 bg-[#F5F3F0] rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-[#EDE9E0] transition-colors">
                <card.icon className="text-[#323333]" size={32} />
              </div>
              <h3 className="font-['Merriweather'] text-[20px] font-bold text-[#323333] mb-2">{card.title}</h3>
              <p className="text-[14px] text-[#6B6660] mb-6">{card.desc}</p>
              <button className="text-[#8B6F47] font-semibold text-[14px] flex items-center gap-2 mx-auto hover:underline">
                {card.cta}
                <ExternalLink size={14} />
              </button>
            </div>
          ))}
        </div>

        <div className="bg-[#FEFCFA] rounded-[16px] p-12 border border-[#E5E1D8]">
          <h2 className="font-['Merriweather'] text-[28px] font-bold text-[#323333] mb-4">Still need help?</h2>
          <p className="text-[16px] text-[#6B6660] mb-8 max-w-lg mx-auto">
            Our support hours are Monday to Friday, 9:00 AM – 6:00 PM HKT. We usually respond within 2 hours.
          </p>
          <button className="bg-[#323333] text-white px-10 py-4 rounded-[10px] font-bold text-[16px] hover:bg-black transition-all active:scale-95 shadow-lg">
            Contact Support
          </button>
        </div>
      </div>
    </PageLayout>
  )
}
