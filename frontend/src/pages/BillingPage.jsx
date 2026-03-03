import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  Plus, 
  Minus, 
  Trash2, 
  Receipt, 
  User, 
  Package, 
  RefreshCcw, 
  Printer, 
  ShoppingCart,
  Calculator
} from "lucide-react";
import api from "../api";

export default function BillingPage() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [accountId, setAccountId] = useState("");
  const [items, setItems] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [discountRate, setDiscountRate] = useState(0);
  const [gstRate, setGstRate] = useState(0);
  const [roundOff, setRoundOff] = useState(0);
  const [customerName, setCustomerName] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get("/products")
      .then((res) => setProducts(res?.data?.data || []))
      .catch(() => setProducts([]));

    api.get("/accounts")
      .then((res) => {
        const data = res?.data?.data || [];
        setAccounts(Array.isArray(data) ? data.filter((a) => a.group === "Sundry Debtors") : []);
      })
      .catch(() => setAccounts([]));
  }, []);

  const selectedProduct = useMemo(
    () => products.find((p) => p._id === selectedProductId) || null,
    [products, selectedProductId]
  );

  const addItem = () => {
    if (!selectedProduct) return;
    const qty = Number(quantity) || 1;
    const price = Number(selectedProduct.price || 0);
    const itemGstRate = selectedProduct.gstRate ?? Number(gstRate) ?? 0;

    setItems((prev) => [
      ...prev,
      {
        id: selectedProduct._id + "-" + Date.now(),
        productId: selectedProduct._id,
        name: selectedProduct.name,
        price,
        quantity: qty,
        gstRate: itemGstRate,
        lineTotal: price * qty,
        imageUrl: selectedProduct.imageUrl || "",
      },
    ]);
    setSelectedProductId("");
    setQuantity(1);
  };

  const updateQty = (id, delta) => {
    setItems(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty, lineTotal: item.price * newQty };
      }
      return item;
    }));
  };

  const removeItem = (id) => {
    setItems((prev) => prev.filter((it) => it.id !== id));
  };

  const totals = useMemo(() => {
    const subTotal = items.reduce((sum, it) => sum + Number(it.lineTotal || 0), 0);
    const discountAmount = subTotal * (Number(discountRate) / 100);
    const taxable = subTotal - discountAmount;
    
    let gstAmount = 0;
    if (Number(gstRate) > 0) {
      gstAmount = taxable * (Number(gstRate) / 100);
    } else {
      gstAmount = items.reduce((sum, it) => sum + (it.lineTotal * (Number(it.gstRate || 0) / 100)), 0);
    }

    return { 
      subTotal, 
      discountAmount, 
      taxable, 
      gstAmount, 
      grandTotal: taxable + gstAmount + Number(roundOff) 
    };
  }, [items, discountRate, gstRate, roundOff]);

  const saveInvoice = async () => {
    if (!items.length) return;
    setSaving(true);
    try {
      const res = await api.post("/invoices", {
        customerName: customerName || "Walk-in Customer",
        accountId: accountId || undefined,
        discountRate: Number(discountRate),
        gstRate: Number(gstRate),
        roundOff: Number(roundOff),
        items: items.map(i => ({
          productId: i.productId,
          quantity: i.quantity,
          price: i.price,
          gstRate: i.gstRate
        })),
      });
      navigate(`/invoices/${res.data?.data?._id}/print`);
    } catch (err) {
      console.error("Save failed:", err);
    } finally {
      setSaving(false);
    }
  };

  const resetForm = () => {
    setItems([]);
    setAccountId("");
    setCustomerName("");
    setDiscountRate(0);
    setGstRate(0);
    setRoundOff(0);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto grid gap-8 lg:grid-cols-12">
        
        {/* LEFT: FORM SECTION */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 md:p-8">
            <header className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                  <Receipt className="text-blue-600" /> BillStocks POS
                </h1>
                <p className="text-slate-500 text-sm">Create professional invoices instantly</p>
              </div>
              <Link to="/invoices" className="text-blue-600 bg-blue-50 px-4 py-2 rounded-xl text-sm font-bold hover:bg-blue-100 transition">
                History
              </Link>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                  <User size={14} /> Customer Account
                </label>
                <select
                  value={accountId}
                  onChange={(e) => setAccountId(e.target.value)}
                  className="w-full bg-slate-50 border-none rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 transition"
                >
                  <option value="">Walk-in / Cash Sale</option>
                  {accounts.map((a) => <option key={a._id} value={a._id}>{a.name}</option>)}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Display Name</label>
                <input
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Guest Customer"
                  className="w-full bg-slate-50 border-none rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 transition"
                />
              </div>

              <div className="md:col-span-2 space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                  <Package size={14} /> Product Search
                </label>
                <select
                  value={selectedProductId}
                  onChange={(e) => setSelectedProductId(e.target.value)}
                  className="w-full bg-slate-50 border-none rounded-2xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-blue-500 transition"
                >
                  <option value="">Select a product...</option>
                  {products.map((p) => (
                    <option key={p._id} value={p._id}>
                      {p.name} — (Stock: {p.stock || 0}) — ₹{p.price}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4 md:col-span-2 bg-blue-50/50 p-4 rounded-2xl border border-blue-100">
                <div>
                  <p className="text-[10px] font-bold text-blue-400 uppercase">Rate</p>
                  <p className="text-lg font-black text-blue-700">₹{selectedProduct?.price?.toFixed(2) || "0.00"}</p>
                </div>
                <div className="flex flex-col items-end">
                    <p className="text-[10px] font-bold text-blue-400 uppercase mb-1">Qty</p>
                    <div className="flex items-center bg-white rounded-xl border border-blue-100 p-1">
                        <button onClick={() => setQuantity(q => Math.max(1, q-1))} className="p-1 hover:bg-slate-100 rounded-lg text-slate-400"><Minus size={14}/></button>
                        <input 
                            type="number" 
                            className="w-12 text-center border-none text-sm font-bold focus:ring-0" 
                            value={quantity} 
                            onChange={(e) => setQuantity(Number(e.target.value))}
                        />
                        <button onClick={() => setQuantity(q => q+1)} className="p-1 hover:bg-slate-100 rounded-lg text-slate-400"><Plus size={14}/></button>
                    </div>
                </div>
              </div>

              <div className="md:col-span-2">
                <button
                  onClick={addItem}
                  disabled={!selectedProductId}
                  className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 disabled:bg-slate-200 disabled:shadow-none transition-all flex items-center justify-center gap-2"
                >
                  <Plus size={20} /> Add Item
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-xs font-bold text-slate-900 mb-4 flex items-center gap-2 uppercase">
                <Calculator size={16} className="text-slate-400" /> Global Adjustments
            </h3>
            <div className="grid grid-cols-3 gap-4">
               <div className="space-y-1">
                 <label className="text-[10px] font-bold text-slate-400">Discount %</label>
                 <input type="number" value={discountRate} onChange={e => setDiscountRate(Number(e.target.value))} className="w-full bg-slate-50 border-none rounded-xl px-3 py-2 text-sm" />
               </div>
               <div className="space-y-1">
                 <label className="text-[10px] font-bold text-slate-400">Global GST %</label>
                 <input type="number" value={gstRate} onChange={e => setGstRate(Number(e.target.value))} className="w-full bg-slate-50 border-none rounded-xl px-3 py-2 text-sm" />
               </div>
               <div className="space-y-1">
                 <label className="text-[10px] font-bold text-slate-400">Round Off</label>
                 <input type="number" value={roundOff} onChange={e => setRoundOff(Number(e.target.value))} className="w-full bg-slate-50 border-none rounded-xl px-3 py-2 text-sm" />
               </div>
            </div>
          </div>
        </div>

        {/* RIGHT: CART SUMMARY */}
        <div className="lg:col-span-5">
          <div className="bg-slate-900 rounded-3xl shadow-2xl overflow-hidden sticky top-8 flex flex-col min-h-[500px]">
            <div className="p-6 border-b border-slate-800 flex justify-between items-center">
              <h3 className="text-white font-bold flex items-center gap-2 text-sm">
                <ShoppingCart size={18} className="text-blue-400" /> Billing Cart ({items.length})
              </h3>
              <button onClick={resetForm} className="text-slate-500 hover:text-rose-400 transition p-2 bg-slate-800 rounded-lg">
                <RefreshCcw size={16} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {items.length ? items.map((item) => (
                <div key={item.id} className="bg-slate-800/40 rounded-2xl p-4 flex items-center gap-4 group border border-transparent hover:border-slate-700 transition">
                  <div className="flex-1">
                    <h4 className="text-white text-sm font-bold truncate max-w-[150px]">{item.name}</h4>
                    <p className="text-slate-500 text-xs">₹{item.price} × {item.quantity}</p>
                  </div>
                  <div className="flex items-center gap-2 bg-slate-900 rounded-xl p-1 border border-slate-700">
                    <button onClick={() => updateQty(item.id, -1)} className="text-slate-400 hover:text-white p-1"><Minus size={12}/></button>
                    <span className="text-blue-400 font-bold text-xs w-5 text-center">{item.quantity}</span>
                    <button onClick={() => updateQty(item.id, 1)} className="text-slate-400 hover:text-white p-1"><Plus size={12}/></button>
                  </div>
                  <div className="text-right min-w-[70px]">
                    <p className="text-white font-bold text-sm">₹{item.lineTotal.toFixed(2)}</p>
                    <button onClick={() => removeItem(item.id)} className="text-rose-500 p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Trash2 size={14}/>
                    </button>
                  </div>
                </div>
              )) : (
                <div className="h-full flex flex-col items-center justify-center py-20 opacity-20">
                   <ShoppingCart size={48} className="text-white mb-2" />
                   <p className="text-white text-sm italic">Cart is empty</p>
                </div>
              )}
            </div>

            <div className="p-6 bg-slate-900 border-t border-slate-800 space-y-3">
              <div className="flex justify-between text-slate-400 text-xs uppercase tracking-widest font-bold">
                <span>Subtotal</span>
                <span>₹{totals.subTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-400 text-xs uppercase tracking-widest font-bold">
                <span className="flex items-center gap-1">Discount ({discountRate}%)</span>
                <span className="text-rose-400">-₹{totals.discountAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-400 text-xs uppercase tracking-widest font-bold">
                <span>GST ({gstRate}%)</span>
                <span>+₹{totals.gstAmount.toFixed(2)}</span>
              </div>
              <div className="pt-6 border-t border-slate-800 flex justify-between items-center">
                <div>
                  <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">Grand Total</p>
                  <p className="text-4xl font-black text-white tracking-tighter">₹{totals.grandTotal.toFixed(2)}</p>
                </div>
                <button
                  onClick={saveInvoice}
                  disabled={!items.length || saving}
                  className="bg-blue-600 hover:bg-blue-500 text-white p-5 rounded-2xl shadow-xl shadow-blue-900/40 transition-all disabled:opacity-50 disabled:grayscale"
                >
                  {saving ? <RefreshCcw className="animate-spin" /> : <Printer size={28} />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}