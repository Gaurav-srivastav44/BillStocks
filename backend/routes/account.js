import express from "express";
import Account from "../models/Account.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const accounts = await Account.find().sort({ name: 1 });
    res.json({ data: accounts });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch accounts" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const account = await Account.findById(req.params.id);
    if (!account) return res.status(404).json({ message: "Account not found" });
    res.json({ data: account });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch account" });
  }
});

router.post("/", async (req, res) => {
  try {
    const body = { ...req.body };
    body.balance = Number(body.openingBalance) || 0;
    const account = await Account.create(body);
    res.status(201).json({ data: account });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const body = { ...req.body };
    delete body._id;
    if (typeof body.openingBalance === "number") body.balance = body.openingBalance;
    const account = await Account.findByIdAndUpdate(
      req.params.id,
      body,
      { new: true, runValidators: true }
    );
    if (!account) return res.status(404).json({ message: "Account not found" });
    res.json({ data: account });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default router;
