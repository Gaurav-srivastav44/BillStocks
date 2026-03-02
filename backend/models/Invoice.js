import mongoose from "mongoose";

const invoiceSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },
    invoiceNumber: { type: String, required: true },
    customerName: String,
    accountId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
    },
    discountRate: { type: Number, default: 0 },
    gstRate: { type: Number, default: 0 },
    roundOff: { type: Number, default: 0 },
    subTotal: Number,
    discountAmount: { type: Number, default: 0 },
    gstAmount: { type: Number, default: 0 },
    grandTotal: Number,
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
        quantity: Number,
        price: Number,
        gstRate: Number,
        name: String,
        lineTotal: Number,
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Invoice", invoiceSchema);