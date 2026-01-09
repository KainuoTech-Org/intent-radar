"use client"

export function Footer() {
  const footerLinks = [
    {
      title: "Product",
      links: ["Features", "Pricing", "Integrations", "API"],
    },
    {
      title: "Resources",
      links: ["Documentation", "Blog", "Case Studies", "Support"],
    },
    {
      title: "Company",
      links: ["About", "Contact", "Privacy", "Terms"],
    },
  ]

  return (
    <footer className="w-full border-t border-[#E5E1D8] bg-[#FEFCFA] px-16 pt-10 pb-10">
      <div className="flex justify-between mb-10">
        {/* Brand Column */}
        <div className="w-[314px]">
          <h3 className="font-['Merriweather'] text-[18px] font-bold text-[#323333] mb-4">IntentRadar</h3>
          <p className="font-['Inter'] text-[14px] text-[#6B6660] leading-6">
            AI-powered intent intelligence platform for SMEs across all social platforms.
          </p>
        </div>

        {/* Links Columns */}
        <div className="flex gap-16">
          {footerLinks.map((column) => (
            <div key={column.title} className="w-[140px]">
              <h4 className="font-['Inter'] text-[14px] font-semibold text-[#323333] mb-4">{column.title}</h4>
              <ul className="space-y-3">
                {column.links.map((link) => (
                  <li key={link}>
                    <a href="#" className="font-['Inter'] text-[14px] text-[#6B6660] hover:text-[#323333] transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-[#E5E1D8] pt-6 flex justify-between items-center">
        <p className="font-['Inter'] text-[13px] text-[#9B9690]">
          © 2026 Kainuo Innovision Tech Co., Limited. All rights reserved.
        </p>
        <div className="flex gap-6">
          <span className="font-['Inter'] text-[13px] text-[#9B9690] cursor-pointer hover:text-[#323333]">English</span>
          <span className="font-['Inter'] text-[13px] text-[#9B9690] cursor-pointer hover:text-[#323333]">繁體中文</span>
          <span className="font-['Inter'] text-[13px] text-[#9B9690] cursor-pointer hover:text-[#323333]">简体中文</span>
        </div>
      </div>
    </footer>
  )
}
