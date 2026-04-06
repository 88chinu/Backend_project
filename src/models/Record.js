import mongoose from "mongoose";

const recordSchema = new mongoose.Schema(
  {
    amount: Number,
    type: { type: String, enum: ["income", "expense"] },
    category: String,
    date: Date,
    notes: String,
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// hide deleted records
recordSchema.pre("find", function () {
  this.where({ isDeleted: false });
});

export default mongoose.model("Record", recordSchema);