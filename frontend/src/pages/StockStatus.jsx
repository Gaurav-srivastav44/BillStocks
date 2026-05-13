import { useCallback, useEffect, useRef, useState } from "react";
import api from "../api";
import ReportExportToolbar from "../components/ReportExportToolbar";

const StockStatus = () => {
  const exportRef = useRef(null);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    api.get("/reports/stock-status").then((res) => setProducts(res.data.data || []));
  }, []);

  const getExcelSheets = useCallback(() => {
    const rows = products.map((p) => ({
      Name: p.name,
      SKU: p.sku || "",
      Category: p.category || "-",
      Stock: p.stock ?? 0,
    }));
    const totalQty = products.reduce((s, p) => s + (Number(p.stock) || 0), 0);
    rows.push({ Name: "", SKU: "", Category: "TOTAL UNITS", Stock: totalQty });
    return [{ sheetName: "Stock_Status", rows }];
  }, [products]);

  return (
    <div className="card">
      <div className="section-header" style={{ flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h2 style={{ margin: 0 }}>Stock Status</h2>
          <p className="muted">Current stock for all products</p>
        </div>
        <ReportExportToolbar
          pdfTargetRef={exportRef}
          pdfFileSlug="Stock_Status_Report"
          reportTitle="Stock status report"
          reportSubtitle="All products · live quantities"
          getExcelSheets={getExcelSheets}
          disabled={!products.length}
        />
      </div>
      <div ref={exportRef}>
        <div className="mb-4 rounded-xl bg-slate-900 px-4 py-3 text-white">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">BillStocks</p>
          <h3 className="text-base font-black">Stock status</h3>
          <p className="text-xs text-slate-400 mt-1">Generated: {new Date().toLocaleString()}</p>
          <p className="text-sm font-semibold mt-2">Products listed: {products.length}</p>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>SKU</th>
              <th>Category</th>
              <th>Stock</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p._id}>
                <td>{p.name}</td>
                <td>{p.sku}</td>
                <td>{p.category || "-"}</td>
                <td>{p.stock}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StockStatus;
