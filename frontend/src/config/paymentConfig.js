/**
 * BillStocks — static UPI payment settings (edit here; no rebuild of backend required).
 * Used by InvoicePrintView for dynamic QR (amount comes from each invoice).
 */
export const paymentConfig = {
  /** Your VPA, e.g. merchantname@paytm */
  upiId: "demo@upi",
  /** Shown in UPI apps as payee name (pn=) */
  shopName: "BillStocks",
};

/**
 * Builds a standard UPI deep link for QR scanners / UPI apps.
 * @returns {string|null} null if UPI ID or amount is invalid
 */
export function buildUpiPayIntentUrl(amountInr) {
  const upiId = String(paymentConfig.upiId || "").trim();
  const shopName = String(paymentConfig.shopName || "BillStocks").trim();
  if (!upiId) return null;

  const amt = Number(amountInr);
  if (!Number.isFinite(amt) || amt <= 0) return null;

  const am = amt.toFixed(2);
  return `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(shopName)}&am=${am}&cu=INR`;
}
