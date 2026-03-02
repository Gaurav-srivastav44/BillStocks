import mongoose from "mongoose";

const financeEntrySchema = new mongoose.Schema(
  {
    accountId: { type: mongoose.Schema.Types.ObjectId, ref: "Account", required: true },
    type: { type: String, enum: ["receipt", "payment"], required: true },
    amount: { type: Number, required: true },
    date: { type: Date, default: Date.now },
    remarks: String,
  },
  { timestamps: true }
);

export default mongoose.model("FinanceEntry", financeEntrySchema);
