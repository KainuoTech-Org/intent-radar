"use client"

import { PageLayout } from "@/components/page-layout"
import { Check, ShieldCheck, CreditCard, Sparkles } from "lucide-react"

export default function SubscriptionPage() {
  const plans = [
    {
      name: "Free",
      description: "Ideal for individuals starting out",
      price: "$0",
      features: [
        "3 scans per day",
        "5 lead views per scan",
        "Basic intent filtering",
        "Email support",
      ],
      cta: "Continue with Free",
      popular: false,
    },
    {
      name: "Professional",
      description: "For serious startups & SMEs",
      price: "$10",
      features: [
        "Unlimited real-time scans",
        "Unlimited lead views",
        "All social platforms (LinkedIn, X, Reddit, etc.)",
        "Advanced AI intent scoring",
        "Priority support",
        "Export leads to CSV",
        "Analytics dashboard",
      ],
      cta: "Upgrade to Pro",
      popular: true,
    },
  ]

  return (
    <PageLayout 
      title="Simple Pricing" 
      subtitle="Find more customers with our flexible plans. Cancel anytime."
      showSearch={false}
    >
      <div className="max-w-[1000px] mx-auto py-12 px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-[800px] mx-auto">
          {plans.map((plan) => (
            <div 
              key={plan.name} 
              className={`relative bg-white rounded-[16px] p-8 border-2 flex flex-col h-full transition-all ${
                plan.popular 
                  ? "border-[#323333] shadow-lg scale-[1.02] z-10" 
                  : "border-[#E5E1D8] shadow-sm"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#323333] text-white px-4 py-1 rounded-full text-[13px] font-semibold flex items-center gap-2">
                  <Sparkles size={14} />
                  Best Value
                </div>
              )}

              <div className="mb-8 text-center md:text-left">
                <h3 className="font-['Merriweather'] text-[24px] font-bold text-[#323333] mb-2">{plan.name}</h3>
                <p className="text-[15px] text-[#6B6660]">{plan.description}</p>
              </div>

              <div className="mb-8 flex items-baseline justify-center md:justify-start gap-1">
                <span className="font-['Merriweather'] text-[42px] font-bold text-[#323333]">{plan.price}</span>
                <span className="text-[16px] text-[#9B9690]">/month</span>
              </div>

              <div className="space-y-4 mb-10 flex-1">
                {plan.features.map((feature) => (
                  <div key={feature} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-[#D4E7D4] flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="text-[#2D5F2D]" size={12} strokeWidth={3} />
                    </div>
                    <span className="font-['Inter'] text-[15px] text-[#323333] leading-tight">{feature}</span>
                  </div>
                ))}
              </div>

              <button className={`w-full py-4 rounded-[10px] font-bold font-['Inter'] transition-all active:scale-95 ${
                plan.popular 
                  ? "bg-[#323333] text-white hover:bg-black" 
                  : "bg-[#F5F3F0] text-[#323333] hover:bg-[#EDE9E0] border border-[#E5E1D8]"
              }`}>
                {plan.cta}
              </button>
            </div>
          ))}
        </div>

        {/* Security / Trust Bar */}
        <div className="mt-12 bg-white rounded-[14px] border border-[#E5E1D8] p-6 flex justify-center gap-12">
          <div className="flex items-center gap-2 text-[#6B6660]">
            <ShieldCheck size={20} />
            <span className="text-[14px] font-medium">Secure Payment</span>
          </div>
          <div className="flex items-center gap-2 text-[#6B6660]">
            <CreditCard size={20} />
            <span className="text-[14px] font-medium">Cancel Anytime</span>
          </div>
          <div className="flex items-center gap-2 text-[#6B6660]">
            <Sparkles size={20} />
            <span className="text-[14px] font-medium">14-Day Free Trial</span>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
