"use client";
import { comingSoon, notifyInfo } from "../utils/toast";
import { exportQuotationPdf } from "../utils/pdf";
import type { Quotation } from "../context/QuotationContext";

export default function ExportButtons({ className = "", quotation }: { className?: string; quotation?: Quotation }) {
  const onExportPdf = () => {
    if (!quotation) return notifyInfo("Open a quotation first");
    exportQuotationPdf(quotation);
  };

  return (
    <div className={`flex gap-2 ${className}`}>
      <button
        onClick={onExportPdf}
        className="flex items-center gap-1.5 rounded-lg border border-amber-300 bg-gradient-to-br from-amber-100 to-orange-100 px-4 py-2 text-sm font-medium text-amber-900 shadow-sm transition-all hover:scale-105 hover:shadow-md"
      >
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
        PDF
      </button>
      <button
        onClick={() => comingSoon("Export Excel")}
        className="flex items-center gap-1.5 rounded-lg border border-green-300 bg-gradient-to-br from-green-100 to-emerald-100 px-4 py-2 text-sm font-medium text-green-900 shadow-sm transition-all hover:scale-105 hover:shadow-md"
      >
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        Excel
      </button>
    </div>
  );
}