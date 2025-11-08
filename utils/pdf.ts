import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import type { Quotation } from "../context/QuotationContext";

const currency = (n: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n || 0);
const sanitize = (s: string) => s.replace(/[^a-z0-9\-_. ]/gi, "_");

const brand = {
  orange: [249, 115, 22] as [number, number, number], // orange-500
  orangeDark: [194, 65, 12] as [number, number, number], // orange-700
  yellow: [253, 224, 71] as [number, number, number], // yellow-300
  yellowLight: [254, 243, 199] as [number, number, number], // amber-100
  red: [239, 68, 68] as [number, number, number], // red-500
  black: [0, 0, 0] as [number, number, number],
  grayText: [60, 60, 60] as [number, number, number],
  white: [255, 255, 255] as [number, number, number],
};

function statusColor(status: Quotation["status"]) {
  switch (status) {
    case "accepted":
      return brand.black;
    case "declined":
      return brand.red;
    case "sent":
      return brand.orange;
    case "updated":
    case "draft":
      return brand.yellow;
    default:
      return brand.grayText;
  }
}

export function exportQuotationPdf(q?: Quotation) {
  if (!q) return;
  const doc = new jsPDF({ unit: "pt", format: "a4" });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const marginX = 40;
  let y = 40;

  // Header band (orange)
  doc.setFillColor(...brand.orange);
  doc.rect(0, 0, pageWidth, 90, "F");

  doc.setTextColor(...brand.white);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.text("Quotation", marginX, 50);
  doc.setFontSize(12);
  doc.text(`${q.companyName} • ${q.projectName}`, marginX, 70);

  // Status badge
  const badgeColor = statusColor(q.status);
  doc.setFillColor(...badgeColor);
  const badgeText = q.status.toUpperCase();
  const badgeWidth = doc.getTextWidth(badgeText) + 18;
  doc.rect(pageWidth - marginX - badgeWidth, 30, badgeWidth, 24, "F");
  doc.setTextColor(...brand.white);
  doc.text(badgeText, pageWidth - marginX - badgeWidth + 9, 46);

  // Back to normal text color
  doc.setTextColor(0, 0, 0);
  doc.setFont("helvetica", "normal");
  y = 110;

  // Section: Details cards
  doc.setDrawColor(...brand.orangeDark);
  doc.setLineWidth(0.8);
  doc.line(marginX, y, pageWidth - marginX, y);
  y += 16;
  doc.setFontSize(12);
  doc.setTextColor(...brand.grayText);
  doc.text("Details", marginX, y);
  doc.setTextColor(0, 0, 0);
  y += 8;

  // Two subtle cards (light yellow)
  doc.setFillColor(...brand.yellowLight);
  doc.rect(marginX, y, (pageWidth - marginX * 2 - 12) / 2, 40, "F");
  doc.rect(marginX + (pageWidth - marginX * 2 - 12) / 2 + 12, y, (pageWidth - marginX * 2 - 12) / 2, 40, "F");

  doc.setFontSize(11);
  doc.text(`Deployment Cost`, marginX + 12, y + 16);
  doc.setFont("helvetica", "bold");
  doc.text(`${currency(q.deploymentCost || 0)}`, marginX + 12, y + 30);
  doc.setFont("helvetica", "normal");

  // We'll compute totals after table too; for now show current
  const featureSumPref = q.features.reduce((s, f) => s + (f.price || 0), 0);
  const totalPref = featureSumPref + (q.deploymentCost || 0);
  doc.text(`Total`, marginX + (pageWidth - marginX * 2 - 12) / 2 + 24, y + 16);
  doc.setFont("helvetica", "bold");
  doc.text(`${currency(totalPref)}`, marginX + (pageWidth - marginX * 2 - 12) / 2 + 24, y + 30);
  doc.setFont("helvetica", "normal");
  y += 60;

  // Features table
  autoTable(doc, {
    startY: y,
    theme: "grid",
    head: [["Feature", "Description", "Price", "Client Proposed"]],
    body: q.features.map((f) => [
      f.title || "-",
      f.description || "",
      currency(f.price || 0),
      typeof f.clientProposedPrice === "number" ? currency(f.clientProposedPrice) : "-",
    ]),
    styles: { fontSize: 10, cellPadding: 6, lineColor: brand.yellowLight, textColor: 20 },
    headStyles: { fillColor: brand.black, textColor: brand.white[0], fontStyle: "bold" } as any,
    alternateRowStyles: { fillColor: brand.yellowLight },
    columnStyles: {
      2: { halign: "right" },
      3: { halign: "right" },
    },
  });

  const afterTableY = (doc as any).lastAutoTable?.finalY || y;
  y = afterTableY + 24;

  // Recompute totals based on actual features
  const deployment = q.deploymentCost || 0;
  const featureSum = q.features.reduce((s, f) => s + (f.price || 0), 0);
  const total = featureSum + deployment;

  // Summary card (light yellow)
  doc.setFillColor(...brand.yellowLight);
  const summaryW = pageWidth - marginX * 2;
  doc.rect(marginX, y, summaryW, 60, "F");
  doc.setFontSize(12);
  doc.setTextColor(...brand.grayText);
  doc.text("Summary", marginX + 12, y + 18);
  doc.setTextColor(0, 0, 0);
  doc.setFont("helvetica", "bold");
  doc.text(`Features: ${currency(featureSum)}`, marginX + 12, y + 36);
  doc.text(`Deployment: ${currency(deployment)}`, marginX + summaryW / 2, y + 36);
  doc.setTextColor(...brand.orangeDark);
  doc.text(`Total: ${currency(total)}`, marginX + 12, y + 52);
  doc.setTextColor(0, 0, 0);
  doc.setFont("helvetica", "normal");
  y += 80;

  // Notes section
  if (q.notes) {
    doc.setDrawColor(...brand.orangeDark);
    doc.setLineWidth(0.6);
    doc.line(marginX, y, pageWidth - marginX, y);
    y += 16;
    doc.setFontSize(12);
    doc.setTextColor(...brand.grayText);
    doc.text("Notes", marginX, y);
    doc.setTextColor(0, 0, 0);
    y += 10;
    const lines = doc.splitTextToSize(q.notes, pageWidth - marginX * 2);
    doc.text(lines, marginX, y);
    y += lines.length * 14 + 10;
  }

  // Negotiation section
  if ((q.negotiationThread || []).length > 0) {
    doc.setDrawColor(...brand.orangeDark);
    doc.setLineWidth(0.6);
    doc.line(marginX, y, pageWidth - marginX, y);
    y += 16;
    doc.setFontSize(12);
    doc.setTextColor(...brand.grayText);
    doc.text("Negotiation Thread", marginX, y);
    doc.setTextColor(0, 0, 0);
    y += 10;
    doc.setFontSize(10);
    for (const m of q.negotiationThread) {
      const line = `${m.sender}: ${m.text}`;
      const lines = doc.splitTextToSize(line, pageWidth - marginX * 2);
      doc.text(lines, marginX, y);
      y += lines.length * 12 + 8;
    }
  }

  // Footer page numbers
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(9);
    doc.setTextColor(...brand.grayText);
    doc.text(`Page ${i} of ${pageCount}`, pageWidth - marginX, pageHeight - 24, { align: "right" } as any);
    doc.setTextColor(0, 0, 0);
  }

  const fileName = sanitize(`Quotation_${q.companyName}_${q.projectName}.pdf`);
  doc.save(fileName);
}