import Joi from "joi";

export const incomeSchema = Joi.object({
  source: Joi.string().required(),
  amount: Joi.number().min(1).required(),
  category: Joi.string().required(),
  date: Joi.date().optional(),
  notes: Joi.string().allow("", null),
  status: Joi.string().valid("received", "pending", "cancelled").optional(),

  isRecurring: Joi.boolean(),
  recurrence: Joi.string().valid(
    "none",
    "daily",
    "weekly",
    "biweekly",
    "monthly",
    "quarterly",
    "yearly"
  ),
}).unknown(false); // Reject unknown fields like "id"
