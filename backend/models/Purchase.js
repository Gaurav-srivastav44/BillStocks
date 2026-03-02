import mongoose from "mongoose";

const purchaseSchema = new mongoose.Schema(
  {
    purchaseNumber: { type: String, required: true },
    supplierId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
      required: true,
    },
    items: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        quantity: Number,
        price: Number,
        name: String,
        lineTotal: Number,
      },
    ],
    gstRate: { type: Number, default: 0 },
    freight: { type: Number, default: 0 },
    miscCharges: { type: Number, default: 0 },
    grandTotal: Number,
    notes: String,
  },
  { timestamps: true }
);

export default mongoose.model("Purchase", purchaseSchema);
