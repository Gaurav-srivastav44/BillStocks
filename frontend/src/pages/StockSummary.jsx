import { useEffect, useState } from "react";
import api from "../api";

const StockSummary = () => {
  const [summary, setSummary] = useState({});

  useEffect(() => {
    api.get("/reports/stock-summary").then((res) => setSummary(res.data.data || {}));
  }, []);

  const entries = Object.entries(summary);

  return (
    <div className="card">
      <div className="section-header">
        <div>
          <h2 style={{ margin: 0 }}>Stock Summary</h2>
          <p className="muted">Totals by category</p>
        </div>
      </div>
      <table className="table">
        <thead>
          <tr>
            <th>Category</th>
            <th>Total Qty</th>
          </tr>
        </thead>
        <tbody>
          {entries.map(([cat, qty]) => (
            <tr key={cat}>
              <td>{cat}</td>
              <td>{qty}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StockSummary;

