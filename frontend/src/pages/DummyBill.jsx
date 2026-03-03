// src/pages/DummyBill.jsx
import React, { useState, useRef } from "react";

function numberToWordsIN(num) {
  const a = ["","one","two","three","four","five","six","seven","eight","nine","ten","eleven","twelve","thirteen","fourteen","fifteen","sixteen","seventeen","eighteen","nineteen"];
  const b = ["","","twenty","thirty","forty","fifty","sixty","seventy","eighty","ninety"];
  if ((num = num.toString()).length > 9) return "overflow";
  const n = ("000000000"+num).substr(-9).match(/(\d{2})(\d{2})(\d{2})(\d{3})/);
  if (!n) return "";
  const readTwo = nn => { const v = Number(nn); if (v < 20) return a[v]; return (b[Math.floor(v/10)] + (v%10 ? " "+a[v%10] : "")).trim(); };
  let str = ""; const crore = readTwo(n[1]), lakh = readTwo(n[2]), thousand = readTwo(n[3]), hundred = Number(n[4]);
  if (crore) str += crore + " crore "; if (lakh) str += lakh + " lakh "; if (thousand) str += thousand + " thousand ";
  if (hundred) { const h = Math.floor(hundred/100), rest = hundred%100; if (h) str += a[h]+" hundred "; if (rest) str += "and "+readTwo(String(rest))+" "; }
  return str.trim();
}
function amountToWords(amount) {
  const n = Number((Math.abs(amount)||0).toFixed(2)), intPart = Math.floor(n), paise = Math.round((n-intPart)*100);
  const intWords = intPart===0 ? "zero" : numberToWordsIN(intPart);
  let res = `${intWords} rupees`; if (paise>0) res += ` and ${numberToWordsIN(paise)} paise`;
  return res.charAt(0).toUpperCase()+res.slice(1)+" only";
}

export default function DummyBill() {
  const printRef = useRef();
  const [firmName,setFirmName]=useState(""),[firmGst,setFirmGst]=useState(""),[firmAddress,setFirmAddress]=useState(""),[firmPhone,setFirmPhone]=useState("");
  const [customerName,setCustomerName]=useState(""),[customerPhone,setCustomerPhone]=useState("");
  const [date,setDate]=useState(new Date().toISOString().slice(0,10)),[invoiceNumber,setInvoiceNumber]=useState("");
  const [gstPercent,setGstPercent]=useState(12); // clothing often 5/12/18 — default 12
  const [items,setItems]=useState([{ id: Date.now(), name:"", qty:1, price:0 }]);
  const [generated,setGenerated]=useState(false);
  const addItem=()=>setItems(s=>[...s,{ id:Date.now()+Math.random(), name:"", qty:1, price:0 }]);
  const removeItem=id=>setItems(s=>s.filter(it=>it.id!==id));
  const updateItem=(id,key,value)=>setItems(s=>s.map(it=>it.id===id?{...it,[key]:value}:it));
  const subtotal=items.reduce((acc,it)=>+(acc + +(Number(it.qty||0)*Number(it.price||0)).toFixed(2)).toFixed(2),0);
  const gstAmount=Number(((subtotal*Number(gstPercent||0))/100).toFixed(2)); const cgst=+(gstAmount/2).toFixed(2); const sgst=+(gstAmount/2).toFixed(2);
  const grandTotal=+(subtotal+gstAmount).toFixed(2);
  const generateBill=()=>{ if(!invoiceNumber) setInvoiceNumber(`INV${Date.now().toString().slice(-6)}`); setGenerated(true); setTimeout(()=>printRef.current?.scrollIntoView({behavior:"smooth"}),50); };
  const handlePrint=()=>window.print();
  const terms = [
    "Exchange only (no refunds).",
    "Exchange within 7 days with original tags and receipt.",
    "Items must be unworn, unwashed and in original condition.",
  ];

  return (
    <div className="min-h-screen bg-white p-6 text-black">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="bg-white border border-gray-200 shadow-sm rounded-lg p-6">
          <div className="flex items-center justify-between mb-4"><h2 className="text-lg font-semibold">Create / Generate Bill</h2><div className="text-sm text-gray-600">Theme: white · gray · black</div></div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
            <input className="border border-gray-300 p-2 rounded" placeholder="Firm name" value={firmName} onChange={e=>setFirmName(e.target.value)} />
            <input className="border border-gray-300 p-2 rounded" placeholder="Firm GST (optional)" value={firmGst} onChange={e=>setFirmGst(e.target.value)} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
            <input className="border border-gray-300 p-2 rounded" placeholder="Firm contact number" value={firmPhone} onChange={e=>setFirmPhone(e.target.value)} />
            <input className="border border-gray-300 p-2 rounded" placeholder="Invoice number (optional)" value={invoiceNumber} onChange={e=>setInvoiceNumber(e.target.value)} />
          </div>
          <div className="mb-3"><textarea className="w-full border border-gray-300 p-2 rounded" rows={2} placeholder="Firm address (shown on invoice)" value={firmAddress} onChange={e=>setFirmAddress(e.target.value)} /></div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
            <input className="border border-gray-300 p-2 rounded" placeholder="Customer name" value={customerName} onChange={e=>setCustomerName(e.target.value)} />
            <input className="border border-gray-300 p-2 rounded" placeholder="Customer phone" value={customerPhone} onChange={e=>setCustomerPhone(e.target.value)} />
            <input type="date" className="border border-gray-300 p-2 rounded" value={date} onChange={e=>setDate(e.target.value)} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
            <input type="number" min="0" className="border border-gray-300 p-2 rounded" placeholder="GST % (e.g. 12)" value={gstPercent} onChange={e=>setGstPercent(e.target.value)} />
            <div />
          </div>

          <div className="mb-4">
            <div className="flex items-center justify-between mb-2"><h3 className="font-medium text-sm">Items</h3><button onClick={addItem} className="text-sm px-3 py-1 bg-gray-900 text-white rounded">+ Add item</button></div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead><tr className="bg-gray-100 text-left text-xs text-gray-700"><th className="border px-2 py-2">S.No</th><th className="border px-2 py-2">Item Description</th><th className="border px-2 py-2 text-right">Qty</th><th className="border px-2 py-2 text-right">Rate (₹)</th><th className="border px-2 py-2 text-right">Amount (₹)</th><th className="border px-2 py-2">Remove</th></tr></thead>
                <tbody>{items.map((it,idx)=>{const line=+(Number(it.qty||0)*Number(it.price||0)).toFixed(2);return(<tr key={it.id} className="even:bg-white odd:bg-gray-50"><td className="border px-2 py-2 align-top">{idx+1}</td><td className="border px-2 py-2"><input className="w-full border border-gray-200 p-1 rounded text-sm" value={it.name} onChange={e=>updateItem(it.id,"name",e.target.value)} placeholder="Item name" /></td><td className="border px-2 py-2 text-right"><input type="number" min="0" className="w-20 border border-gray-200 p-1 rounded text-sm text-right" value={it.qty} onChange={e=>updateItem(it.id,"qty",e.target.value)} /></td><td className="border px-2 py-2 text-right"><input type="number" min="0" className="w-24 border border-gray-200 p-1 rounded text-sm text-right" value={it.price} onChange={e=>updateItem(it.id,"price",e.target.value)} /></td><td className="border px-2 py-2 text-right align-top">₹ {line.toFixed(2)}</td><td className="border px-2 py-2 text-center"><button onClick={()=>removeItem(it.id)} className="text-red-600">✖</button></td></tr>);})}</tbody>
              </table>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <div className="text-sm text-gray-700 px-3 py-2 rounded border border-gray-200">Subtotal: <strong>₹ {subtotal.toFixed(2)}</strong></div>
            <button onClick={generateBill} className="px-4 py-2 bg-black text-white rounded font-semibold">Generate Bill</button>
          </div>
        </div>

        {generated && (
          <div ref={printRef} className="shadow rounded-lg overflow-hidden print-area" style={{border:"1px solid #e6e6e6"}}>
            <div className="bg-white p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="text-2xl font-bold text-black">{firmName||"Firm Name"}</div>
                  {firmAddress? <div className="text-sm text-gray-700 mt-1">{firmAddress}</div>:null}
                  <div className="text-sm text-gray-600 mt-1">GST: {firmGst||"-"}</div>
                </div>
                <div className="text-right text-sm">
                  <div className="bg-gray-100 px-3 py-2 rounded text-black font-semibold">Tax Invoice</div>
                  <div className="mt-3 text-gray-700">Invoice No: <strong>{invoiceNumber}</strong></div>
                  <div className="text-gray-700">Invoice Date: <strong>{date}</strong></div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 border-t pt-4">
                <div><div className="text-xs text-gray-700 font-medium">Issued To</div><div className="text-sm text-black font-medium">{customerName||"-"}</div><div className="text-xs text-gray-600">Phone: {customerPhone||"-"}</div></div>
                <div className="text-right text-sm text-gray-700"><div>POS: Local</div></div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead><tr className="bg-gray-100 text-gray-700"><th className="border px-2 py-2">S.No</th><th className="border px-2 py-2">Item Description</th><th className="border px-2 py-2 text-right">Qty</th><th className="border px-2 py-2 text-right">Rate (₹)</th><th className="border px-2 py-2 text-right">Tax</th><th className="border px-2 py-2 text-right">Amount (₹)</th></tr></thead>
                  <tbody>{items.map((it,idx)=>{const line=+(Number(it.qty||0)*Number(it.price||0)).toFixed(2);return(<tr key={it.id} className="even:bg-white odd:bg-gray-50"><td className="border px-2 py-2 align-top">{idx+1}</td><td className="border px-2 py-2 align-top text-sm">{it.name||"-"}</td><td className="border px-2 py-2 text-right align-top">{it.qty}</td><td className="border px-2 py-2 text-right align-top">₹ {Number(it.price||0).toFixed(2)}</td><td className="border px-2 py-2 text-right align-top">{gstPercent}%</td><td className="border px-2 py-2 text-right align-top">₹ {line.toFixed(2)}</td></tr>);})}</tbody>
                </table>
              </div>

              <div className="mt-4 flex flex-col md:flex-row gap-4">
                <div className="flex-1 text-sm text-gray-700"><div className="mb-2 font-medium">Amount (in words):</div><div className="text-sm text-gray-900">{amountToWords(grandTotal)}</div></div>
                <div className="w-full md:w-80 border p-3 bg-gray-50"><div className="flex justify-between text-sm mb-1"><div>Sub Total</div><div>₹ {subtotal.toFixed(2)}</div></div><div className="flex justify-between text-sm mb-1"><div>CGST ({(gstPercent/2).toFixed(2)}%)</div><div>₹ {cgst.toFixed(2)}</div></div><div className="flex justify-between text-sm mb-1"><div>SGST ({(gstPercent/2).toFixed(2)}%)</div><div>₹ {sgst.toFixed(2)}</div></div><div className="border-t mt-2 pt-2 flex justify-between font-semibold text-lg"><div>Total</div><div>₹ {grandTotal.toFixed(2)}</div></div></div>
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="text-sm text-gray-700"><div className="font-medium mb-2">Terms & Conditions</div><ol className="list-decimal list-inside text-xs text-gray-600">{terms.map((t,i)=><li key={i} className="mb-1">{t}</li>)}</ol></div>
                <div className="text-right text-sm"><div className="mb-8 text-gray-700">For {firmName||"Firm Name"}</div><div className="inline-block border-t border-gray-400 pt-2 text-xs text-gray-700">Authorized Signature</div></div>
              </div>

              <div className="mt-4 text-xs text-gray-600 border-t pt-3">{firmPhone? <div>Contact: {firmPhone}</div>:null}<div className="mt-1">This is a system generated invoice.</div></div>
              <div className="mt-4"><button onClick={handlePrint} className="px-4 py-2 bg-black text-white rounded w-full">Print Invoice</button></div>
            </div>
          </div>
        )}
      </div>

      <style>{`@media print{body *{visibility:hidden!important}.print-area,.print-area *{visibility:visible!important}.print-area{position:absolute;left:0;top:0;width:100%}.print-area{box-shadow:none!important;border:none!important}}`}</style>
    </div>
  );
}
