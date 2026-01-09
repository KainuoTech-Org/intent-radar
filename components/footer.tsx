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
    <footer className="w-full border-t border-[#E5E1D8] bg-[#FEFCFA] py-16">
      <div className="max-w-[1400px] mx-auto px-8">
        <div className="flex flex-col lg:flex-row justify-between mb-16 gap-12">
          {/* Brand Column */}
          <div className="max-w-[314px]">
            <h3 className="font-['Merriweather'] text-[18px] font-bold text-[#323333] mb-6">IntentRadar</h3>
            <p className="font-['Inter'] text-[14px] text-[#6B6660] leading-7">
              AI-powered intent intelligence platform for SMEs across all social platforms.
            </p>
          </div>

          {/* Links Columns */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-12 lg:gap-24">
            {footerLinks.map((column) => (
              <div key={column.title} className="min-w-[120px]">
                <h4 className="font-['Inter'] text-[14px] font-semibold text-[#323333] mb-6">{column.title}</h4>
                <ul className="space-y-4">
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
        <div className="border-t border-[#E5E1D8] pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="font-['Inter'] text-[13px] text-[#9B9690]">
            © 2026 Kainuo Innovision Tech Co., Limited. All rights reserved.
          </p>
          <div className="flex gap-8">
            <span className="font-['Inter'] text-[13px] text-[#9B9690] cursor-pointer hover:text-[#323333]">English</span>
            <span className="font-['Inter'] text-[13px] text-[#9B9690] cursor-pointer hover:text-[#323333]">繁體中文</span>
            <span className="font-['Inter'] text-[13px] text-[#9B9690] cursor-pointer hover:text-[#323333]">简体中文</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
