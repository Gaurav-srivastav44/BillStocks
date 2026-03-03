import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api";

export default function CompleteProfile() {
  const { user, updateUser, loading } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firmName: "",
    firmGst: "",
    firmAddress: "",
    firmPhone: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login", { replace: true });
      return;
    }
    if (user) {
      if (user.firmName) {
        navigate("/home", { replace: true });
        return;
      }
      setForm({
        firmName: user.firmName || "",
        firmGst: user.firmGst || "",
        firmAddress: user.firmAddress || "",
        firmPhone: user.firmPhone || "",
      });
    }
  }, [user, loading, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.firmName.trim()) return;
    setSaving(true);
    try {
      const res = await api.put("/auth/profile", form);
      updateUser(res.data.data);
      navigate("/home", { replace: true });
    } catch (err) {
      console.error("Failed to update profile", err);
    } finally {
      setSaving(false);
    }
  };

  if (loading || !user) {
    return <div className="p-6 text-center">Loading...</div>;
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden bg-gradient-to-br from-slate-50 via-pink-50 to-rose-50">

      {/* Dotted Pattern */}
      <div className="absolute inset-0 z-0 opacity-[0.06] pointer-events-none
        bg-[radial-gradient(circle_at_1px_1px,#ec4899_1px,transparent_0)]
        bg-[size:28px_28px]">
      </div>

      {/* Top Left Shape */}
      <div className="absolute -top-40 -left-40 w-[500px] h-[500px]
        bg-pink-400/30 blur-3xl rounded-full pointer-events-none">
      </div>

      {/* Bottom Right Shape */}
      <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px]
        bg-rose-400/30 blur-3xl rounded-full pointer-events-none">
      </div>

      {/* Card */}
      <div className="relative z-10 w-full max-w-lg bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl shadow-pink-100/40 border border-white/40 p-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">
          Complete your profile
        </h1>
        <p className="text-sm text-slate-500 mb-6">
          We just need your firm details so we can show them correctly on your invoices.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Firm / Business Name
            </label>
            <input
              name="firmName"
              value={form.firmName}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-200"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                GSTIN
              </label>
              <input
                name="firmGst"
                value={form.firmGst}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-200"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Phone
              </label>
              <input
                name="firmPhone"
                value={form.firmPhone}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-200"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Address (shown on invoice)
            </label>
            <textarea
              name="firmAddress"
              rows={3}
              value={form.firmAddress}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-200"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full py-2.5 rounded-lg bg-pink-600 text-white font-semibold text-sm hover:bg-pink-700 disabled:opacity-60 transition-all"
          >
            {saving ? "Saving..." : "Save & Continue"}
          </button>
        </form>
      </div>
    </div>
  );
}