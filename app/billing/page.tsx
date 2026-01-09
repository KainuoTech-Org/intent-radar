"use client"

import { PageLayout } from "@/components/page-layout"
import { FileText, Plus, Download, Eye } from "lucide-react"

export default function BillingPage() {
  const documents = [
    { id: "Q-001", type: "Quotation", client: "TechStart HK", amount: "HK$15,000", date: "2026-01-08", status: "Sent" },
    { id: "Q-002", type: "Quotation", client: "Digital Solutions Ltd", amount: "HK$22,000", date: "2026-01-07", status: "Draft" },
    { id: "INV-001", type: "Invoice", client: "Growth Marketing Agency", amount: "HK$18,500", date: "2026-01-05", status: "Paid" },
    { id: "INV-002", type: "Invoice", client: "E-commerce Ventures", amount: "HK$12,000", date: "2026-01-03", status: "Pending" },
  ]

  return (
    <PageLayout 
      title="Kino Billing" 
      subtitle="Create professional quotations and invoices"
    >
      <div className="max-w-[1000px] mx-auto py-8 px-6 space-y-8">
        {/* Actions */}
        <div className="flex gap-4">
          <button className="flex items-center gap-2 bg-[#323333] text-white px-6 py-2.5 rounded-[10px] hover:bg-black transition-colors">
            <FileText size={18} />
            <span className="font-['Inter'] text-[15px] font-medium">Documents</span>
          </button>
          <button className="flex items-center gap-2 bg-white border border-[#E5E1D8] text-[#6B6660] px-6 py-2.5 rounded-[10px] hover:bg-[#FBF9F6] transition-colors">
            <Plus size={18} />
            <span className="font-['Inter'] text-[15px] font-medium">Create New</span>
          </button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-[14px] border border-[#E5E1D8] overflow-hidden shadow-sm">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-[#FEFCFA] border-b border-[#E5E1D8]">
                <th className="px-6 py-4 text-left text-[14px] font-semibold text-[#323333]">Document ID</th>
                <th className="px-6 py-4 text-left text-[14px] font-semibold text-[#323333]">Type</th>
                <th className="px-6 py-4 text-left text-[14px] font-semibold text-[#323333]">Client</th>
                <th className="px-6 py-4 text-left text-[14px] font-semibold text-[#323333]">Amount</th>
                <th className="px-6 py-4 text-left text-[14px] font-semibold text-[#323333]">Date</th>
                <th className="px-6 py-4 text-left text-[14px] font-semibold text-[#323333]">Status</th>
                <th className="px-6 py-4 text-left text-[14px] font-semibold text-[#323333]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y border-[#E5E1D8]">
              {documents.map((doc) => (
                <tr key={doc.id} className="hover:bg-[#FBF9F6] transition-colors">
                  <td className="px-6 py-4 text-[15px] font-medium text-[#323333]">{doc.id}</td>
                  <td className="px-6 py-4">
                    <span className="bg-[#E8E5E0] text-[#5A5550] text-[12px] px-3 py-1 rounded-full font-medium">
                      {doc.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-[15px] text-[#6B6660]">{doc.client}</td>
                  <td className="px-6 py-4 text-[15px] font-semibold text-[#323333]">{doc.amount}</td>
                  <td className="px-6 py-4 text-[15px] text-[#6B6660]">{doc.date}</td>
                  <td className="px-6 py-4">
                    <span className={`text-[12px] px-3 py-1 rounded-full font-medium ${
                      doc.status === 'Paid' ? 'bg-[#D4E7D4] text-[#2D5F2D]' : 
                      doc.status === 'Sent' ? 'bg-[#E0E7F5] text-[#2D4A5F]' : 
                      'bg-[#F5E7D4] text-[#5F4A2D]'
                    }`}>
                      {doc.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button className="p-2 hover:bg-[#EDE9E0] rounded transition-colors text-[#6B6660]">
                        <Eye size={16} />
                      </button>
                      <button className="p-2 hover:bg-[#EDE9E0] rounded transition-colors text-[#6B6660]">
                        <Download size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </PageLayout>
  )
}
