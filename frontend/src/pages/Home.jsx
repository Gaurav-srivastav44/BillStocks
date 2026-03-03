import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../api";

const menuItems = [
  { label: "Dashboard", path: "/home", icon: "📊" },
  { label: "Accounts", path: "/accounts", icon: "👥" },
  { label: "Stock", path: "/stock", icon: "📦" },
  { label: "Products", path: "/products", icon: "🏷️" },
  { label: "Purchase", path: "/purchase", icon: "🛒" },
  { label: "Billing", path: "/billing", icon: "🧾" },
  { label: "Sales Reports", path: "/reports/sales", icon: "📈" },
];

export default function Home() {
  const navigate = useNavigate();
  const location = useLocation();

  const [summary, setSummary] = useState({});
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      try {
        console.log("Fetching home data...");
        const [summaryRes, productsRes] = await Promise.all([
          api.get("/stats/summary").catch((err) => {
            console.error("Stats API error:", err.message);
            return { data: { data: {} } };
          }),
          api.get("/products").catch((err) => {
            console.error("Products API error:", err.message);
            return { data: { data: { products: [] } } };
          })
        ]);

        if (!mounted) return;
        
        console.log("Summary response:", summaryRes);
        console.log("Products response:", productsRes);
        
        // Handle different response structures
        const summaryData = summaryRes?.data?.data || summaryRes?.data || {};
        const productsData = productsRes?.data?.data?.products || 
                            productsRes?.data?.data || 
                            productsRes?.data || 
                            [];
        
        setSummary(summaryData);
        setProducts(Array.isArray(productsData) ? productsData : []);
      } catch (err) {
        console.error("Failed loading home data", err);
        setSummary({});
        setProducts([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, []);

  const filteredProducts = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return products;
    return products.filter((p) => {
      const name = (p.name || "").toLowerCase();
      const sku = (p.sku || "").toLowerCase();
      return name.includes(q) || sku.includes(q);
    });
  }, [products, search]);

  const goToEdit = (id) => navigate(`/products/${id}/edit`);

  const formatPrice = (val) => {
    if (val == null) return "-";
    return `₹ ${Number(val).toFixed(2)}`;
  };

  return (
    <div className="min-h-screen w-full flex bg-slate-50">
      {/* SIDEBAR */}
      <Sidebar activePath={location.pathname} onNavigate={(p) => navigate(p)} />

      {/* MAIN CONTENT */}
      <div className="flex-1 min-h-screen flex flex-col lg:pl-64">
        <main className="px-4 sm:px-6 lg:px-8 py-8 space-y-6">
          {/* PAGE HEADER */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Inventory Management</h1>
              <p className="text-slate-500 text-sm mt-1">Monitor stock, products, and daily invoices</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => navigate("/billing")}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg shadow transition"
              >
                + New Invoice
              </button>
            </div>
          </div>

          {/* STATS CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard title="Total Products" value={summary.totalProducts || 0} icon="📦" color="blue" />
            <StatCard title="Total Sales" value={`₹${(summary.totalSales || 0).toLocaleString()}`} icon="💰" color="green" />
            <StatCard title="Low Stock Items" value={summary.lowStock || 0} icon="⚠️" color="orange" />
            <StatCard title="Today's Invoices" value={summary.todayInvoices || 0} icon="🧾" color="purple" />
          </div>

          {/* GRID LAYOUT */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* PRODUCT TABLE */}
            <div className="xl:col-span-2 bg-white shadow-sm rounded-xl p-5 border border-slate-200">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">All Products</h3>
                  <p className="text-sm text-slate-500">Search, view, and edit products</p>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search name or SKU"
                    className="px-3 py-2 flex-1 sm:w-64 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent"
                  />
                  <button
                    onClick={() => navigate("/products/new")}
                    className="px-4 py-2 text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow transition whitespace-nowrap"
                  >
                    + New
                  </button>
                </div>
              </div>

              <Table
                headers={["Name", "SKU", "Category", "Price", "Stock", "Action"]}
                rows={filteredProducts.map((p) => ({
                  key: p._id || `${p.name}-${p.sku}-${Math.random().toString(36).slice(2, 7)}`,
                  cols: [
                    p.name || "-",
                    p.sku || "-",
                    p.category || "-",
                    formatPrice(p.price),
                    p.stock == null ? (
                      "-"
                    ) : p.stock < 10 ? (
                      <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-600 font-medium">{p.stock}</span>
                    ) : (
                      <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-600 font-medium">{p.stock}</span>
                    ),
                    <button
                      onClick={() => goToEdit(p._id)}
                      className="px-3 py-1 text-sm rounded-md border border-slate-300 hover:bg-slate-50 transition"
                    >
                      Edit
                    </button>,
                  ],
                }))}
                loading={loading}
                emptyMessage="No products found"
              />
            </div>

            {/* RIGHT SIDE — CALENDAR */}
            <div className="bg-white shadow-sm rounded-xl p-5 border border-slate-200">
              <CalendarFull onDateClick={(date) => navigate(`/invoices?date=${date}`)} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

/* STAT CARD COMPONENT */
const StatCard = ({ title, value, icon, color }) => {
  const colorClasses = {
    blue: "bg-blue-50 border-blue-200 text-blue-600",
    green: "bg-green-50 border-green-200 text-green-600",
    orange: "bg-orange-50 border-orange-200 text-orange-600",
    purple: "bg-purple-50 border-purple-200 text-purple-600",
  };

  return (
    <div className={`p-4 rounded-xl border ${colorClasses[color]} bg-opacity-50`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-600">{title}</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{value}</p>
        </div>
        <div className="text-3xl">{icon}</div>
      </div>
    </div>
  );
};

/* SIDEBAR */
const Sidebar = ({ activePath, onNavigate }) => {
  const isActive = (path) => {
    if (path === "/home") {
      return activePath === "/home" || activePath === "/dashboard";
    }
    return activePath?.startsWith(path);
  };

  return (
    <aside className="hidden lg:block fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-white border-r border-slate-200 shadow-sm overflow-y-auto z-40">
      <nav className="px-3 py-4 space-y-1">
        {menuItems.map((item) => {
          const active = isActive(item.path);
          return (
            <button
              key={item.path}
              onClick={() => onNavigate(item.path)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                active ? "bg-blue-600 text-white shadow" : "text-slate-700 hover:bg-slate-50"
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              {item.label}
            </button>
          );
        })}
      </nav>
    </aside>
  );
};

/* FULL CALENDAR COMPONENT */
const CalendarFull = ({ onDateClick }) => {
  const today = new Date();
  const [month, setMonth] = useState(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());

  const monthName = new Date(year, month).toLocaleString("default", { month: "long" });
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const weeks = [];
  let day = 1 - firstDay;

  while (day <= daysInMonth) {
    const week = [];
    for (let i = 0; i < 7; i++) {
      week.push(day > 0 && day <= daysInMonth ? day : null);
      day++;
    }
    weeks.push(week);
  }

  const formatDate = (d) => `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

  const prevMonth = () => {
    if (month === 0) {
      setMonth(11);
      setYear((y) => y - 1);
    } else {
      setMonth((m) => m - 1);
    }
  };

  const nextMonth = () => {
    if (month === 11) {
      setMonth(0);
      setYear((y) => y + 1);
    } else {
      setMonth((m) => m + 1);
    }
  };

  return (
    <div>
      {/* Calendar Header */}
      <div className="flex justify-between items-center mb-4">
        <button onClick={prevMonth} className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition">
          ←
        </button>

        <h3 className="text-lg font-semibold text-slate-900">
          {monthName} {year}
        </h3>

        <button onClick={nextMonth} className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition">
          →
        </button>
      </div>

      {/* Days Header */}
      <div className="grid grid-cols-7 text-center text-xs font-semibold text-slate-600 mb-2">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1 text-center">
        {weeks.map((week, i) =>
          week.map((d, j) =>
            d ? (
              <button
                key={`${i}-${j}`}
                onClick={() => onDateClick(formatDate(d))}
                className={`p-2 hover:bg-blue-100 rounded-lg text-sm transition ${
                  year === today.getFullYear() && month === today.getMonth() && d === today.getDate()
                    ? "bg-blue-50 border border-blue-200 text-blue-600 font-semibold"
                    : "bg-slate-50 border border-slate-100"
                }`}
              >
                {d}
              </button>
            ) : (
              <div key={`${i}-${j}`} className="p-2" />
            )
          )
        )}
      </div>
    </div>
  );
};

/* TABLE */
const Table = ({ headers, rows, loading, emptyMessage }) => (
  <div className="border border-slate-200 rounded-xl overflow-hidden">
    <div className="overflow-auto">
      <table className="min-w-full text-sm">
        <thead className="bg-slate-50 text-slate-700">
          <tr>
            {headers.map((h) => (
              <th key={h} className="px-3 py-2.5 text-left font-semibold border-b border-slate-200">
                {h}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-200">
          {loading ? (
            <tr>
              <td colSpan={headers.length} className="p-4 text-slate-500 text-center">
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-slate-300 border-t-blue-600 rounded-full animate-spin"></div>
                  Loading...
                </div>
              </td>
            </tr>
          ) : rows && rows.length ? (
            rows.map((row) => (
              <tr key={row.key} className="hover:bg-slate-50 transition">
                {row.cols.map((col, i) => (
                  <td key={i} className="px-3 py-2.5 align-middle">
                    {col}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={headers.length} className="p-4 text-slate-500 text-center">
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </div>
);
