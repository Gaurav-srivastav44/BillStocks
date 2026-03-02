import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String }, // empty for Google users
    googleId: { type: String },
    avatar: { type: String },

    // Firm / billing details (used on invoices)
    firmName: { type: String },
    firmGst: { type: String },
    firmAddress: { type: String },
    firmPhone: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);