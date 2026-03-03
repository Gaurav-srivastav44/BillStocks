import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [sort, setSort] = useState("");
  const [category, setCategory] = useState("");

  const loadProducts = async () => {
    try {
      setLoading(true);

      const res = await api.get("/products");

      const productsData = res.data?.data || [];
      setProducts(productsData);
    } catch (error) {
      console.error("Product fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;

    try {
      await api.delete(`/products/${id}`);
      loadProducts();
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const processedProducts = useMemo(() => {
    let data = [...products];

    if (search.trim()) {
      data = data.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (category) {
      data = data.filter((p) => p.category === category);
    }

    if (sort === "price_asc") data.sort((a, b) => a.price - b.price);
    if (sort === "price_desc") data.sort((a, b) => b.price - a.price);
    if (sort === "name") data.sort((a, b) => a.name.localeCompare(b.name));

    return data;
  }, [products, sort, category, search]);

  const categories = [
    ...new Set(products.map((p) => p.category).filter(Boolean)),
  ];

  const totalProducts = products.length;
  const lowStock = products.filter((p) => p.stock < 10).length;

  return (
    <div className="min-h-screen bg-slate-100 py-10 px-4">
      <div className="max-w-6xl mx-auto">

        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">
              Product Dashboard
            </h1>
            <p className="text-slate-500 mt-1">
              Manage your inventory efficiently
            </p>
          </div>

          <Link
            to="/products/new"
            className="bg-black text-white px-5 py-2.5 rounded-xl shadow hover:bg-slate-800 transition"
          >
            + Add Product
          </Link>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <StatCard title="Total Products" value={totalProducts} />
          <StatCard
            title="Low Stock Items"
            value={lowStock}
            color="text-red-500"
          />
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border mb-8">
          <div className="grid md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-black outline-none"
            />

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="px-4 py-2.5 border rounded-xl"
            >
              <option value="">All Categories</option>
              {categories.map((cat, i) => (
                <option key={i}>{cat}</option>
              ))}
            </select>

            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="px-4 py-2.5 border rounded-xl"
            >
              <option value="">Sort By</option>
              <option value="price_asc">Price Low → High</option>
              <option value="price_desc">Price High → Low</option>
              <option value="name">Name A-Z</option>
            </select>
          </div>
        </div>

        {loading ? (
          <Loader />
        ) : processedProducts.length === 0 ? (
          <EmptyState />
        ) : (
          <ProductTable
            products={processedProducts}
            onDelete={handleDelete}
          />
        )}
      </div>
    </div>
  );
};

export default ProductList;

/* ---------- Components ---------- */

const StatCard = ({ title, value, color = "" }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border">
    <p className="text-slate-500 text-sm">{title}</p>
    <h2 className={`text-3xl font-bold mt-2 ${color}`}>{value}</h2>
  </div>
);

const Loader = () => (
  <div className="flex justify-center py-10">
    <div className="w-10 h-10 border-4 border-slate-300 border-t-black rounded-full animate-spin"></div>
  </div>
);

const EmptyState = () => (
  <div className="bg-white p-10 rounded-2xl shadow-sm border text-center">
    <h3 className="text-lg font-semibold">No products found</h3>
    <Link
      to="/products/new"
      className="inline-block mt-4 bg-black text-white px-5 py-2 rounded-xl hover:bg-slate-800 transition"
    >
      Add First Product
    </Link>
  </div>
);

const ProductTable = ({ products, onDelete }) => (
  <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
    <table className="w-full text-left">
      <thead className="bg-slate-50 border-b">
        <tr>
          <th className="px-6 py-4 text-sm font-semibold">Product</th>
          <th className="px-6 py-4 text-sm font-semibold">Price</th>
          <th className="px-6 py-4 text-sm font-semibold">Stock</th>
          <th className="px-6 py-4 text-sm font-semibold">Category</th>
          <th className="px-6 py-4 text-sm font-semibold">Actions</th>
        </tr>
      </thead>
      <tbody>
        {products.map((p) => (
          <tr key={p._id} className="border-b hover:bg-slate-50">
            <td className="px-6 py-4">
              <div className="flex items-center gap-3">
                {p.imageUrl && (
                  <img
                    src={p.imageUrl}
                    alt={p.name}
                    className="w-12 h-12 rounded-md object-cover border border-slate-200"
                  />
                )}
                <span className="font-medium">{p.name}</span>
              </div>
            </td>
            <td className="px-6 py-4">₹ {p.price}</td>
            <td className="px-6 py-4">
              {p.stock < 10 ? (
                <span className="bg-red-100 text-red-600 text-xs px-3 py-1 rounded-full">
                  Low ({p.stock})
                </span>
              ) : (
                <span className="bg-green-100 text-green-600 text-xs px-3 py-1 rounded-full">
                  {p.stock}
                </span>
              )}
            </td>
            <td className="px-6 py-4">{p.category || "-"}</td>
            <td className="px-6 py-4 space-x-2">
              <button
                onClick={() => onDelete(p._id)}
                className="px-3 py-1 text-sm border border-red-400 text-red-500 rounded-lg"
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);