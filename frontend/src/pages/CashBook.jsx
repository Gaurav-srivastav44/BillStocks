import { useEffect, useState } from "react";
import api from "../api";

const CashBook = () => {
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [data, setData] = useState(null);

  const load = async () => {
    const res = await api.get("/reports/cashbook", { params: { date } });
    setData(res.data.data);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date]);

  return (
    <div className="card">
      <div className="section-header">
        <div>
          <h2 style={{ margin: 0 }}>Cash Book</h2>
          <p className="muted">Daily cash ledger</p>
        </div>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      </div>

      {data ? (
        <>
          <p>Opening Balance: <strong>₹ {data.openingBalance.toFixed(2)}</strong></p>
          <div className="grid grid-3">
            <div className="card">
              <h4>Receipts</h4>
              <ul>
                {data.receipts.map((r) => (
                  <li key={r._id}>
                    {new Date(r.date).toLocaleDateString()} — {r.account?.name}: ₹{r.amount}
                  </li>
                ))}
              </ul>
            </div>
            <div className="card">
              <h4>Payments</h4>
              <ul>
                {data.payments.map((p) => (
                  <li key={p._id}>
                    {new Date(p.date).toLocaleDateString()} — {p.account?.name}: ₹{p.amount}
                  </li>
                ))}
              </ul>
            </div>
            <div className="card">
              <h4>Closing Balance</h4>
              <p className="stat-value">₹ {data.closingBalance.toFixed(2)}</p>
            </div>
          </div>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default CashBook;

