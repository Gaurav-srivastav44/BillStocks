import { useEffect, useMemo, useState } from "react";
import api from "../api";

const StockDashboard = () => {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6 space-y-8">

      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Stock Dashboard</h1>
        <p className="text-slate-500 text-sm mt-1">
          Real-time stock analytics and product inventory
        </p>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <SummaryCard title="Total Products" value={status.length} />
        <SummaryCard title="Total Stock Quantity" value={totalStock} />
        <SummaryCard title="Low Stock Items" value={lowStockCount} danger />
      </div>

      {/* CATEGORY SUMMARY */}
      <div className="bg-white shadow-lg rounded-2xl p-6 border border-slate-200">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-slate-800">
            Category Overview
          </h2>
          <p className="text-sm text-slate-500">
            Category-wise total quantity
          </p>
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
                  <tr
                    key={cat}
                    className="hover:bg-blue-50 transition-all duration-200"
                  >
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

      {/* PRODUCT TABLE */}
      <div className="bg-white shadow-lg rounded-2xl p-6 border border-slate-200">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-slate-800">
            Product Stock Status
          </h3>
          <p className="text-sm text-slate-500">
            Live stock levels with low-stock alerts
          </p>
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
                  <tr
                    key={p._id}
                    className="hover:bg-blue-50 transition-all duration-200"
                  >
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
  );
};

/* SUMMARY CARD */
const SummaryCard = ({ title, value, danger }) => (
  <div
    className={`p-6 rounded-2xl shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-xl ${
      danger
        ? "bg-red-50 border border-red-200"
        : "bg-white border border-slate-200"
    }`}
  >
    <p className="text-sm text-slate-500">{title}</p>
    <p
      className={`text-2xl font-bold mt-2 ${
        danger ? "text-red-600" : "text-slate-900"
      }`}
    >
      {value}
    </p>
  </div>
);

/* LOADING STATE */
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