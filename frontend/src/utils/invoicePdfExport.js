import html2pdf from "html2pdf.js";

/**
 * html2pdf options tuned for BillStocks invoice A4 print area.
 * @param {string} invoiceNumber
 * @param {object} [overrides] — merged into image / html2canvas / jsPDF
 */
export function buildInvoiceHtml2PdfOptions(invoiceNumber, overrides = {}) {
  const base = {
    margin: 0,
    filename: `BillStocks_Inv_${invoiceNumber}.pdf`,
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 3, useCORS: true, letterRendering: true },
    jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
  };

  return {
    ...base,
    ...overrides,
    image: { ...base.image, ...(overrides.image || {}) },
    html2canvas: { ...base.html2canvas, ...(overrides.html2canvas || {}) },
    jsPDF: { ...base.jsPDF, ...(overrides.jsPDF || {}) },
  };
}

/**
 * Renders the invoice DOM node to a PDF Blob (download, mail attachment, WhatsApp companion file).
 */
export async function renderInvoicePdfBlob(element, invoiceNumber, optionOverrides = {}) {
  if (!element) {
    throw new Error("Invoice preview is not ready.");
  }
  const opt = buildInvoiceHtml2PdfOptions(invoiceNumber, optionOverrides);
  return html2pdf().set(opt).from(element).outputPdf("blob");
}

/** Programmatic download (reliable await + error handling vs fire-and-forget .save()). */
export function triggerPdfBlobDownload(blob, filename) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.rel = "noopener";
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}
