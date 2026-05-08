import express from "express";
import Invoice from "../models/Invoice.js";
import Product from "../models/Product.js";
import PDFDocument from "pdfkit";
import multer from "multer";
import sendInvoiceMail from "../utils/sendInvoiceMail.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Generate invoice numbers separately for each user
async function getNextInvoiceNumber(userId) {
  const count = await Invoice.countDocuments({ userId });
  const pad = String(count + 1).padStart(4, "0");
  return `INV-${pad}`;
}

function computeTotals(items, discountRate, gstRate, roundOff) {
  const subTotal = items.reduce((s, i) => s + (Number(i.price) || 0) * (Number(i.quantity) || 0), 0);
  const discountAmount = subTotal * ((Number(discountRate) || 0) / 100);
  const taxable = subTotal - discountAmount;
  let gstAmount = 0;
  const globalGst = Number(gstRate) || 0;
  if (globalGst > 0) {
    gstAmount = taxable * (globalGst / 100);
  } else {
    gstAmount = items.reduce((s, i) => {
      const itemTaxable = (Number(i.price) || 0) * (Number(i.quantity) || 0);
      const rate = Number(i.gstRate) || 0;
      return s + itemTaxable * (rate / 100);
    }, 0);
  }
  const grandTotal = taxable + gstAmount + (Number(roundOff) || 0);
  return { subTotal, discountAmount, gstAmount, grandTotal };
}

router.post("/", async (req, res) => {
  try {
    const { customerName, customerEmail, accountId, discountRate, gstRate, roundOff, items } =
      req.body;
    if (!items || !items.length) {
      return res.status(400).json({ success: false, message: "At least one item required" });
    }
    if (!customerEmail) {
      return res.status(400).json({ success: false, message: "Customer email is required" });
    }

    const totals = computeTotals(items, discountRate, gstRate, roundOff);
    const invoiceNumber = await getNextInvoiceNumber(req.user._id);

    const invoiceItems = [];
    for (const it of items) {
      const product = await Product.findById(it.productId);
      const qty = Number(it.quantity) || 0;
      const price = Number(it.price) || 0;
      const lineTotal = price * qty;
      invoiceItems.push({
        productId: it.productId,
        quantity: qty,
        price,
        gstRate: Number(it.gstRate) || 0,
        name: product?.name || "Item",
        lineTotal,
      });
      if (product) {
        product.stock = Math.max(0, (product.stock || 0) - qty);
        await product.save();
      }
    }

    const invoice = await Invoice.create({
      userId: req.user._id,
      invoiceNumber,
      customerName: customerName || "Walk-in Customer",
      customerEmail,
      accountId: accountId || undefined,
      discountRate: Number(discountRate) || 0,
      gstRate: Number(gstRate) || 0,
      roundOff: Number(roundOff) || 0,
      subTotal: totals.subTotal,
      discountAmount: totals.discountAmount,
      gstAmount: totals.gstAmount,
      grandTotal: totals.grandTotal,
      items: invoiceItems,
    });

    const doc = new PDFDocument({ margin: 40 });
    const buffers = [];

    doc.on("data", (chunk) => buffers.push(chunk));

    const pdfPromise = new Promise((resolve) => {
      doc.on("end", () => {
        resolve(Buffer.concat(buffers));
      });
    });

    doc.fontSize(24).fillColor("#2563eb").text("BillStocks Invoice", {
      align: "center",
    });

    doc.moveDown(2);

    doc
      .fontSize(14)
      .fillColor("black")
      .text(`Invoice Number: ${invoice.invoiceNumber}`)
      .text(`Customer Name: ${invoice.customerName}`)
      .text(`Customer Email: ${invoice.customerEmail}`)
      .text(`Total Amount: Rs.${invoice.grandTotal}`)
      .text(`Date: ${new Date().toLocaleDateString()}`);

    doc.moveDown(2);

    doc.fontSize(18).fillColor("#2563eb").text("Products");

    invoiceItems.forEach((item, index) => {
      doc
        .fontSize(13)
        .fillColor("black")
        .text(`${index + 1}. ${item.name} | Qty: ${item.quantity} | Price: Rs.${item.price}`);
    });

    doc.moveDown(3);

    doc.fontSize(14).fillColor("green").text("Thank you for choosing BillStocks!", {
      align: "center",
    });

    doc.end();

    const pdfBuffer = await pdfPromise;

    await sendInvoiceMail(
      invoice.customerEmail,
      invoice.customerName,
      invoice.invoiceNumber,
      pdfBuffer
    );

    res.status(201).json({ success: true, data: invoice });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message || "Failed to create invoice" });
  }
});

router.get("/", async (req, res) => {
  try {
    const invoices = await Invoice.find({ userId: req.user._id })
      .populate("accountId", "name")
      .sort({ createdAt: -1 })
      .lean();
    const list = invoices.map((inv) => ({
      ...inv,
      account: inv.accountId ? { name: inv.accountId.name } : null,
      customerName: inv.customerName || (inv.accountId && inv.accountId.name) || "-",
    }));
    res.json({ data: list });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch invoices" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const invoice = await Invoice.findOne({
      _id: req.params.id,
      userId: req.user._id,
    })
      .populate("accountId", "name")
      .lean();
    if (!invoice) return res.status(404).json({ message: "Invoice not found" });
    const result = {
      ...invoice,
      account: invoice.accountId ? { name: invoice.accountId.name } : null,
      customerName: invoice.customerName || (invoice.accountId && invoice.accountId.name) || "Customer",
    };
    res.json({ data: result });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch invoice" });
  }
});

router.post("/send-mail", upload.single("pdf"), async (req, res) => {
  try {
    const { customerEmail, customerName, invoiceNumber } = req.body;
    const pdfFile = req.file;

    if (!customerEmail || !customerName || !invoiceNumber) {
      return res.status(400).json({ message: "Missing invoice email fields" });
    }
    if (!pdfFile?.buffer) {
      return res.status(400).json({ message: "Invoice PDF is required" });
    }

    await sendInvoiceMail(customerEmail, customerName, invoiceNumber, pdfFile.buffer);

    res.json({ message: "Invoice email sent" });
  } catch (error) {
    console.log("SEND MAIL ROUTE ERROR:", error);
    res.status(500).json({ message: "Failed to send invoice email" });
  }
});

export default router;
