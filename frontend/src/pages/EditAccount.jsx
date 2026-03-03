import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api";

const EditAccount = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);

  useEffect(() => {
    api.get(`/accounts/${id}`).then((res) => setForm(res.data.data)).catch(() => setForm(null));
  }, [id]);

  if (!form) return <div className="card">Loading...</div>;

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("address.")) {
      const key = name.split(".")[1];
      setForm((f) => ({ ...f, address: { ...(f.address || {}), [key]: value } }));
    } else if (name.startsWith("contacts.")) {
      const key = name.split(".")[1];
      setForm((f) => ({ ...f, contacts: { ...(f.contacts || {}), [key]: value } }));
    } else {
      setForm((f) => ({ ...f, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.put(`/accounts/${id}`, {
      ...form,
      openingBalance: Number(form.openingBalance) || 0,
      creditLimit: Number(form.creditLimit) || 0,
      creditDays: Number(form.creditDays) || 0,
      discount: Number(form.discount) || 0,
      interest: Number(form.interest) || 0,
      caseQty: Number(form.caseQty) || 0,
      freight: Number(form.freight) || 0,
      wastage: Number(form.wastage) || 0,
    });
    navigate("/accounts");
  };

  return (
    <div className="card">
      <div className="section-header">
        <div>
          <h2 style={{ margin: 0 }}>Edit Account</h2>
          <p className="muted">{form.name}</p>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="grid" style={{ gap: 16 }}>
        <div className="form-grid">
          <div className="form-control">
            <label>Name</label>
            <input name="name" value={form.name} onChange={handleChange} required />
          </div>
          <div className="form-control">
            <label>Group</label>
            <select name="group" value={form.group} onChange={handleChange}>
              <option value="Sundry Debtors">Sundry Debtors</option>
              <option value="Sundry Creditors">Sundry Creditors</option>
            </select>
          </div>
          <div className="form-control">
            <label>Opening Balance</label>
            <input
              type="number"
              name="openingBalance"
              value={form.openingBalance || 0}
              onChange={handleChange}
            />
          </div>
          <div className="form-control">
            <label>Start Date</label>
            <input type="date" name="startDate" value={form.startDate?.slice(0, 10) || ""} onChange={handleChange} />
          </div>
          <div className="form-control">
            <label>End Date</label>
            <input type="date" name="endDate" value={form.endDate?.slice(0, 10) || ""} onChange={handleChange} />
          </div>
        </div>

        <div className="form-grid">
          <div className="form-control">
            <label>Street</label>
            <input name="address.street" value={form.address?.street || ""} onChange={handleChange} />
          </div>
          <div className="form-control">
            <label>City</label>
            <input name="address.city" value={form.address?.city || ""} onChange={handleChange} />
          </div>
          <div className="form-control">
            <label>State</label>
            <input name="address.state" value={form.address?.state || ""} onChange={handleChange} />
          </div>
          <div className="form-control">
            <label>PIN</label>
            <input name="address.pin" value={form.address?.pin || ""} onChange={handleChange} />
          </div>
        </div>

        <div className="form-grid">
          <div className="form-control">
            <label>Phone</label>
            <input name="contacts.phone" value={form.contacts?.phone || ""} onChange={handleChange} />
          </div>
          <div className="form-control">
            <label>Mobile</label>
            <input name="contacts.mobile" value={form.contacts?.mobile || ""} onChange={handleChange} />
          </div>
          <div className="form-control">
            <label>Email</label>
            <input name="contacts.email" value={form.contacts?.email || ""} onChange={handleChange} />
          </div>
        </div>

        <div className="form-grid">
          <div className="form-control">
            <label>GSTIN</label>
            <input name="gstin" value={form.gstin || ""} onChange={handleChange} />
          </div>
          <div className="form-control">
            <label>PAN</label>
            <input name="pan" value={form.pan || ""} onChange={handleChange} />
          </div>
          <div className="form-control">
            <label>TIN</label>
            <input name="tin" value={form.tin || ""} onChange={handleChange} />
          </div>
        </div>

        <div className="form-grid">
          <div className="form-control">
            <label>Credit Limit</label>
            <input name="creditLimit" type="number" value={form.creditLimit || 0} onChange={handleChange} />
          </div>
          <div className="form-control">
            <label>Credit Days</label>
            <input name="creditDays" type="number" value={form.creditDays || 0} onChange={handleChange} />
          </div>
          <div className="form-control">
            <label>Discount %</label>
            <input name="discount" type="number" value={form.discount || 0} onChange={handleChange} />
          </div>
          <div className="form-control">
            <label>Interest %</label>
            <input name="interest" type="number" value={form.interest || 0} onChange={handleChange} />
          </div>
        </div>

        <div className="form-grid">
          <div className="form-control">
            <label>Case Qty</label>
            <input name="caseQty" type="number" value={form.caseQty || 0} onChange={handleChange} />
          </div>
          <div className="form-control">
            <label>Freight</label>
            <input name="freight" type="number" value={form.freight || 0} onChange={handleChange} />
          </div>
          <div className="form-control">
            <label>Wastage</label>
            <input name="wastage" type="number" value={form.wastage || 0} onChange={handleChange} />
          </div>
        </div>

        <div className="form-control">
          <label>Remarks</label>
          <textarea rows="3" name="remarks" value={form.remarks || ""} onChange={handleChange} />
        </div>

        <div style={{ display: "flex", gap: 12 }}>
          <button className="primary-button" type="submit">
            Save
          </button>
          <button className="ghost-button" type="button" onClick={() => navigate("/accounts")}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditAccount;

