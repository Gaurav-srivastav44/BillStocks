import express from "express";
import Product from "../models/Product.js";

const router = express.Router();

/* CREATE PRODUCT (scoped to logged-in user) */
router.post("/", async (req, res) => {
  try {
    const product = await Product.create({
      ...req.body,
      createdBy: req.user._id,
    });
    res.status(201).json({ data: product });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

/* GET ALL PRODUCTS FOR THIS USER */
router.get("/", async (req, res) => {
  try {
    const products = await Product.find({ createdBy: req.user._id })
      .sort({ createdAt: -1 });
    res.json({ data: products });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch products" });
  }
});

/* GET SINGLE PRODUCT (owned by user) */
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      createdBy: req.user._id,
    });
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json({ data: product });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch product" });
  }
});

/* UPDATE PRODUCT (owned by user) */
router.put("/:id", async (req, res) => {
  try {
    const product = await Product.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json({ data: product });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

/* DELETE PRODUCT (owned by user) */
router.delete("/:id", async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.user._id,
    });
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json({ data: product });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete product" });
  }
});

export default router;