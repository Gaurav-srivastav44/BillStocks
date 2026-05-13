import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import ReportExportToolbar from "../components/ReportExportToolbar";

const Invoices = () => {
  const exportRef = useRef(null);
  const [invoices, setInvoices] = useState([]);

  useEffect(() => {
    api.get("/invoices").then((res) => setInvoices(res.data.data || [])).catch(() => setInvoices([]));
  }, []);

  const getExcelSheets = useCallback(() => {
    const rows = invoices.map((inv) => ({
      InvoiceNumber: inv.invoiceNumber,
      Customer: inv.customerName,
      Date: new Date(inv.createdAt).toLocaleDateString(),
      Total_INR: inv.grandTotal ?? 0,
    }));
    const sum = invoices.reduce((s, inv) => s + (Number(inv.grandTotal) || 0), 0);
    rows.push({
      InvoiceNumber: "",
      Customer: "",
      Date: "LIST TOTAL",
      Total_INR: sum,
    });
    return [{ sheetName: "Invoices", rows }];
  }, [invoices]);

  return (
    <div className="card">
      <div className="section-header" style={{ flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h2 style={{ margin: 0 }}>Invoices</h2>
          <p className="muted">Saved bills with totals</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <ReportExportToolbar
            pdfTargetRef={exportRef}
            pdfFileSlug="Invoice_List_Report"
            reportTitle="Invoice list report"
            reportSubtitle="All saved invoices"
            getExcelSheets={getExcelSheets}
            disabled={!invoices.length}
          />
          <Link className="primary-button" to="/billing">
            New Invoice
          </Link>
        </div>
      </div>
      <div ref={exportRef}>
        <div className="mb-4 rounded-xl bg-slate-900 px-4 py-3 text-white">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">BillStocks</p>
          <h3 className="text-base font-black">Invoice report</h3>
          <p className="text-xs text-slate-400 mt-1">Generated: {new Date().toLocaleString()}</p>
          <p className="text-sm font-semibold mt-2">Count: {invoices.length}</p>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th>Number</th>
              <th>Customer</th>
              <th>Date</th>
              <th>Total</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((inv) => (
              <tr key={inv._id}>
                <td>{inv.invoiceNumber}</td>
                <td>{inv.customerName}</td>
                <td>{new Date(inv.createdAt).toLocaleDateString()}</td>
                <td>₹ {inv.grandTotal?.toFixed(2)}</td>
                <td>
                  <Link className="secondary-button" to={`/invoices/${inv._id}/print`}>
                    Print
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Invoices;
