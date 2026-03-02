import dotenv from "dotenv";
dotenv.config();   // 👈 MUST BE FIRST

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import passport from "./config/passport.js";
import authRoutes from "./routes/auth.js";
import authMiddleware from "./middleware/authMiddleware.js";
import "./models/User.js";
import "./models/Account.js";
import "./models/Product.js";
import "./models/Invoice.js";
import "./models/Purchase.js";
import "./models/FinanceEntry.js";
import productRoutes from "./routes/product.js";
import accountRoutes from "./routes/account.js";
import invoiceRoutes from "./routes/invoiceRoutes.js";
import purchaseRoutes from "./routes/purchase.js";
import financeRoutes from "./routes/finance.js";
import statsRoutes from "./routes/stats.js";
import reportsRoutes from "./routes/reports.js";
import uploadRoutes from "./routes/upload.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(passport.initialize());
app.use("/uploads", express.static("uploads"));

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

app.use("/api/auth", authRoutes);

// protect business routes so we know which user is active
app.use("/api/products", authMiddleware, productRoutes);
app.use("/api/accounts", authMiddleware, accountRoutes);
app.use("/api/invoices", authMiddleware, invoiceRoutes);
app.use("/api/purchases", authMiddleware, purchaseRoutes);
app.use("/api/finance", authMiddleware, financeRoutes);
app.use("/api/stats", authMiddleware, statsRoutes);
app.use("/api/reports", authMiddleware, reportsRoutes);
app.use("/api/upload", authMiddleware, uploadRoutes);

app.listen(process.env.PORT || 5000, () =>
  console.log("Server running on port 5000")
);