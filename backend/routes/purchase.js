import express from "express";
import Purchase from "../models/Purchase.js";
import Product from "../models/Product.js";

const router = express.Router();

async function getNextPurchaseNumber() {
  const count = await Purchase.countDocuments();
  return `PUR-${String(count + 1).padStart(4, "0")}`;
}

router.post("/", async (req, res) => {
  try {
    const { supplierId, items, gstRate, freight, miscCharges, notes } = req.body;
    if (!supplierId || !items?.length) {
      return res.status(400).json({ message: "Supplier and at least one item required" });
    }

    let subTotal = 0;
    const purchaseItems = [];
    for (const it of items) {
      const product = await Product.findById(it.productId);
      const qty = Number(it.quantity) || 0;
      const price = Number(it.price) || 0;
      const lineTotal = price * qty;
      subTotal += lineTotal;
      purchaseItems.push({
        productId: it.productId,
        quantity: qty,
        price,
        name: product?.name || "Item",
        lineTotal,
      });
      if (product) {
        product.stock = (product.stock || 0) + qty;
        await product.save();
      }
    }

    const gstAmount = subTotal * ((Number(gstRate) || 0) / 100);
    const grandTotal = subTotal + gstAmount + (Number(freight) || 0) + (Number(miscCharges) || 0);
    const purchaseNumber = await getNextPurchaseNumber();

    const purchase = await Purchase.create({
      purchaseNumber,
      supplierId,
      items: purchaseItems,
      gstRate: Number(gstRate) || 0,
      freight: Number(freight) || 0,
      miscCharges: Number(miscCharges) || 0,
      grandTotal,
      notes: notes || "",
    });

    res.status(201).json({ data: purchase });
  } catch (err) {
    res.status(500).json({ message: err.message || "Failed to create purchase" });
  }
});

export default router;
