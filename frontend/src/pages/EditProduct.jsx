import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);

  useEffect(() => {
    api.get(`/products/${id}`).then((res) => setForm(res.data.data)).catch(() => setForm(null));
  }, [id]);

  if (!form) return <div className="card">Loading...</div>;

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.put(`/products/${id}`, {
      ...form,
      price: Number(form.price),
      stock: Number(form.stock),
      gstRate: Number(form.gstRate),
    });
    navigate("/products");
  };

  return (
    <div className="card">
      <div className="section-header">
        <div>
          <h2 style={{ margin: 0 }}>Edit Product</h2>
          <p className="muted">{form.name}</p>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="grid" style={{ gap: 20 }}>
        <div className="form-grid">
          <div className="form-control">
            <label>Name</label>
            <input name="name" value={form.name} onChange={handleChange} required />
          </div>
          <div className="form-control">
            <label>SKU</label>
            <input name="sku" value={form.sku} onChange={handleChange} required />
          </div>
          <div className="form-control">
            <label>Category</label>
            <input name="category" value={form.category || ""} onChange={handleChange} />
          </div>
          <div className="form-control">
            <label>Price (₹)</label>
            <input
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
              min="0"
              step="0.01"
              required
            />
          </div>
          <div className="form-control">
            <label>Stock</label>
            <input
              type="number"
              name="stock"
              value={form.stock}
              onChange={handleChange}
              min="0"
              required
            />
          </div>
          <div className="form-control">
            <label>GST %</label>
            <input
              type="number"
              name="gstRate"
              value={form.gstRate}
              onChange={handleChange}
              min="0"
              step="0.1"
            />
          </div>
        </div>
        <div className="form-grid">
          <div className="form-control">
            <label>Description</label>
            <textarea
              rows="3"
              name="description"
              value={form.description || ""}
              onChange={handleChange}
            />
          </div>
          <div className="form-control">
            <label>Image URL (optional)</label>
            <input
              name="imageUrl"
              value={form.imageUrl || ""}
              onChange={handleChange}
            />
          </div>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <button className="primary-button" type="submit">
            Update Product
          </button>
          <button className="ghost-button" type="button" onClick={() => navigate("/products")}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProduct;

