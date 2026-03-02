import express from "express";
import FinanceEntry from "../models/FinanceEntry.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { type } = req.query;
    const filter = type ? { type } : {};
    const entries = await FinanceEntry.find(filter)
      .populate("accountId", "name group")
      .sort({ date: -1, createdAt: -1 })
      .limit(100)
      .lean();
    const list = entries.map((e) => ({
      ...e,
      account: e.accountId ? { name: e.accountId.name, group: e.accountId.group } : null,
    }));
    res.json({ data: list });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch entries" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { accountId, type, amount, date, remarks } = req.body;
    if (!accountId || !type || amount == null) {
      return res.status(400).json({ message: "accountId, type and amount required" });
    }
    if (!["receipt", "payment"].includes(type)) {
      return res.status(400).json({ message: "type must be receipt or payment" });
    }
    const entry = await FinanceEntry.create({
      accountId,
      type,
      amount: Number(amount),
      date: date ? new Date(date) : new Date(),
      remarks: remarks || "",
    });
    const populated = await FinanceEntry.findById(entry._id).populate("accountId", "name");
    res.status(201).json({ data: { ...populated.toObject(), account: populated.accountId } });
  } catch (err) {
    res.status(500).json({ message: err.message || "Failed to create entry" });
  }
});

export default router;
