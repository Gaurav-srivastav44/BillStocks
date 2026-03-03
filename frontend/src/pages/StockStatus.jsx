import { useEffect, useState } from "react";
import api from "../api";

const StockStatus = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    api.get("/reports/stock-status").then((res) => setProducts(res.data.data || []));
  }, []);

  return (
    <div className="card">
      <div className="section-header">
        <div>
          <h2 style={{ margin: 0 }}>Stock Status</h2>
          <p className="muted">Current stock for all products</p>
        </div>
      </div>
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>SKU</th>
            <th>Category</th>
            <th>Stock</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p._id}>
              <td>{p.name}</td>
              <td>{p.sku}</td>
              <td>{p.category || "-"}</td>
              <td>{p.stock}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StockStatus;

