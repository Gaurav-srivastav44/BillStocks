import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api";

export default function Profile() {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    firmName: user?.firmName || "",
    firmGst: user?.firmGst || "",
    firmAddress: user?.firmAddress || "",
    firmPhone: user?.firmPhone || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!form.firmName.trim()) return;
    try {
      setSaving(true);
      const res = await api.put("/auth/profile", form);
      updateUser(res.data.data);
      setEditing(false);
    } catch (err) {
      console.error("Failed to update profile", err);
    } finally {
      setSaving(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden">
      
      {/* --- COMPLEX BACKGROUND SHAPES & PATTERNS --- */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Primary Mesh Pattern */}
        <div 
          className="absolute inset-0 opacity-[0.04]" 
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%232563eb' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }} 
        />
        
        {/* Soft Color Blobs (Top Right) */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-400/20 rounded-full blur-[100px]" />
        
        {/* Soft Color Blobs (Bottom Left) */}
        <div className="absolute -bottom-24 -left-24 w-[500px] h-[500px] bg-indigo-400/10 rounded-full blur-[120px]" />

        {/* Floating Geometric Accents */}
        <div className="absolute top-[20%] left-[10%] w-12 h-12 border-4 border-blue-500/10 rounded-2xl rotate-12 animate-pulse" />
        <div className="absolute top-[60%] right-[12%] w-16 h-16 border-4 border-indigo-500/10 rounded-full" />
        <div className="absolute bottom-[15%] left-[20%] w-8 h-8 bg-blue-500/5 rotate-45" />
        
        {/* Dot Matrix Pattern Overlay */}
        <div 
          className="absolute inset-0 opacity-[0.1]" 
          style={{ backgroundImage: `radial-gradient(#2563eb 0.5px, transparent 0.5px)`, backgroundSize: '24px 24px' }} 
        />
      </div>

      {/* NAVBAR */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-white/70 backdrop-blur-xl border-b border-slate-200/60 shadow-sm flex items-center justify-between px-8 z-50">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/home")}>
          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-lg flex items-center justify-center shadow-lg shadow-blue-200">
            <span className="text-white font-bold">B</span>
          </div>
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
            BillStocks
          </h1>
        </div>

        <button
          onClick={() => navigate("/home")}
          className="text-sm font-semibold text-slate-500 hover:text-blue-600 transition-colors flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-white"
        >
          <span>←</span> Back to Dashboard
        </button>
      </header>

      {/* PROFILE CONTENT */}
      <main className="relative z-10 pt-28 pb-12 px-6 flex justify-center">
        <div className="w-full max-w-2xl">
          <div className="bg-white/90 backdrop-blur-sm rounded-[2.5rem] shadow-2xl shadow-blue-900/5 border border-white/60 overflow-hidden">
            
            {/* Header / Avatar Section */}
            <div className="bg-gradient-to-br from-blue-50/80 to-indigo-50/80 px-8 py-12 border-b border-slate-100 flex flex-col items-center relative overflow-hidden">
                {/* Inner shape decoration */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/40 rounded-full -mr-16 -mt-16 blur-2xl" />
              
              <div className="relative">
                <div className="w-32 h-32 rounded-[2rem] bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center text-5xl font-black shadow-xl transform -rotate-3 border-4 border-white">
                  {user.name?.charAt(0).toUpperCase() || "U"}
                </div>
                <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-green-500 border-4 border-white rounded-full shadow-md"></div>
              </div>

              <h2 className="mt-8 text-3xl font-black text-slate-900 tracking-tight">
                {user.name || "User"}
              </h2>
              <p className="text-slate-500 font-semibold text-lg">{user.email}</p>
              
              <div className="mt-5 flex gap-2">
                <span className="px-4 py-1.5 bg-blue-600 text-white rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-blue-100">
                  {user.role || "User"}
                </span>
              </div>
            </div>

            <div className="p-10">
              {/* Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                <div className="p-6 bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Account Status</p>
                  <p className="text-green-600 font-extrabold flex items-center gap-3 text-lg">
                    <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                    </span> 
                    Verified Active
                  </p>
                </div>
                <div className="p-6 bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Member Since</p>
                  <p className="text-slate-700 font-extrabold text-lg">
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : "N/A"}
                  </p>
                </div>
              </div>

              {/* Firm Section */}
              <div className="bg-slate-50/50 rounded-[2rem] border border-slate-200/60 p-8 relative">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-xl font-black text-slate-800 tracking-tight">Firm Details</h3>
                  {!editing && (
                    <button
                      type="button"
                      onClick={() => setEditing(true)}
                      className="px-5 py-2 bg-white text-blue-600 text-[10px] font-black rounded-xl border border-blue-100 hover:bg-blue-600 hover:text-white transition-all uppercase tracking-widest"
                    >
                      Update
                    </button>
                  )}
                </div>

                {editing ? (
                  <div className="grid grid-cols-1 gap-5">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-500 ml-1 tracking-widest uppercase">Firm Name</label>
                      <input name="firmName" value={form.firmName} onChange={handleChange} className="w-full rounded-2xl border-2 border-slate-100 bg-white px-5 py-4 text-sm font-semibold focus:ring-0 focus:border-blue-500 transition-all outline-none" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-1">
                          <label className="text-[10px] font-black text-slate-500 ml-1 tracking-widest uppercase">GSTIN</label>
                          <input name="firmGst" value={form.firmGst} onChange={handleChange} className="w-full rounded-2xl border-2 border-slate-100 bg-white px-5 py-4 text-sm font-semibold focus:ring-0 focus:border-blue-500 transition-all outline-none" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-black text-slate-500 ml-1 tracking-widest uppercase">Phone</label>
                          <input name="firmPhone" value={form.firmPhone} onChange={handleChange} className="w-full rounded-2xl border-2 border-slate-100 bg-white px-5 py-4 text-sm font-semibold focus:ring-0 focus:border-blue-500 transition-all outline-none" />
                        </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-500 ml-1 tracking-widest uppercase">Office Address</label>
                      <textarea name="firmAddress" rows={3} value={form.firmAddress} onChange={handleChange} className="w-full rounded-2xl border-2 border-slate-100 bg-white px-5 py-4 text-sm font-semibold focus:ring-0 focus:border-blue-500 transition-all outline-none resize-none" />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="flex items-center gap-5">
                        <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-2xl flex-shrink-0">🏢</div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Registered Name</p>
                            <p className="text-slate-800 font-bold text-lg">{user.firmName || "Not set"}</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex items-center gap-5">
                            <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-2xl flex-shrink-0">📄</div>
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">GSTIN Number</p>
                                <p className="text-slate-800 font-bold">{user.firmGst || "—"}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-5">
                            <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-2xl flex-shrink-0">📞</div>
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Contact Number</p>
                                <p className="text-slate-800 font-bold">{user.firmPhone || "—"}</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-start gap-5">
                        <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-2xl flex-shrink-0">📍</div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Registered Office</p>
                            <p className="text-slate-800 font-bold leading-relaxed">{user.firmAddress || "—"}</p>
                        </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="mt-12 space-y-4">
                {editing ? (
                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={handleSave}
                      disabled={saving}
                      className="flex-1 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-blue-400 disabled:to-indigo-400 text-white font-black rounded-2xl shadow-xl shadow-blue-200 transition-all transform active:scale-[0.98] uppercase tracking-widest text-xs"
                    >
                      {saving ? "Processing..." : "Save Profile"}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setEditing(false);
                        setForm({
                          firmName: user.firmName || "",
                          firmGst: user.firmGst || "",
                          firmAddress: user.firmAddress || "",
                          firmPhone: user.firmPhone || "",
                        });
                      }}
                      className="px-8 py-4 bg-slate-100 hover:bg-slate-200 text-slate-600 font-black rounded-2xl transition-all uppercase tracking-widest text-xs"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-4">
                    <button
                      onClick={() => navigate("/home")}
                      className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white font-black rounded-2xl shadow-xl shadow-slate-300 transition-all transform active:scale-[0.98] uppercase tracking-[0.2em] text-xs"
                    >
                      Dashboard Access
                    </button>

                    <button
                      onClick={() => {
                        logout();
                        navigate("/login");
                      }}
                      className="w-full py-4 bg-white border-2 border-red-50 text-red-500 font-black rounded-2xl hover:bg-red-50 hover:border-red-100 transition-all uppercase tracking-[0.2em] text-xs"
                    >
                      Terminate Session
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <p className="text-center mt-10 text-slate-400 text-[10px] font-black uppercase tracking-[0.4em]">
            Authentication & Security Protocol Layer
          </p>
        </div>
      </main>
    </div>
  );
}