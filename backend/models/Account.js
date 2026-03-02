import mongoose from "mongoose";

const accountSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    group: {
      type: String,
      enum: ["Sundry Debtors", "Sundry Creditors"],
      default: "Sundry Debtors",
    },
    openingBalance: { type: Number, default: 0 },
    balance: { type: Number, default: 0 },
    startDate: Date,
    endDate: Date,
    address: {
      street: String,
      city: String,
      state: String,
      pin: String,
    },
    contacts: {
      phone: String,
      mobile: String,
      email: String,
    },
    gstin: String,
    pan: String,
    tin: String,
    remarks: String,
    creditLimit: { type: Number, default: 0 },
    creditDays: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    interest: { type: Number, default: 0 },
    caseQty: { type: Number, default: 0 },
    freight: { type: Number, default: 0 },
    wastage: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("Account", accountSchema);
