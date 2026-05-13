import { triggerPdfBlobDownload } from "./invoicePdfExport.js";

/**
 * Try native Web Share API with PDF file (mobile-friendly: user picks WhatsApp and PDF attaches).
 * Falls back to: download PDF + open wa.me with prefilled caption (desktop / unsupported browsers).
 *
 * @param {Blob} pdfBlob
 * @param {string} filename — e.g. Invoice-INV-0001.pdf
 * @param {string} shareCaption — short text shown alongside the file in the share sheet where supported
 * @param {string} waMeUrl — full https://wa.me/... URL for fallback
 * @returns {Promise<{ mode: "web_share" | "fallback" | "aborted" }>}
 */
export async function shareInvoicePdfWithWhatsApp({ pdfBlob, filename, shareCaption, waMeUrl }) {
  const file = new File([pdfBlob], filename, { type: "application/pdf" });

  const sharePayload = {
    title: "BillStocks Invoice",
    text: shareCaption,
    files: [file],
  };

  let canNativeShare = false;
  try {
    canNativeShare =
      typeof navigator !== "undefined" &&
      typeof navigator.share === "function" &&
      typeof navigator.canShare === "function" &&
      navigator.canShare(sharePayload);
  } catch {
    canNativeShare = false;
  }

  if (canNativeShare) {
    try {
      await navigator.share(sharePayload);
      return { mode: "web_share" };
    } catch (err) {
      if (err?.name === "AbortError") {
        return { mode: "aborted" };
      }
      console.warn("navigator.share failed, falling back to download + wa.me:", err);
    }
  }

  triggerPdfBlobDownload(pdfBlob, filename);
  await new Promise((r) => setTimeout(r, 180));
  window.open(waMeUrl, "_blank", "noopener,noreferrer");
  return { mode: "fallback" };
}
