import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import bgBlue from "../assets/bgblue.jpg";

const AddProduct = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    sku: "",
    price: "",
    stock: "",
    category: "",
    gstRate: 0,
    description: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post("/products", {
        ...form,
        price: Number(form.price),
        stock: Number(form.stock),
        gstRate: Number(form.gstRate),
      });

      navigate("/products");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to save product");
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center px-4 py-10 relative"
      style={{ backgroundImage: `url(${bgBlue})` }}
    >
      <div className="absolute inset-0 bg-black/0"></div>

      <div className="relative w-full max-w-4xl bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-8">
        
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-blue-700">
            Add New Product
          </h2>
          <p className="text-gray-600 mt-2">
            Create a new inventory item
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            <div>
              <label className="block text-sm font-medium mb-1">
                Product Name
              </label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Product Code
              </label>
              <input
                name="sku"
                value={form.sku}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Category
              </label>
              <input
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Price (₹)
              </label>
              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Stock
              </label>
              <input
                type="number"
                name="stock"
                value={form.stock}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                GST %
              </label>
              <input
                type="number"
                name="gstRate"
                value={form.gstRate}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Description
            </label>
            <textarea
              rows="3"
              name="description"
              value={form.description}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={() => navigate("/products")}
              className="px-6 py-2 rounded-lg border hover:bg-gray-100"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 shadow-md transition"
            >
              Save Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;