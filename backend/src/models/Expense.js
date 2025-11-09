import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    description: { 
      type: String, 
      required: [true, "Description is required"] 
    },
    title: { 
      type: String,
      default: "" // Default to empty string, not required
    },
    amount: { 
      type: Number, 
      required: [true, "Amount is required"] 
    },
    category: { 
      type: String, 
      required: [true, "Category is required"] 
    },
    paymentMethod: { 
      type: String, 
      default: "Cash" 
    },
    date: { 
      type: Date, 
      required: true, 
      default: Date.now 
    },
    notes: { 
      type: String, 
      default: "" 
    },
  },
  { timestamps: true }
);

export default mongoose.model("Expense", expenseSchema);
