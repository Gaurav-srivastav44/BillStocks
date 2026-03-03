import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";

const Invoices = () => {
  const [invoices, setInvoices] = useState([]);

  useEffect(() => {
    api.get("/invoices").then((res) => setInvoices(res.data.data || [])).catch(() => setInvoices([]));
  }, []);

  return (
    <div className="card">
      <div className="section-header">
        <div>
          <h2 style={{ margin: 0 }}>Invoices</h2>
          <p className="muted">Saved bills with totals</p>
        </div>
        <Link className="primary-button" to="/billing">
          New Invoice
        </Link>
      </div>
      <table className="table">
        <thead>
          <tr>
            <th>Number</th>
            <th>Customer</th>
            <th>Date</th>
            <th>Total</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {invoices.map((inv) => (
            <tr key={inv._id}>
              <td>{inv.invoiceNumber}</td>
              <td>{inv.customerName}</td>
              <td>{new Date(inv.createdAt).toLocaleDateString()}</td>
              <td>₹ {inv.grandTotal?.toFixed(2)}</td>
              <td>
                <Link className="secondary-button" to={`/invoices/${inv._id}/print`}>
                  Print
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Invoices;

