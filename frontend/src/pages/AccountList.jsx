import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";

const AccountList = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      setLoading(true);
      const res = await api.get("/accounts");
      setSuppliers(res.data.data || []);
    } catch (err) {
      console.error("Failed to load suppliers", err);
      setSuppliers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    let data = [...suppliers];

    if (search.trim()) {
      const q = search.toLowerCase();
      data = data.filter((s) =>
        (s.name || "").toLowerCase().includes(q)
      );
    }

    if (sortBy === "name") {
      data.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
    } else if (sortBy === "balance") {
      data.sort(
        (a, b) =>
          (b.balance ?? b.openingBalance ?? 0) -
          (a.balance ?? a.openingBalance ?? 0)
      );
    }

    return data;
  }, [suppliers, search, sortBy]);

  const totalSuppliers = suppliers.length;

  return (
    <div className="min-h-screen bg-slate-50 p-6 space-y-8">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Supplier Master</h1>
          <p className="text-slate-500 text-sm mt-1">
            Manage all your suppliers in one place
          </p>
        </div>

        <Link
          to="/accounts/new"
          className="px-5 py-2.5 bg-blue-600 text-white rounded-xl shadow hover:bg-blue-700 transition"
        >
          + Add Supplier
        </Link>
      </div>

      {/* SUMMARY */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <SummaryCard title="Total Suppliers" value={totalSuppliers} />
      </div>

      {/* FILTER + TABLE CARD */}
      <div className="bg-white shadow-sm rounded-2xl p-6 border border-slate-200 space-y-4">
        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search suppliers..."
            className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none"
          />

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 text-sm"
          >
            <option value="name">Sort by Name</option>
            <option value="balance">Sort by Balance</option>
          </select>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-slate-200 rounded-xl overflow-hidden">
            <thead className="bg-slate-100 text-slate-700">
              <tr>
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left">Balance</th>
                <th className="px-4 py-3 text-left">City</th>
                <th className="px-4 py-3 text-left">Contact</th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {loading ? (
                <tr>
                  <td colSpan={5} className="text-center py-6 text-slate-500">
                    Loading suppliers...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-6 text-slate-500">
                    No suppliers found
                  </td>
                </tr>
              ) : (
                filtered.map((sup) => {
                  const balance = sup.balance ?? sup.openingBalance ?? 0;
                  let balanceClass =
                    "px-3 py-1 text-xs rounded-full font-medium bg-slate-100 text-slate-700";
                  if (balance < 0) {
                    balanceClass =
                      "px-3 py-1 text-xs rounded-full font-medium bg-red-100 text-red-700";
                  } else if (balance === 0) {
                    balanceClass =
                      "px-3 py-1 text-xs rounded-full font-medium bg-green-100 text-green-700";
                  }

                  return (
                    <tr
                      key={sup._id}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      <td className="px-4 py-3 font-medium text-slate-900">
                        {sup.name}
                      </td>
                      <td className="px-4 py-3">
                        <span className={balanceClass}>
                          ₹ {Math.abs(balance).toFixed(2)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {sup?.address?.city || "-"}
                      </td>
                      <td className="px-4 py-3">
                        {sup?.contacts?.mobile ||
                          sup?.contacts?.phone ||
                          "-"}
                      </td>
                      <td className="px-4 py-3">
                        <Link
                          to={`/accounts/${sup._id}/edit`}
                          className="inline-flex items-center px-3 py-1.5 text-xs rounded-md border border-slate-300 text-slate-700 hover:bg-slate-50"
                        >
                          Edit
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const SummaryCard = ({ title, value }) => (
  <div className="p-5 rounded-2xl bg-white shadow-sm border border-slate-200">
    <p className="text-xs text-slate-500">{title}</p>
    <p className="text-2xl font-bold mt-2 text-slate-900">{value}</p>
  </div>
);

export default AccountList;