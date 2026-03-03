import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

const baseForm = {
  name: "",
  openingBalance: 0,
  startDate: "",
  endDate: "",
  address: { street: "", city: "", state: "", pin: "" },
  contacts: { phone: "", mobile: "", email: "" },
  gstin: "",
  remarks: "",
  creditLimit: 0,
};

const AddAccount = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState(baseForm);
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("address.")) {
      const key = name.split(".")[1];
      setForm((f) => ({ ...f, address: { ...f.address, [key]: value } }));
    } else if (name.startsWith("contacts.")) {
      const key = name.split(".")[1];
      setForm((f) => ({ ...f, contacts: { ...f.contacts, [key]: value } }));
    } else {
      setForm((f) => ({ ...f, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      await api.post("/accounts", {
        ...form,
        openingBalance: Number(form.openingBalance) || 0,
        creditLimit: Number(form.creditLimit) || 0,
      });
      navigate("/accounts");
    } catch (err) {
      console.error("Failed to save account", err);
    } finally {
      setSaving(false);
    }
  };

  const Input = ({ label, required, ...props }) => (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-slate-600">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        {...props}
        className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-200"
      />
    </div>
  );

  const Section = ({ title, children }) => (
    <div className="bg-white shadow-md rounded-2xl p-6 border border-slate-200 space-y-4">
      <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
      {children}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6 space-y-8">

      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Add Supplier</h1>
        <p className="text-slate-500 text-sm mt-1">
          Create a new supplier record for purchases and payments
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">

        {/* BASIC DETAILS */}
        <Section title="Supplier Details">
          <div className="grid md:grid-cols-3 gap-6">
            <Input label="Name" name="name" value={form.name} onChange={handleChange} required />
            <Input label="Opening Balance" type="number" name="openingBalance" value={form.openingBalance} onChange={handleChange} />
            <Input label="Start Date" type="date" name="startDate" value={form.startDate} onChange={handleChange} />
            <Input label="End Date" type="date" name="endDate" value={form.endDate} onChange={handleChange} />
          </div>
        </Section>

        {/* ADDRESS */}
        <Section title="Address">
          <div className="grid md:grid-cols-4 gap-6">
            <Input label="Street" name="address.street" value={form.address.street} onChange={handleChange} />
            <Input label="City" name="address.city" value={form.address.city} onChange={handleChange} />
            <Input label="State" name="address.state" value={form.address.state} onChange={handleChange} />
            <Input label="PIN" name="address.pin" value={form.address.pin} onChange={handleChange} />
          </div>
        </Section>

        {/* CONTACT */}
        <Section title="Contact Information">
          <div className="grid md:grid-cols-3 gap-6">
            <Input label="Phone" name="contacts.phone" value={form.contacts.phone} onChange={handleChange} />
            <Input label="Mobile" name="contacts.mobile" value={form.contacts.mobile} onChange={handleChange} />
            <Input label="Email" type="email" name="contacts.email" value={form.contacts.email} onChange={handleChange} />
          </div>
        </Section>

        {/* TAX DETAILS */}
        <Section title="Tax Details">
          <div className="grid md:grid-cols-3 gap-6">
            <Input label="GSTIN" name="gstin" value={form.gstin} onChange={handleChange} />
          </div>
        </Section>

        {/* FINANCIAL */}
        <Section title="Financial Settings">
          <div className="grid md:grid-cols-3 gap-6">
            <Input label="Credit Limit" type="number" name="creditLimit" value={form.creditLimit} onChange={handleChange} />
          </div>
        </Section>

        {/* REMARKS */}
        <Section title="Additional Notes">
          <textarea
            rows="3"
            name="remarks"
            value={form.remarks}
            onChange={handleChange}
            className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-400 transition"
          />
        </Section>

        {/* ACTION BUTTONS */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl shadow-lg hover:scale-105 transition-all duration-300 disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save Supplier"}
          </button>

          <button
            type="button"
            onClick={() => navigate("/accounts")}
            className="px-6 py-2.5 border border-slate-300 rounded-xl hover:bg-slate-100 transition"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddAccount;