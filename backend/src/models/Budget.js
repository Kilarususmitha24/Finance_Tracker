import mongoose from "mongoose";

const budgetSchema = new mongoose.Schema(
  {
    user: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User",
      required: true 
    },
    category: { 
      type: String, 
      required: true 
    },
    budget: { 
      type: Number, 
      required: true 
    }, // Changed from limit to budget
    limit: Number, // Keep for backward compatibility
    spent: { 
      type: Number, 
      default: 0 
    },
    month: String,
  },
  { timestamps: true }
);

export default mongoose.model("Budget", budgetSchema);
