import { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../api";
import { useAuth } from "../context/AuthContext";
import { Printer, Download, ArrowLeft, Mail, MessageCircle, Loader2 } from "lucide-react";
import {
  sanitizeWhatsAppNumber,
  buildInvoiceWhatsAppMessage,
  buildWhatsAppInvoiceUrl,
} from "../utils/whatsappInvoiceShare";
import { renderInvoicePdfBlob, triggerPdfBlobDownload } from "../utils/invoicePdfExport";

const btnBase =
  "flex-1 min-w-[7rem] sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all duration-200 ease-out shadow-md disabled:opacity-55 disabled:cursor-not-allowed disabled:shadow-none hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 active:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500";

const InvoicePrintView = () => {
  const { id } = useParams();
  const [invoice, setInvoice] = useState(null);
  const [mailSending, setMailSending] = useState(false);
  const [whatsappBusy, setWhatsappBusy] = useState(false);
  const printRef = useRef();
  const { user } = useAuth();

  useEffect(() => {
    api
      .get(`/invoices/${id}`)
      .then((res) => setInvoice(res.data.data))
      .catch(() => setInvoice(null));
  }, [id]);

  /** Standalone PDF download from the invoice preview (html2pdf → blob → save). */
  const handleDownload = async () => {
    try {
      const blob = await renderInvoicePdfBlob(printRef.current, invoice.invoiceNumber);
      triggerPdfBlobDownload(blob, `BillStocks_Inv_${invoice.invoiceNumber}.pdf`);
      toast.success("PDF downloaded successfully");
    } catch (error) {
      console.error("PDF export failed:", error);
      toast.error("Failed to generate PDF");
    }
  };

  const handlePrint = () => {
    window.print();
  };

  /** Brevo mail: build PDF client-side (same layout as print), upload, send transactional email. */
  const handleSendMail = async () => {
    if (!invoice?.customerEmail) {
      toast.error("Customer email is missing on this invoice.");
      return;
    }

    const toastId = toast.loading("Sending invoice…");
    setMailSending(true);

    try {
      const element = printRef.current;
      const pdfBlob = await renderInvoicePdfBlob(element, invoice.invoiceNumber, {
        image: { quality: 1 },
      });

      const formData = new FormData();
      formData.append("pdf", pdfBlob, `Invoice-${invoice.invoiceNumber}.pdf`);
      formData.append("customerEmail", invoice.customerEmail);
      formData.append("customerName", invoice.customerName);
      formData.append("invoiceNumber", invoice.invoiceNumber);

      await api.post("/invoices/send-mail", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Invoice mailed successfully", { id: toastId });
    } catch (error) {
      console.error("Mail send failed:", error);
      toast.error("Failed to send invoice", { id: toastId });
    } finally {
      setMailSending(false);
    }
  };

  /**
   * WhatsApp share: generate PDF, download for the customer record, then open wa.me with prefilled text.
   * User still taps Send inside WhatsApp (no silent auto-send).
   */
  const handleWhatsAppShare = async () => {
    const { ok, digits, error } = sanitizeWhatsAppNumber(invoice?.customerWhatsApp);
    if (!ok || !digits) {
      toast.error(error || "Customer number missing");
      return;
    }

    setWhatsappBusy(true);
    const toastId = toast.loading("Preparing PDF and WhatsApp…");

    try {
      const blob = await renderInvoicePdfBlob(printRef.current, invoice.invoiceNumber, {
        image: { quality: 1 },
      });
      triggerPdfBlobDownload(blob, `BillStocks_Inv_${invoice.invoiceNumber}.pdf`);

      const displayName = invoice.account?.name || invoice.customerName || "Customer";
      const message = buildInvoiceWhatsAppMessage({
        invoiceNumber: invoice.invoiceNumber,
        customerName: displayName,
        grandTotal: invoice.grandTotal,
      });
      const url = buildWhatsAppInvoiceUrl({ phoneDigits: digits, message });

      // Brief delay helps mobile browsers finish the download before opening WhatsApp / Web.
      await new Promise((r) => setTimeout(r, 150));
      const popup = window.open(url, "_blank", "noopener,noreferrer");

      if (popup) {
        toast.success("PDF downloaded and WhatsApp opened", { id: toastId });
      } else {
        toast.success("PDF downloaded. Allow pop-ups for this site to open WhatsApp automatically.", {
          id: toastId,
          duration: 5500,
        });
      }
    } catch (err) {
      console.error("WhatsApp / PDF flow failed:", err);
      toast.error("Failed to generate PDF", { id: toastId });
    } finally {
      setWhatsappBusy(false);
    }
  };

  if (!invoice)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse text-blue-600 font-medium">Fetching Invoice Details...</div>
      </div>
    );

  return (
    <div className="bg-slate-100 min-h-screen pb-10 md:pb-20 px-2 md:px-4 pt-4 md:pt-6">
      {/* Top action bar — Mail / WhatsApp use toasts + loading states (see App.js <Toaster />). */}
      <div className="max-w-[210mm] mx-auto flex flex-col sm:flex-row justify-between items-center mb-6 gap-4 no-print">
        <Link
          to="/invoices"
          className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition font-medium"
        >
          <ArrowLeft size={18} /> Back to List
        </Link>

        <div className="flex flex-wrap gap-2 w-full sm:w-auto justify-stretch sm:justify-end">
          <button
            type="button"
            onClick={handlePrint}
            className={`${btnBase} bg-white border border-slate-300 text-slate-700 shadow-sm hover:bg-slate-50`}
          >
            <Printer size={16} className="shrink-0" /> Print
          </button>

          <button
            type="button"
            onClick={handleDownload}
            className={`${btnBase} bg-slate-900 text-white hover:bg-slate-800 focus-visible:ring-slate-500`}
          >
            <Download size={16} className="shrink-0" /> PDF
          </button>

          <button
            type="button"
            onClick={handleSendMail}
            disabled={mailSending || !invoice?.customerEmail}
            className={`${btnBase} bg-blue-600 text-white hover:bg-blue-500 focus-visible:ring-blue-400`}
          >
            {mailSending ? (
              <>
                <Loader2 size={16} className="shrink-0 animate-spin" /> Sending…
              </>
            ) : (
              <>
                <Mail size={16} className="shrink-0" /> Mail
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleWhatsAppShare}
            disabled={whatsappBusy}
            className={`${btnBase} bg-gradient-to-br from-emerald-500 to-green-700 text-white ring-1 ring-emerald-400/30 shadow-emerald-900/25 hover:from-emerald-600 hover:to-green-800 focus-visible:ring-emerald-400`}
          >
            {whatsappBusy ? (
              <>
                <Loader2 size={16} className="shrink-0 animate-spin" /> Preparing…
              </>
            ) : (
              <>
                <MessageCircle size={16} className="shrink-0" /> WhatsApp
              </>
            )}
          </button>
        </div>
      </div>

      {/* Invoice Container */}
      <div className="w-full overflow-x-auto pb-4">
        <div
          id="print-area"
          ref={printRef}
          className="mx-auto bg-white shadow-2xl relative border-2 border-black print:shadow-none"
          style={{
            width: "210mm",
            minHeight: "297mm",
            padding: "15mm",
            backgroundColor: "white",
          }}
        >
          {/* Header */}
          <div className="flex justify-between items-start mb-10">
            <div className="max-w-[60%]">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-slate-900 rounded-lg flex items-center justify-center text-white font-black text-xl">
                  {(user?.firmName || "B").charAt(0).toUpperCase()}
                </div>
                <h2 className="text-2xl font-black text-slate-900 uppercase">
                  {user?.firmName || "BillStocks Corp"}
                </h2>
              </div>

              <div className="text-slate-500 text-sm">
                <p className="font-bold text-slate-800">{user?.firmAddress || "Firm Address Not Set"}</p>
                <p>Email: {user?.email}</p>
                <p>Phone: {user?.firmPhone}</p>
                {user?.firmGst && (
                  <p className="font-bold text-slate-800">GSTIN: {user.firmGst}</p>
                )}
              </div>
            </div>

            <div className="text-right">
              <h1 className="text-5xl font-black text-slate-200 uppercase mb-2">Invoice</h1>
              <div className="bg-slate-50 border rounded-lg p-3">
                <p className="text-xs text-slate-400 uppercase">Invoice No</p>
                <p className="text-xl font-black">#{invoice.invoiceNumber}</p>
                <p className="text-xs text-slate-500">
                  Date: {new Date(invoice.createdAt).toLocaleDateString("en-IN")}
                </p>
              </div>
            </div>
          </div>

          {/* Customer */}
          <div className="mb-8">
            <h3 className="text-xs font-black text-slate-400 uppercase mb-1">Bill To</h3>
            <p className="font-bold text-lg">{invoice.account?.name || invoice.customerName}</p>
          </div>

          {/* Items Table */}
          <table className="w-full mb-10">
            <thead>
              <tr className="bg-slate-900 text-white text-xs uppercase">
                <th className="p-3 text-left">Description</th>
                <th className="p-3 text-center">Qty</th>
                <th className="p-3 text-right">Rate</th>
                <th className="p-3 text-center">GST</th>
                <th className="p-3 text-right">Total</th>
              </tr>
            </thead>

            <tbody>
              {invoice.items.map((item, i) => (
                <tr key={i} className="border-b text-sm">
                  <td className="p-3">{item.name}</td>
                  <td className="p-3 text-center">{item.quantity}</td>
                  <td className="p-3 text-right">₹{item.price.toFixed(2)}</td>
                  <td className="p-3 text-center">{item.gstRate}%</td>
                  <td className="p-3 text-right font-bold">₹{item.lineTotal.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Totals */}
          <div className="flex justify-end">
            <div className="w-64 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>₹{invoice.subTotal.toFixed(2)}</span>
              </div>

              <div className="flex justify-between text-sm">
                <span>GST</span>
                <span>₹{invoice.gstAmount.toFixed(2)}</span>
              </div>

              <div className="flex justify-between text-lg font-bold border-t pt-2">
                <span>Total</span>
                <span>₹{invoice.grandTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Signature */}
          <div className="mt-20 text-right">
            <p className="border-t pt-2 w-48 ml-auto text-sm">Authorized Signatory</p>
          </div>
        </div>
      </div>

      <style>
        {`
        @media print {

          body * {
            visibility: hidden;
          }

          #print-area, #print-area * {
            visibility: visible;
          }

          #print-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 210mm;
          }

          .no-print {
            display: none !important;
          }

          @page {
            size: A4;
            margin: 0;
          }

        }
        `}
      </style>
    </div>
  );
};

export default InvoicePrintView;
