import Joi from "joi";

export const reportFilterSchema = Joi.object({
  startDate: Joi.date().optional(),
  endDate: Joi.date().optional(),
  category: Joi.string().optional(),
  type: Joi.string().valid('income', 'expense').optional(),
});
