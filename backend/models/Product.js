import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    sku: { type: String, required: true, unique: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true },
    category: String,
    gstRate: { type: Number, default: 0 },
    description: String,
    imageUrl: String,
    // owner of this product (for per-user isolation)
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);