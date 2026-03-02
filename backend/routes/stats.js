import express from "express";
import Product from "../models/Product.js";
import Invoice from "../models/Invoice.js";

const router = express.Router();

router.get("/summary", async (req, res) => {
  try {
    const userId = req.user?._id;

    const [totalProducts, lowStock, invoices, todayStart] = await Promise.all([
      Product.countDocuments(userId ? { createdBy: userId } : {}),
      Product.countDocuments(userId ? { createdBy: userId, stock: { $lt: 10 } } : { stock: { $lt: 10 } }),
      Invoice.find(userId ? { userId } : {}).select("grandTotal createdAt").lean(),
      new Date(new Date().toISOString().slice(0, 10)),
    ]);

    const totalSales = invoices.reduce((s, i) => s + (Number(i.grandTotal) || 0), 0);
    const todayInvoices = invoices.filter((i) => new Date(i.createdAt) >= todayStart).length;

    res.json({
      data: {
        totalProducts,
        totalSales,
        lowStock,
        todayInvoices,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch summary" });
  }
});

export default router;
