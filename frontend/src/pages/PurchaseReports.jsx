import { useEffect, useState, useMemo } from "react";
import api from "../api";
import { Search, FileText, List, IndianRupee, Package } from "lucide-react"; // Optional: Lucide icons for flair

const PurchaseReports = () => {
  const [tab, setTab] = useState("billwise");
  const [billwise, setBillwise] = useState([]);
  const [detailed, setDetailed] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    setLoading(true);
    Promise.all([
      api.get("/reports/purchase/billwise"),
      api.get("/reports/purchase/detailed")
    ])
      .then(([bwRes, dtRes]) => {
        setBillwise(bwRes.data.data || []);
        setDetailed(dtRes.data.data || []);
      })
      .catch(err => console.error("Error fetching reports", err))
      .finally(() => setLoading(false));
  }, []);

  // Summary logic
  const totalSpend = useMemo(() => 
    billwise.reduce((acc, curr) => acc + (curr.grandTotal || 0), 0), 
  [billwise]);

  // Filtering logic
  const filteredData = tab === "billwise" 
    ? billwise.filter(b => b.purchaseNumber?.toLowerCase().includes(searchTerm.toLowerCase()) || b.supplier?.name?.toLowerCase().includes(searchTerm.toLowerCase()))
    : detailed.filter(d => d.item?.toLowerCase().includes(searchTerm.toLowerCase()) || d.purchaseNumber?.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="p-6 bg-gray-50 min-h-screen font-sans text-gray-900">
      {/* 1. Header & Stats Section */}
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Purchase Analytics</h1>
            <p className="text-gray-500 text-sm">Track and manage your procurement data</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-3">
              <div className="p-2 bg-blue-50 rounded-lg text-blue-600"><Package size={20} /></div>
              <div>
                <p className="text-xs text-gray-500 uppercase font-semibold">Orders</p>
                <p className="text-lg font-bold">{billwise.length}</p>
              </div>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-3">
              <div className="p-2 bg-green-50 rounded-lg text-green-600"><IndianRupee size={20} /></div>
              <div>
                <p className="text-xs text-gray-500 uppercase font-semibold">Total Spend</p>
                <p className="text-lg font-bold text-green-600">₹{totalSpend.toLocaleString('en-IN')}</p>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Controls Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white">
            {/* Tab Switcher */}
            <div className="flex bg-gray-100 p-1 rounded-xl w-full sm:w-auto">
              <button 
                onClick={() => setTab("billwise")}
                className={`flex-1 sm:flex-none flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-medium transition-all ${tab === "billwise" ? "bg-white shadow-sm text-blue-600" : "text-gray-500 hover:text-gray-700"}`}
              >
                <FileText size={16} /> Billwise
              </button>
              <button 
                onClick={() => setTab("detailed")}
                className={`flex-1 sm:flex-none flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-medium transition-all ${tab === "detailed" ? "bg-white shadow-sm text-blue-600" : "text-gray-500 hover:text-gray-700"}`}
              >
                <List size={16} /> Detailed
              </button>
            </div>

            {/* Search Bar */}
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text"
                placeholder="Search..."
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* 3. Table Section */}
          <div className="overflow-x-auto">
            {loading ? (
              <div className="py-20 flex flex-col items-center justify-center space-y-3">
                <div className="w-10 h-10 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
                <p className="text-gray-400 font-medium">Fetching records...</p>
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50 border-b border-gray-200">
                  {tab === "billwise" ? (
                    <tr>
                      <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Purchase No</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Supplier</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Total</th>
                    </tr>
                  ) : (
                    <tr>
                      <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Purchase #</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Item Details</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Qty</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Price</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Line Total</th>
                    </tr>
                  )}
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {filteredData.length > 0 ? (
                    filteredData.map((item, idx) => (
                      <tr key={item._id || idx} className="hover:bg-blue-50/30 transition-colors">
                        {tab === "billwise" ? (
                          <>
                            <td className="px-6 py-4 font-semibold text-blue-700">{item.purchaseNumber}</td>
                            <td className="px-6 py-4 text-gray-600">{item.supplier?.name || "N/A"}</td>
                            <td className="px-6 py-4 text-gray-500 text-sm">{new Date(item.createdAt).toLocaleDateString()}</td>
                            <td className="px-6 py-4 text-right font-bold text-gray-800">₹{item.grandTotal?.toFixed(2)}</td>
                          </>
                        ) : (
                          <>
                            <td className="px-6 py-4 text-sm text-gray-500">{item.purchaseNumber}</td>
                            <td className="px-6 py-4">
                              <span className="font-medium text-gray-800 block">{item.item}</span>
                              <span className="text-xs text-gray-400">{new Date(item.date).toLocaleDateString()}</span>
                            </td>
                            <td className="px-6 py-4 text-center">
                              <span className="px-2 py-1 bg-gray-100 rounded text-xs font-bold text-gray-600">{item.qty}</span>
                            </td>
                            <td className="px-6 py-4 text-gray-600">₹{item.price}</td>
                            <td className="px-6 py-4 text-right font-bold text-gray-800">₹{item.lineTotal?.toFixed(2)}</td>
                          </>
                        )}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="px-6 py-12 text-center text-gray-400 italic">No matching records found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchaseReports;