import { useCallback, useEffect, useRef, useState } from "react";
import api from "../api";
import ReportExportToolbar from "../components/ReportExportToolbar";

const StockSummary = () => {
  const exportRef = useRef(null);
  const [summary, setSummary] = useState({});

  useEffect(() => {
    api.get("/reports/stock-summary").then((res) => setSummary(res.data.data || {}));
  }, []);

  const getExcelSheets = useCallback(() => {
    const list = Object.entries(summary);
    const rows = list.map(([cat, qty]) => ({ Category: cat, TotalQty: qty }));
    const grand = list.reduce((s, [, q]) => s + (Number(q) || 0), 0);
    rows.push({ Category: "TOTAL", TotalQty: grand });
    return [{ sheetName: "Stock_Summary", rows }];
  }, [summary]);

  const entries = Object.entries(summary);

  return (
    <div className="card">
      <div className="section-header" style={{ flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h2 style={{ margin: 0 }}>Stock Summary</h2>
          <p className="muted">Totals by category</p>
        </div>
        <ReportExportToolbar
          pdfTargetRef={exportRef}
          pdfFileSlug="Stock_Summary_Report"
          reportTitle="Stock summary (inventory by category)"
          reportSubtitle="Category totals"
          getExcelSheets={getExcelSheets}
          disabled={!entries.length}
        />
      </div>
      <div ref={exportRef}>
        <div className="mb-4 rounded-xl bg-slate-900 px-4 py-3 text-white">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">BillStocks</p>
          <h3 className="text-base font-black">Stock summary</h3>
          <p className="text-xs text-slate-400 mt-1">Generated: {new Date().toLocaleString()}</p>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th>Category</th>
              <th>Total Qty</th>
            </tr>
          </thead>
          <tbody>
            {entries.map(([cat, qty]) => (
              <tr key={cat}>
                <td>{cat}</td>
                <td>{qty}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StockSummary;
