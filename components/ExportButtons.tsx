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
        className="rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-sm hover:bg-zinc-100"
      >
        Export PDF
      </button>
      <button
        onClick={() => comingSoon("Export Excel")}
        className="rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-sm hover:bg-zinc-100"
      >
        Export Excel
      </button>
    </div>
  );
}