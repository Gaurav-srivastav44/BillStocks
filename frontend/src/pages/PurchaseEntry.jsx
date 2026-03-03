import { useEffect, useMemo, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Plus, Trash2, Save, ShoppingCart } from "lucide-react";
import api from "../api";

const PurchaseEntry = () => {
  const navigate = useNavigate();
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);
  const [supplierId, setSupplierId] = useState("");
  const [items, setItems] = useState([]);
  const [gstRate, setGstRate] = useState(0);
  const [freight, setFreight] = useState(0);
  const [miscCharges, setMiscCharges] = useState(0);
  const [notes, setNotes] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("");
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    api.get("/accounts").then((res) => {
      const data = res.data.data || [];
      setSuppliers(data);
    });
    api.get("/products").then((res) => setProducts(res.data.data || []));
  }, []);

  const addItem = () => {
    const product = products.find((p) => p._id === selectedProduct);
    if (!product) return;
    const qty = Number(quantity) || 1;
    const lineTotal = product.price * qty;
    setItems((prev) => [
      ...prev,
      {
        productId: product._id,
        name: product.name,
        quantity: qty,
        price: product.price,
        lineTotal,
      },
    ]);
    setSelectedProduct("");
    setQuantity(1);
  };

  const totals = useMemo(() => {
    const subTotal = items.reduce((s, i) => s + i.lineTotal, 0);
    const gstAmount = subTotal * ((Number(gstRate) || 0) / 100);
    const grandTotal = subTotal + gstAmount + Number(freight || 0) + Number(miscCharges || 0);
    return { subTotal, gstAmount, grandTotal };
  }, [items, gstRate, freight, miscCharges]);

  const save = async () => {
    if (!supplierId || !items.length) return;
    try {
      await api.post("/purchases", {
        supplierId,
        items: items.map((i) => ({
          productId: i.productId,
          quantity: i.quantity,
          price: i.price,
        })),
        gstRate: Number(gstRate) || 0,
        freight: Number(freight) || 0,
        miscCharges: Number(miscCharges) || 0,
        notes,
      });
      navigate("/reports/purchase");
    } catch (err) {
      console.error("Save failed", err);
    }
  };

  const removeItem = (idx) => setItems((prev) => prev.filter((_, i) => i !== idx));

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">New Purchase Entry</h1>
            <p className="text-gray-500">Record incoming stock and apply taxes</p>
          </div>
          <button
            onClick={save}
            disabled={!supplierId || !items.length}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white px-6 py-2.5 rounded-xl font-semibold transition-all shadow-md shadow-blue-200"
          >
            <Save size={18} /> Save Purchase
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Form Controls */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Supplier Details</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Select Supplier</label>
                  <select
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    value={supplierId}
                    onChange={(e) => setSupplierId(e.target.value)}
                  >
                    <option value="">Choose Supplier...</option>
                    {suppliers.map((s) => (
                      <option key={s._id} value={s._id}>{s.name}</option>
                    ))}
                  </select>
                  <p className="mt-2 text-xs text-gray-500">
                    Need to add a new supplier?{" "}
                    <Link to="/accounts/new" className="text-blue-600 underline">
                      Add Supplier
                    </Link>
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Add Items</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Product</label>
                  <select
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    value={selectedProduct}
                    onChange={(e) => setSelectedProduct(e.target.value)}
                  >
                    <option value="">Choose Product...</option>
                    {products.map((p) => (
                      <option key={p._id} value={p._id}>
                        {p.name} (Stock: {p.stock})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Qty</label>
                    <input
                      type="number"
                      className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                    />
                  </div>
                  <div className="flex items-end">
                    <button
                      onClick={addItem}
                      disabled={!selectedProduct}
                      className="p-3 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white disabled:opacity-50 transition-colors"
                    >
                      <Plus size={20} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Table & Totals */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-4 bg-gray-50/50 border-b border-gray-100 flex items-center gap-2 text-gray-600 font-semibold">
                <ShoppingCart size={18} /> Order Items
              </div>
              <div className="min-h-[300px]">
                {items.length ? (
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="text-xs uppercase text-gray-400 bg-gray-50">
                        <th className="px-6 py-3 font-bold">Item</th>
                        <th className="px-6 py-3 font-bold">Qty</th>
                        <th className="px-6 py-3 font-bold">Price</th>
                        <th className="px-6 py-3 font-bold text-right">Total</th>
                        <th className="px-6 py-3"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {items.map((item, idx) => (
                        <tr key={idx} className="hover:bg-gray-50 group transition-colors">
                          <td className="px-6 py-4 font-medium text-gray-800">{item.name}</td>
                          <td className="px-6 py-4 text-gray-600">{item.quantity}</td>
                          <td className="px-6 py-4 text-gray-600">₹{item.price}</td>
                          <td className="px-6 py-4 text-right font-bold text-gray-900">₹{item.lineTotal.toFixed(2)}</td>
                          <td className="px-6 py-4 text-right">
                            <button
                              onClick={() => removeItem(idx)}
                              className="text-gray-300 hover:text-red-500 transition-colors"
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full py-20 text-gray-400">
                    <ShoppingCart size={48} className="mb-2 opacity-20" />
                    <p>No items added yet</p>
                  </div>
                )}
              </div>

              {/* Bottom Adjustment Controls */}
              <div className="p-6 border-t border-gray-100 bg-gray-50/30 grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase">GST %</label>
                  <input
                    type="number"
                    className="w-full mt-1 bg-white border border-gray-200 rounded p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    value={gstRate}
                    onChange={(e) => setGstRate(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase">Freight</label>
                  <input
                    type="number"
                    className="w-full mt-1 bg-white border border-gray-200 rounded p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    value={freight}
                    onChange={(e) => setFreight(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase">Misc</label>
                  <input
                    type="number"
                    className="w-full mt-1 bg-white border border-gray-200 rounded p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    value={miscCharges}
                    onChange={(e) => setMiscCharges(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase">Notes</label>
                  <input
                    className="w-full mt-1 bg-white border border-gray-200 rounded p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    value={notes}
                    placeholder="Reference..."
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>
              </div>

              {/* Summary Totals */}
              <div className="p-6 bg-gray-900 text-white flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="flex gap-6 opacity-80 text-sm">
                  <span>Sub: ₹{totals.subTotal.toFixed(2)}</span>
                  <span>GST: ₹{totals.gstAmount.toFixed(2)}</span>
                </div>
                <div className="text-2xl font-bold flex items-center gap-2">
                  <span className="text-gray-400 text-sm font-normal uppercase tracking-widest">Grand Total</span>
                  <span className="text-blue-400">₹{totals.grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchaseEntry;