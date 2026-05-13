import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import api from "../api";
import ReportExportToolbar from "../components/ReportExportToolbar";

const StockDashboard = () => {
  const exportRef = useRef(null);
  const [status, setStatus] = useState([]);
  const [summary, setSummary] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [statusRes, summaryRes] = await Promise.all([
          api.get("/reports/stock-status"),
          api.get("/reports/stock-summary"),
        ]);
        setStatus(statusRes.data.data || []);
        setSummary(summaryRes.data.data || {});
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const summaryRows = Object.entries(summary);

  const totalStock = useMemo(
    () => status.reduce((sum, p) => sum + (p.stock || 0), 0),
    [status]
  );

  const lowStockCount = useMemo(
    () => status.filter((p) => p.stock < 10).length,
    [status]
  );

  const getExcelSheets = useCallback(() => {
    const summaryEntries = Object.entries(summary);
    const catRows = summaryEntries.map(([cat, qty]) => ({ Category: cat, TotalQty: qty }));
    const catGrand = summaryEntries.reduce((s, [, q]) => s + (Number(q) || 0), 0);
    catRows.push({ Category: "TOTAL", TotalQty: catGrand });

    const prodRows = status.map((p) => ({
      Name: p.name,
      SKU: p.sku || "",
      Category: p.category || "-",
      Stock: p.stock ?? 0,
    }));
    prodRows.push({
      Name: "",
      SKU: "",
      Category: "TOTAL UNITS",
      Stock: totalStock,
    });

    return [
      { sheetName: "Categories", rows: catRows },
      { sheetName: "Products", rows: prodRows },
    ];
  }, [summary, status, totalStock]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6 space-y-8">
      {/* HEADER + export (PDF / Excel match tables below) */}
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Stock Dashboard</h1>
          <p className="text-slate-500 text-sm mt-1">
            Real-time stock analytics and product inventory
          </p>
        </div>
        <ReportExportToolbar
          pdfTargetRef={exportRef}
          pdfFileSlug="Stock_Dashboard_Report"
          reportTitle="Stock & inventory dashboard"
          reportSubtitle={`Products: ${status.length} · Total units: ${totalStock} · Low stock: ${lowStockCount}`}
          getExcelSheets={getExcelSheets}
          disabled={loading}
          className="lg:justify-end"
        />
      </div>

      {/* SUMMARY CARDS — KPIs only, not part of tabular export */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <SummaryCard title="Total Products" value={status.length} />
        <SummaryCard title="Total Stock Quantity" value={totalStock} />
        <SummaryCard title="Low Stock Items" value={lowStockCount} danger />
      </div>

      {/* Export region: category + product tables (same data as on screen) */}
      <div ref={exportRef} className="space-y-8">
        <div className="rounded-2xl bg-slate-900 px-5 py-4 text-white shadow-lg border border-slate-700">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">BillStocks</p>
          <h2 className="text-lg font-black tracking-tight">Stock & inventory report</h2>
          <p className="text-xs text-slate-400 mt-1">Generated: {new Date().toLocaleString()}</p>
          <p className="text-sm font-semibold mt-2 text-slate-200">
            KPI snapshot — Products: {status.length} · Total units: {totalStock} · Low stock alerts:{" "}
            {lowStockCount}
          </p>
        </div>

        <div className="bg-white shadow-lg rounded-2xl p-6 border border-slate-200">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-slate-800">Category Overview</h2>
            <p className="text-sm text-slate-500">Category-wise total quantity</p>
          </div>

          {summaryRows.length ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-slate-200 rounded-xl overflow-hidden">
                <thead className="bg-slate-100 text-slate-700">
                  <tr>
                    <th className="px-4 py-3 text-left">Category</th>
                    <th className="px-4 py-3 text-left">Total Qty</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {summaryRows.map(([cat, qty]) => (
                    <tr key={cat} className="hover:bg-blue-50 transition-all duration-200">
                      <td className="px-4 py-3 font-medium">{cat}</td>
                      <td className="px-4 py-3">{qty}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <LoadingState loading={loading} emptyText="No summary data" />
          )}
        </div>

        <div className="bg-white shadow-lg rounded-2xl p-6 border border-slate-200">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-slate-800">Product Stock Status</h3>
            <p className="text-sm text-slate-500">Live stock levels with low-stock alerts</p>
          </div>

          {status.length ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-slate-200 rounded-xl overflow-hidden">
                <thead className="bg-slate-100 text-slate-700">
                  <tr>
                    <th className="px-4 py-3 text-left">Name</th>
                    <th className="px-4 py-3 text-left">SKU</th>
                    <th className="px-4 py-3 text-left">Category</th>
                    <th className="px-4 py-3 text-left">Stock</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {status.map((p) => (
                    <tr key={p._id} className="hover:bg-blue-50 transition-all duration-200">
                      <td className="px-4 py-3 font-medium">{p.name}</td>
                      <td className="px-4 py-3">{p.sku}</td>
                      <td className="px-4 py-3">{p.category || "-"}</td>
                      <td className="px-4 py-3">
                        {p.stock < 10 ? (
                          <span className="px-3 py-1 text-xs rounded-full bg-red-100 text-red-600 font-medium">
                            {p.stock}
                          </span>
                        ) : (
                          <span className="px-3 py-1 text-xs rounded-full bg-green-100 text-green-700 font-medium">
                            {p.stock}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <LoadingState loading={loading} emptyText="No products available" />
          )}
        </div>
      </div>
    </div>
  );
};

const SummaryCard = ({ title, value, danger }) => (
  <div
    className={`p-6 rounded-2xl shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-xl ${
      danger ? "bg-red-50 border border-red-200" : "bg-white border border-slate-200"
    }`}
  >
    <p className="text-sm text-slate-500">{title}</p>
    <p className={`text-2xl font-bold mt-2 ${danger ? "text-red-600" : "text-slate-900"}`}>{value}</p>
  </div>
);

const LoadingState = ({ loading, emptyText }) => (
  <div className="text-center py-6 text-slate-500">
    {loading ? (
      <div className="flex justify-center items-center gap-2">
        <div className="w-5 h-5 border-2 border-slate-300 border-t-blue-600 rounded-full animate-spin"></div>
        Loading...
      </div>
    ) : (
      emptyText
    )}
  </div>
);

export default StockDashboard;
