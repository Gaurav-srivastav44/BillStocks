import { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api";
import html2pdf from "html2pdf.js";
import { useAuth } from "../context/AuthContext";
import { Printer, Download, ArrowLeft } from "lucide-react";

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

  const handlePrint = () => {
    window.print();
  };

  if (!invoice)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse text-blue-600 font-medium">
          Fetching Invoice Details...
        </div>
      </div>
    );

  return (
    <div className="bg-slate-100 min-h-screen pb-10 md:pb-20 px-2 md:px-4 pt-4 md:pt-6">

      {/* Top Action Bar */}
      <div className="max-w-[210mm] mx-auto flex flex-col sm:flex-row justify-between items-center mb-6 gap-4 no-print">
        <Link
          to="/invoices"
          className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition font-medium"
        >
          <ArrowLeft size={18} /> Back to List
        </Link>

        <div className="flex gap-2 w-full sm:w-auto">
          <button
            onClick={handlePrint}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-white border border-slate-300 text-slate-700 px-4 py-2 rounded-xl font-bold hover:bg-slate-50 transition shadow-sm text-sm"
          >
            <Printer size={16} /> Print
          </button>

          <button
            onClick={handleDownload}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-xl font-bold hover:bg-slate-800 transition shadow-md text-sm"
          >
            <Download size={16} /> PDF
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
            backgroundColor: "white"
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
                <p className="font-bold text-slate-800">
                  {user?.firmAddress || "Firm Address Not Set"}
                </p>
                <p>Email: {user?.email}</p>
                <p>Phone: {user?.firmPhone}</p>
                {user?.firmGst && (
                  <p className="font-bold text-slate-800">
                    GSTIN: {user.firmGst}
                  </p>
                )}
              </div>
            </div>

            <div className="text-right">
              <h1 className="text-5xl font-black text-slate-200 uppercase mb-2">
                Invoice
              </h1>
              <div className="bg-slate-50 border rounded-lg p-3">
                <p className="text-xs text-slate-400 uppercase">Invoice No</p>
                <p className="text-xl font-black">
                  #{invoice.invoiceNumber}
                </p>
                <p className="text-xs text-slate-500">
                  Date: {new Date(invoice.createdAt).toLocaleDateString("en-IN")}
                </p>
              </div>
            </div>
          </div>

          {/* Customer */}
          <div className="mb-8">
            <h3 className="text-xs font-black text-slate-400 uppercase mb-1">
              Bill To
            </h3>
            <p className="font-bold text-lg">
              {invoice.account?.name || invoice.customerName}
            </p>
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
                  <td className="p-3 text-right font-bold">
                    ₹{item.lineTotal.toFixed(2)}
                  </td>
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
            <p className="border-t pt-2 w-48 ml-auto text-sm">
              Authorized Signatory
            </p>
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