import { useEffect, useState } from "react";
import api from "../api";

const ReceiptPayment = () => {
  const [accounts, setAccounts] = useState([]);
  const [type, setType] = useState("receipt");
  const [accountId, setAccountId] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [remarks, setRemarks] = useState("");
  const [entries, setEntries] = useState([]);

  const load = async () => {
    const accRes = await api.get("/accounts");
    setAccounts(accRes.data.data || []);
    const entRes = await api.get("/finance", { params: { type } });
    setEntries(entRes.data.data || []);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type]);

  const submit = async (e) => {
    e.preventDefault();
    if (!accountId || !amount) return;
    await api.post("/finance", {
      accountId,
      type,
      amount: Number(amount),
      date: date || undefined,
      remarks,
    });
    setAmount("");
    setRemarks("");
    setAccountId("");
    load();
  };

  return (
    <div className="grid" style={{ gap: 16 }}>
      <div className="card">
        <div className="section-header">
          <div>
            <h2 style={{ margin: 0 }}>{type === "receipt" ? "Receipt" : "Payment"}</h2>
            <p className="muted">Record money {type === "receipt" ? "received" : "paid"}</p>
          </div>
          <div className="inline-list">
            <button
              className={`secondary-button ${type === "receipt" ? "active" : ""}`}
              onClick={() => setType("receipt")}
            >
              Receipt
            </button>
            <button
              className={`secondary-button ${type === "payment" ? "active" : ""}`}
              onClick={() => setType("payment")}
            >
              Payment
            </button>
          </div>
        </div>
        <form className="form-grid" onSubmit={submit}>
          <div className="form-control">
            <label>Account</label>
            <select value={accountId} onChange={(e) => setAccountId(e.target.value)}>
              <option value="">Select account</option>
              {accounts.map((a) => (
                <option key={a._id} value={a._id}>
                  {a.name} ({a.group})
                </option>
              ))}
            </select>
          </div>
          <div className="form-control">
            <label>Amount</label>
            <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
          </div>
          <div className="form-control">
            <label>Date</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
          <div className="form-control">
            <label>Remarks</label>
            <input value={remarks} onChange={(e) => setRemarks(e.target.value)} />
          </div>
          <div style={{ display: "flex", alignItems: "flex-end" }}>
            <button className="primary-button" type="submit">
              Save
            </button>
          </div>
        </form>
      </div>

      <div className="card">
        <div className="section-header">
          <div>
            <h3 style={{ margin: 0 }}>Recent {type === "receipt" ? "Receipts" : "Payments"}</h3>
          </div>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Account</th>
              <th>Amount</th>
              <th>Remarks</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((e) => (
              <tr key={e._id}>
                <td>{new Date(e.date).toLocaleDateString()}</td>
                <td>{e.account?.name}</td>
                <td>₹ {e.amount}</td>
                <td>{e.remarks || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReceiptPayment;

