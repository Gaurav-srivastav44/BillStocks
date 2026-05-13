import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import api from "../api";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { Calendar, ChevronLeft, ChevronRight, FileText, List, TrendingUp, DollarSign, User } from "lucide-react";
import ReportExportToolbar from "../components/ReportExportToolbar";

const SalesReports = () => {
  const salesExportRef = useRef(null);
  const [tab, setTab] = useState("billwise");
  const [billwise, setBillwise] = useState([]);
  const [detailed, setDetailed] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(null);
  const [activeMonthOffset, setActiveMonthOffset] = useState(0);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [billRes, detailRes] = await Promise.all([
          api.get("/reports/sales/billwise"),
          api.get("/reports/sales/detailed"),
        ]);
        setBillwise(billRes.data.data || []);
        setDetailed(detailRes.data.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const today = new Date();
  const baseDate = new Date(today.getFullYear(), today.getMonth() - activeMonthOffset, 1);
  const activeYear = baseDate.getFullYear();
  const activeMonth = baseDate.getMonth();

  const filteredMonthBills = useMemo(() => {
    return billwise.filter((b) => {
      const d = new Date(b.createdAt);
      return d.getFullYear() === activeYear && d.getMonth() === activeMonth;
    });
  }, [billwise, activeYear, activeMonth]);

  const dayWise = useMemo(() => {
    const map = {};
    filteredMonthBills.forEach((b) => {
      const d = new Date(b.createdAt).toLocaleDateString();
      map[d] = (map[d] || 0) + (b.grandTotal || 0);
    });
    return map;
  }, [filteredMonthBills]);

  const monthlyData = useMemo(() => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const map = {};
    billwise.forEach((b) => {
      const d = new Date(b.createdAt);
      const key = `${months[d.getMonth()]} ${d.getFullYear()}`;
      map[key] = (map[key] || 0) + (b.grandTotal || 0);
    });
    return Object.entries(map).map(([month, total]) => ({ month, total }));
  }, [billwise]);

  const selectedDayInvoices = useMemo(() => {
    if (!selectedDate) return [];
    return filteredMonthBills.filter(
      (b) => new Date(b.createdAt).toLocaleDateString() === selectedDate
    );
  }, [selectedDate, filteredMonthBills]);

  const totalMonthSales = filteredMonthBills.reduce((sum, b) => sum + (b.grandTotal || 0), 0);

  const reportPeriodLabel = new Date(activeYear, activeMonth, 1).toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  const pdfFileSlug = `Sales_Report_${activeYear}_${String(activeMonth + 1).padStart(2, "0")}`;

  const getExcelSheets = useCallback(() => {
    if (tab === "billwise") {
      const rows = filteredMonthBills.map((b) => ({
        Invoice: b.invoiceNumber,
        Customer: b.customerName || b.customer?.name || "Cash Sale",
        Date: new Date(b.createdAt).toLocaleDateString(),
        Total_INR: b.grandTotal ?? 0,
      }));
      rows.push({
        Invoice: "",
        Customer: "",
        Date: "MONTH TOTAL",
        Total_INR: totalMonthSales,
      });
      return [{ sheetName: "Sales_Data", rows }];
    }
    const rows = detailed.map((row) => ({
      Invoice: row.invoiceNumber,
      Item: row.item,
      Qty: row.qty,
      LineTotal_INR: row.lineTotal ?? 0,
    }));
    return [{ sheetName: "Sales_Detailed", rows }];
  }, [tab, filteredMonthBills, detailed, totalMonthSales]);

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 text-slate-800">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Sales Analytics</h1>
          <p className="text-slate-500">Track your business growth and daily performance</p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <ReportExportToolbar
            pdfTargetRef={salesExportRef}
            pdfFileSlug={pdfFileSlug}
            reportTitle="Sales report"
            reportSubtitle={`${reportPeriodLabel} · Tab: ${tab === "billwise" ? "Billwise" : "Detailed"}`}
            getExcelSheets={getExcelSheets}
            disabled={loading}
          />
          <div className="bg-white px-4 py-2 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-3">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><DollarSign size={20}/></div>
            <div>
              <p className="text-xs text-slate-500 uppercase font-bold">Monthly Revenue</p>
              <p className="text-xl font-bold text-slate-900">₹{totalMonthSales.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
        <div className="lg:col-span-4 bg-white shadow-sm rounded-3xl p-6 border border-slate-200">
          <div className="flex items-center gap-2 mb-6 text-blue-600">
            <Calendar size={18} />
            <h3 className="font-bold">Sales Calendar</h3>
          </div>
          <CalendarView
            dayWise={dayWise}
            onSelectDate={setSelectedDate}
            selectedDate={selectedDate}
            activeMonthOffset={activeMonthOffset}
            setActiveMonthOffset={setActiveMonthOffset}
          />
        </div>

        <div className="lg:col-span-8 bg-white shadow-sm rounded-3xl p-6 border border-slate-200">
          <div className="flex items-center gap-2 mb-6 text-slate-900">
            <TrendingUp size={18} />
            <h3 className="font-bold">Revenue Trend</h3>
          </div>
          <div className="h-[300px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}}
                />
                {/* Graph Bar changed to Black */}
                <Bar dataKey="total" fill="#000000" radius={[6, 6, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {selectedDate && (
        <div className="bg-white shadow-sm rounded-3xl p-6 border border-slate-200 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold">Transactions: {selectedDate}</h3>
            <button onClick={() => setSelectedDate(null)} className="text-slate-400 hover:text-slate-600 text-sm font-medium">Clear Selection</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-slate-400 text-xs uppercase tracking-wider border-b border-slate-100">
                  <th className="pb-3 px-2">Invoice Number</th>
                  <th className="pb-3 px-2">Customer</th>
                  <th className="pb-3 px-2">Amount</th>
                  <th className="pb-3 px-2 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {selectedDayInvoices.map((i) => (
                  <tr key={i._id} className="hover:bg-slate-50 transition-colors group">
                    <td className="py-4 px-2 font-medium text-slate-900">{i.invoiceNumber}</td>
                    <td className="py-4 px-2 text-slate-600">{i.customerName || i.customer?.name || "Cash Sale"}</td>
                    <td className="py-4 px-2 font-bold text-blue-600">₹{i.grandTotal?.toFixed(2)}</td>
                    <td className="py-4 px-2 text-right">
                      <button className="text-xs bg-slate-100 text-slate-600 px-3 py-1 rounded-full group-hover:bg-black group-hover:text-white transition">View Bill</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Bottom Section Table — ref wraps PDF/Excel export region (matches visible tab + month filter) */}
      <div
        ref={salesExportRef}
        className="bg-white shadow-sm rounded-3xl border border-slate-200 overflow-hidden"
      >
        <div className="px-6 pt-6 pb-2 border-b border-slate-100 bg-slate-900 text-white rounded-t-3xl">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">BillStocks</p>
          <h2 className="text-lg font-black tracking-tight">Sales report</h2>
          <p className="text-sm text-slate-300 mt-1">Period: {reportPeriodLabel}</p>
          <p className="text-xs text-slate-400 mt-1">Generated: {new Date().toLocaleString()}</p>
          <p className="text-sm font-bold mt-2 border-t border-slate-700 pt-2">
            Month total: ₹{totalMonthSales.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>
        <div className="p-6 border-b border-slate-100 flex flex-wrap gap-4 items-center justify-between bg-slate-50/50">
          <div className="flex bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
            <button
              onClick={() => setTab("billwise")}
              className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-bold transition ${
                tab === "billwise" ? "bg-black text-white shadow-md" : "text-slate-500 hover:bg-slate-50"
              }`}
            >
              <FileText size={16} /> Billwise
            </button>
            <button
              onClick={() => setTab("detailed")}
              className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-bold transition ${
                tab === "detailed" ? "bg-black text-white shadow-md" : "text-slate-500 hover:bg-slate-50"
              }`}
            >
              <List size={16} /> Detailed
            </button>
          </div>
        </div>

        <div className="overflow-x-auto p-2">
          {loading ? (
            <div className="py-20 text-center text-slate-400 font-medium">Loading report data...</div>
          ) : (
            <table className="w-full text-left">
              <thead className="text-slate-400 text-[11px] uppercase tracking-widest font-bold">
                <tr>
                  <th className="px-6 py-4">Invoice</th>
                  <th className="px-6 py-4">Customer</th> {/* Added Customer Header */}
                  {tab === "billwise" ? (
                    <>
                      <th className="px-6 py-4">Billing Date</th>
                      <th className="px-6 py-4 text-right">Total Amount</th>
                    </>
                  ) : (
                    <>
                      <th className="px-6 py-4">Item Name</th>
                      <th className="px-6 py-4">Quantity</th>
                      <th className="px-6 py-4 text-right">Line Total</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {(tab === "billwise" ? filteredMonthBills : detailed).map((row, idx) => (
                  <tr key={row._id || idx} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-semibold text-slate-900">{row.invoiceNumber}</td>
                    {/* Added Customer Name Cell */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <User size={14} className="text-slate-400" />
                        <span className="text-slate-700">{row.customerName || row.customer?.name || "Cash Sale"}</span>
                      </div>
                    </td>
                    {tab === "billwise" ? (
                      <>
                        <td className="px-6 py-4 text-slate-500">{new Date(row.createdAt).toLocaleDateString()}</td>
                        <td className="px-6 py-4 text-right font-bold text-slate-900">₹{row.grandTotal?.toFixed(2)}</td>
                      </>
                    ) : (
                      <>
                        <td className="px-6 py-4 text-slate-700">{row.item}</td>
                        <td className="px-6 py-4"><span className="bg-slate-100 px-2 py-1 rounded text-xs font-bold">{row.qty}</span></td>
                        <td className="px-6 py-4 text-right font-bold text-slate-900">₹{row.lineTotal?.toFixed(2)}</td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

const CalendarView = ({ dayWise, onSelectDate, selectedDate, activeMonthOffset, setActiveMonthOffset }) => {
  const today = new Date();
  const base = new Date(today.getFullYear(), today.getMonth() - activeMonthOffset, 1);
  const year = base.getFullYear();
  const month = base.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  
  const days = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let d = 1; d <= daysInMonth; d++) days.push(d);

  const monthName = base.toLocaleString("default", { month: "long", year: "numeric" });

  return (
    <div className="select-none">
      <div className="flex justify-between items-center mb-6">
        <h4 className="text-sm font-bold text-slate-900">{monthName}</h4>
        <div className="flex gap-1">
          <button 
            disabled={activeMonthOffset === 11}
            onClick={() => setActiveMonthOffset(p => p + 1)} 
            className="p-1.5 hover:bg-slate-100 rounded-lg disabled:opacity-30 transition"
          >
            <ChevronLeft size={18}/>
          </button>
          <button 
            disabled={activeMonthOffset === 0}
            onClick={() => setActiveMonthOffset(p => p - 1)} 
            className="p-1.5 hover:bg-slate-100 rounded-lg disabled:opacity-30 transition"
          >
            <ChevronRight size={18}/>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2 mb-2">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div key={d} className="text-center text-[10px] font-black text-slate-400 uppercase tracking-tighter">{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {days.map((d, i) => {
          if (!d) return <div key={i}></div>;
          const dateStr = new Date(year, month, d).toLocaleDateString();
          const sale = dayWise[dateStr] || 0;
          const isSelected = selectedDate === dateStr;

          return (
            <button
              key={i}
              onClick={() => onSelectDate(dateStr)}
              className={`relative aspect-square rounded-xl flex flex-col items-center justify-center transition-all border ${
                isSelected 
                ? "bg-black border-black text-white shadow-md scale-105 z-10" 
                : "bg-white border-slate-100 hover:border-black hover:shadow-sm"
              }`}
            >
              <span className={`text-xs font-bold ${isSelected ? "text-white" : "text-slate-700"}`}>{d}</span>
              {sale > 0 && (
                <span className={`text-[8px] mt-1 font-medium truncate w-full px-1 ${isSelected ? "text-slate-300" : "text-slate-500"}`}>
                  ₹{sale >= 1000 ? (sale/1000).toFixed(1)+'k' : sale.toFixed(0)}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default SalesReports;