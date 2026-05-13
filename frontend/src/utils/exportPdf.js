import html2pdf from "html2pdf.js";
import { triggerPdfBlobDownload } from "./invoicePdfExport.js";

/**
 * Generic A4 PDF export for report / dashboard DOM regions (html2canvas + jsPDF).
 * @param {HTMLElement} element — visible region to capture
 * @param {string} filenameBase — without .pdf
 */
export async function exportElementToPdfBlob(element, filenameBase = "BillStocks_Report") {
  if (!element) {
    throw new Error("Export target is not available.");
  }

  const opt = {
    margin: [8, 8, 8, 8],
    filename: `${filenameBase}.pdf`,
    image: { type: "jpeg", quality: 0.92 },
    html2canvas: {
      scale: 2,
      useCORS: true,
      letterRendering: true,
      logging: false,
    },
    jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    pagebreak: { mode: ["css", "legacy"] },
  };

  return html2pdf().set(opt).from(element).outputPdf("blob");
}

/** Generates PDF from DOM and triggers browser download. */
export async function downloadReportAsPdf(element, filenameBase) {
  const blob = await exportElementToPdfBlob(element, filenameBase);
  triggerPdfBlobDownload(blob, `${filenameBase}.pdf`);
}
