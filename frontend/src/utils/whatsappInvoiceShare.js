/**
 * Sanitize user-entered phone for https://wa.me/ (digits only, no + in URL).
 * Supports optional country code; if exactly 10 digits and looks like an Indian mobile, prepends 91.
 */
export function sanitizeWhatsAppNumber(raw) {
  if (raw == null || String(raw).trim() === "") {
    return { ok: false, digits: null, error: "Customer WhatsApp number is missing. Add it when creating the invoice, then try again." };
  }

  let digits = String(raw).replace(/\D/g, "");
  digits = digits.replace(/^0+/, "");

  if (!digits) {
    return { ok: false, digits: null, error: "Customer WhatsApp number is missing. Add it when creating the invoice, then try again." };
  }

  // Common case: 10-digit Indian mobile without country code
  if (digits.length === 10 && /^[6-9]\d{9}$/.test(digits)) {
    digits = `91${digits}`;
  }

  if (digits.length < 10 || digits.length > 15) {
    return {
      ok: false,
      digits: null,
      error:
        "Enter a valid WhatsApp number (with country code, e.g. 919876543210). Up to 15 digits after cleaning.",
    };
  }

  return { ok: true, digits, error: null };
}

export function buildInvoiceWhatsAppMessage({ invoiceNumber, customerName, grandTotal }) {
  const name = customerName?.trim() || "Customer";
  const total =
    typeof grandTotal === "number" && !Number.isNaN(grandTotal)
      ? grandTotal.toFixed(2)
      : String(grandTotal ?? "0");

  return `Hello ${name},

Your invoice from BillStocks is attached / ready to share.

Invoice #: ${invoiceNumber}
Customer: ${name}
Total amount: ₹${total}

Thank you for your business — we appreciate you choosing BillStocks.`;
}

export function buildWhatsAppInvoiceUrl({ phoneDigits, message }) {
  const text = encodeURIComponent(message);
  return `https://wa.me/${phoneDigits}?text=${text}`;
}
