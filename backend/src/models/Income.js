import mongoose from "mongoose";

const incomeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    source: {
      type: String,
      required: [true, "Income source is required"],
      trim: true,
    },

    amount: {
      type: Number,
      required: [true, "Amount is required"],
      min: 1,
    },

    category: {
      type: String,
      required: true,
      enum: [
        "Salary",
        "Freelance",
        "Business",
        "Investments",
        "Rental",
        "Dividends",
        "Pension",
        "Social Security",
        "Gifts",
        "Other",
      ],
    },

    date: {
      type: Date,
      default: Date.now,
    },

    notes: {
      type: String,
      trim: true,
    },

    status: {
      type: String,
      enum: ["received", "pending", "cancelled"],
      default: "pending",
    },

    isRecurring: {
      type: Boolean,
      default: false,
    },

    recurrence: {
      type: String,
      enum: ["none", "daily", "weekly", "biweekly", "monthly", "quarterly", "yearly"],
      default: "none",
    },

    nextRecurrenceDate: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Income", incomeSchema);
