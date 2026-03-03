import { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api";
import html2pdf from "html2pdf.js";
import { useAuth } from "../context/AuthContext";
import { Printer, Download, ArrowLeft, CheckCircle2 } from "lucide-react";

const InvoicePrintView = () => {
  const { id } = useParams();
  const [invoice, setInvoice] = useState(null);
  const printRef = useRef();
  const { user } = useAuth();

  useEffect(() => {
    api.get(`/invoices/${id}`)
      .then((res) => setInvoice(res.data.data))
      .catch(() => setInvoice(null));
  }, [id]);

  const handleDownload = () => {
    const element = printRef.current;
    const opt = {
      margin: 0,
      filename: `BillStocks_Inv_${invoice.invoiceNumber}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 3, useCORS: true, letterRendering: true },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" }
    };
    html2pdf().set(opt).from(element).save();
  };

  if (!invoice) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-pulse text-blue-600 font-medium">Fetching Invoice Details...</div>
    </div>
  );

  return (
    <div className="bg-slate-100 min-h-screen pb-10 md:pb-20 px-2 md:px-4 pt-4 md:pt-6">
      
      {/* Top Action Bar - Responsive */}
      <div className="max-w-[210mm] mx-auto flex flex-col sm:flex-row justify-between items-center mb-6 gap-4 no-print">
        <Link to="/invoices" className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition font-medium">
          <ArrowLeft size={18} /> Back to List
        </Link>
        <div className="flex gap-2 w-full sm:w-auto">
          <button
            onClick={() => window.print()}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-white border border-slate-300 text-slate-700 px-4 py-2 md:py-2.5 rounded-xl font-bold hover:bg-slate-50 transition shadow-sm text-sm"
          >
            <Printer size={16} /> Print
          </button>
          <button
            onClick={handleDownload}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-slate-900 text-white px-4 py-2 md:py-2.5 rounded-xl font-bold hover:bg-slate-800 transition shadow-md text-sm"
          >
            <Download size={16} /> PDF
          </button>
        </div>
      </div>

      {/* A4 Container - Scrollable on Mobile */}
      <div className="w-full overflow-x-auto pb-4 custom-scrollbar">
        <div
          ref={printRef}
          className="mx-auto bg-white shadow-2xl relative border-2 border-black print:border-2 print:shadow-none"
          style={{ 
            width: '210mm', 
            minHeight: '297mm', 
            padding: '15mm',
            backgroundColor: 'white'
          }}
        >
          {/* Header Section */}
          <div className="flex justify-between items-start mb-10">
            <div className="max-w-[60%]">
              <div className="flex items-center gap-2 mb-4">
                 <div className="w-10 h-10 bg-slate-900 rounded-lg flex items-center justify-center text-white font-black text-xl shrink-0">
                   {(user?.firmName || "B").charAt(0).toUpperCase()}
                 </div>
                 <h2 className="text-xl md:text-2xl font-black tracking-tighter text-slate-900 uppercase truncate">
                   {user?.firmName || "BillStocks Corp"}
                 </h2>
              </div>
              <div className="text-slate-500 text-[12px] md:text-[13px] leading-relaxed">
                <p className="font-bold text-slate-800">{user?.firmAddress || "Firm Address Not Set"}</p>
                <p>Email: {user?.email}</p>
                <p>Phone: {user?.firmPhone}</p>
                {user?.firmGst && (
                  <p className="mt-1 flex items-center gap-1 text-slate-800 font-bold">
                    GSTIN: {user.firmGst}
                  </p>
                )}
              </div>
            </div>

            <div className="text-right">
              <h1 className="text-4xl md:text-5xl font-black text-slate-200 uppercase mb-2">Invoice</h1>
              <div className="inline-block bg-slate-50 border border-slate-100 rounded-lg p-3 text-right">
                  <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">Invoice No</p>
                  <p className="text-slate-900 font-black text-lg md:text-xl">#{invoice.invoiceNumber}</p>
                  <p className="text-slate-500 text-[11px] mt-1">Date: {new Date(invoice.createdAt).toLocaleDateString('en-IN')}</p>
              </div>
            </div>
          </div>

          {/* Billing Info Grid */}
          <div className="grid grid-cols-2 gap-8 mb-10 pb-8 border-b border-slate-100">
            <div>
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Bill To</h3>
              <div className="text-slate-900 font-bold text-base md:text-lg leading-tight">
                {invoice.account?.name || invoice.customerName}
              </div>
              <p className="text-slate-500 text-xs mt-1">{invoice.account?.address?.city || "Customer City"}</p>
              {invoice.account?.contacts?.mobile && <p className="text-slate-500 text-xs">Ph: {invoice.account.contacts.mobile}</p>}
            </div>
            <div className="flex flex-col items-end">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Payment Info</h3>
              <div className="text-right">
                  <p className="text-slate-900 font-bold text-sm mb-1">Status: <span className="text-green-600 underline">PAID</span></p>
                  <p className="text-slate-500 text-[11px]">Method: Cash / UPI</p>
              </div>
            </div>
          </div>

          {/* Table Section */}
          <div className="mb-10">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-900 text-white text-left uppercase text-[9px] tracking-widest">
                  <th className="p-3 rounded-l-lg">Description</th>
                  <th className="p-3 text-center">Qty</th>
                  <th className="p-3 text-right">Rate</th>
                  <th className="p-3 text-center">GST</th>
                  <th className="p-3 text-right rounded-r-lg">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {invoice.items.map((item, i) => (
                  <tr key={i} className="text-slate-700 text-xs font-medium">
                    <td className="p-3 py-4">
                      <div className="font-bold text-slate-900">{item.name}</div>
                      <span className="text-[10px] text-slate-400 italic">ID: {item.productId?.slice(-6).toUpperCase()}</span>
                    </td>
                    <td className="p-3 text-center">{item.quantity}</td>
                    <td className="p-3 text-right">₹{item.price.toFixed(2)}</td>
                    <td className="p-3 text-center text-slate-400">{item.gstRate}%</td>
                    <td className="p-3 text-right font-bold text-slate-900">₹{item.lineTotal.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals Section */}
          <div className="flex justify-between items-start gap-4">
              <div className="w-1/2">
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                      <h4 className="text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest">Terms & Notes</h4>
                      <p className="text-[10px] text-slate-500 leading-relaxed italic">
                          1. Goods once sold will not be taken back.<br/>
                          2. E. & O.E. Subject to local jurisdiction.
                      </p>
                  </div>
                  <div className="mt-4 flex items-center gap-2 text-green-700 font-bold text-xs bg-green-50 w-fit px-3 py-1 rounded-full border border-green-100">
                      <CheckCircle2 size={12} /> Verified BillStocks Invoice
                  </div>
              </div>

              <div className="w-64">
                  <div className="space-y-2 px-2">
                      <div className="flex justify-between text-xs text-slate-500 font-medium">
                          <span>Subtotal</span>
                          <span>₹{invoice.subTotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-xs text-slate-500 font-medium">
                          <span>Tax (GST)</span>
                          <span>₹{invoice.gstAmount.toFixed(2)}</span>
                      </div>
                      {invoice.discountAmount > 0 && (
                          <div className="flex justify-between text-xs text-rose-500 font-medium">
                              <span>Discount</span>
                              <span>-₹{invoice.discountAmount.toFixed(2)}</span>
                          </div>
                      )}
                  </div>
                  <div className="mt-4 bg-slate-900 text-white rounded-xl p-4 flex justify-between items-center shadow-lg">
                      <span className="text-[9px] uppercase font-bold tracking-widest opacity-70">Total Due</span>
                      <span className="text-xl md:text-2xl font-black tracking-tight font-mono">₹{invoice.grandTotal.toFixed(2)}</span>
                  </div>
              </div>
          </div>

          {/* Signature Section */}
          <div className="mt-auto pt-20 flex justify-end">
              <div className="text-center w-40">
                  <div className="h-px bg-slate-300 mb-2 w-full"></div>
                  <p className="text-[10px] font-black text-slate-900 uppercase tracking-tighter">Authorized Signatory</p>
                  <p className="text-[9px] text-slate-400 italic">For {user?.firmName || "BillStocks"}</p>
              </div>
          </div>

          {/* Branding Watermark */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.02] -rotate-45 pointer-events-none select-none w-full flex justify-center">
              <h1 className="text-[100px] font-black whitespace-nowrap">BILLSTOCKS</h1>
          </div>
        </div>
      </div>

      <style>
        {`
          /* Scrollbar Styling for Mobile */
          .custom-scrollbar::-webkit-scrollbar {
            height: 6px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: #f1f5f9;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #cbd5e1;
            border-radius: 10px;
          }

          @media print {
            body { 
              background: white !important; 
              margin: 0 !important; 
              padding: 0 !important; 
              -webkit-print-color-adjust: exact;
            }
            .no-print { display: none !important; }
            .bg-slate-100 { background: white !important; padding: 0 !important; }
            .overflow-x-auto { overflow: visible !important; }
            .mx-auto { margin: 0 !important; }
            .shadow-2xl { box-shadow: none !important; }
            
            /* Ensure the container fits exactly A4 */
            div[style*="width: 210mm"] {
               border: 2px solid black !important;
               margin: 0 !important;
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