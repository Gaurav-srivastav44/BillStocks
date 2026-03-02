import express from "express";
import Product from "../models/Product.js";
import Invoice from "../models/Invoice.js";
import Purchase from "../models/Purchase.js";
import FinanceEntry from "../models/FinanceEntry.js";

const router = express.Router();

router.get("/stock-status", async (req, res) => {
  try {
    const products = await Product.find().select("name sku category stock").sort({ name: 1 }).lean();
    res.json({ data: products });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch stock status" });
  }
});

router.get("/stock-summary", async (req, res) => {
  try {
    const products = await Product.find().select("category stock").lean();
    const summary = {};
    for (const p of products) {
      const cat = p.category || "Uncategorized";
      summary[cat] = (summary[cat] || 0) + (p.stock || 0);
    }
    res.json({ data: summary });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch stock summary" });
  }
});

router.get("/sales/billwise", async (req, res) => {
  try {
    const invoices = await Invoice.find({ userId: req.user._id })
      .populate("accountId", "name")
      .sort({ createdAt: -1 })
      .lean();
    const list = invoices.map((inv) => ({
      _id: inv._id,
      invoiceNumber: inv.invoiceNumber,
      customerName: inv.customerName,
      account: inv.accountId ? { name: inv.accountId.name } : null,
      createdAt: inv.createdAt,
      grandTotal: inv.grandTotal,
    }));
    res.json({ data: list });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch sales" });
  }
});

router.get("/sales/detailed", async (req, res) => {
  try {
    const invoices = await Invoice.find({ userId: req.user._id }).sort({ createdAt: -1 }).lean();
    const detailed = [];
    for (const inv of invoices) {
      for (const it of inv.items || []) {
        detailed.push({
          invoiceNumber: inv.invoiceNumber,
          date: inv.createdAt,
          item: it.name || "Item",
          qty: it.quantity,
          price: it.price,
          lineTotal: it.lineTotal,
        });
      }
    }
    res.json({ data: detailed });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch sales detailed" });
  }
});

router.get("/purchase/billwise", async (req, res) => {
  try {
    const purchases = await Purchase.find()
      .populate("supplierId", "name")
      .sort({ createdAt: -1 })
      .lean();
    const list = purchases.map((p) => ({
      _id: p._id,
      purchaseNumber: p.purchaseNumber,
      supplier: p.supplierId ? { name: p.supplierId.name } : null,
      createdAt: p.createdAt,
      grandTotal: p.grandTotal,
    }));
    res.json({ data: list });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch purchases" });
  }
});

router.get("/purchase/detailed", async (req, res) => {
  try {
    const purchases = await Purchase.find().sort({ createdAt: -1 }).lean();
    const detailed = [];
    for (const p of purchases) {
      for (const it of p.items || []) {
        detailed.push({
          purchaseNumber: p.purchaseNumber,
          date: p.createdAt,
          item: it.name || "Item",
          qty: it.quantity,
          price: it.price,
          lineTotal: it.lineTotal,
        });
      }
    }
    res.json({ data: detailed });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch purchase detailed" });
  }
});

router.get("/cashbook", async (req, res) => {
  try {
    const dateStr = req.query.date || new Date().toISOString().slice(0, 10);
    const startOfDay = new Date(dateStr);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(dateStr);
    endOfDay.setHours(23, 59, 59, 999);

    const [receipts, payments, previousReceipts, previousPayments] = await Promise.all([
      FinanceEntry.find({ type: "receipt", date: { $gte: startOfDay, $lte: endOfDay } })
        .populate("accountId", "name")
        .sort({ date: 1 })
        .lean(),
      FinanceEntry.find({ type: "payment", date: { $gte: startOfDay, $lte: endOfDay } })
        .populate("accountId", "name")
        .sort({ date: 1 })
        .lean(),
      FinanceEntry.find({ type: "receipt", date: { $lt: startOfDay } }).select("amount").lean(),
      FinanceEntry.find({ type: "payment", date: { $lt: startOfDay } }).select("amount").lean(),
    ]);

    const openingBalance =
      previousReceipts.reduce((s, r) => s + (r.amount || 0), 0) -
      previousPayments.reduce((s, p) => s + (p.amount || 0), 0);
    const receiptTotal = receipts.reduce((s, r) => s + (r.amount || 0), 0);
    const paymentTotal = payments.reduce((s, p) => s + (p.amount || 0), 0);
    const closingBalance = openingBalance + receiptTotal - paymentTotal;

    const data = {
      openingBalance,
      receipts: receipts.map((r) => ({
        _id: r._id,
        date: r.date,
        account: r.accountId ? { name: r.accountId.name } : null,
        amount: r.amount,
      })),
      payments: payments.map((p) => ({
        _id: p._id,
        date: p.date,
        account: p.accountId ? { name: p.accountId.name } : null,
        amount: p.amount,
      })),
      closingBalance,
    };
    res.json({ data });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch cashbook" });
  }
});

export default router;
