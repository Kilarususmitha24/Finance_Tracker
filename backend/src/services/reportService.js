import Transaction from "../models/Transaction.js";
import { startOfMonth, endOfMonth } from "date-fns";

export const getTransactions = async (userId, filters) => {
  const query = { userId };

  if (filters.category) query.category = filters.category;
  if (filters.type) query.type = filters.type;

  if (filters.startDate && filters.endDate) {
    query.date = {
      $gte: new Date(filters.startDate),
      $lte: new Date(filters.endDate)
    };
  }

  return await Transaction.find(query).sort({ date: -1 });
};

export const getMonthlySummary = async (userId) => {
  const year = new Date().getFullYear();

  const data = await Transaction.aggregate([
    {
      $match: {
        userId,
        date: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`)
        }
      }
    },
    {
      $group: {
        _id: { month: { $month: "$date" }, type: "$type" },
        total: { $sum: "$amount" }
      }
    }
  ]);

  return data;
};

export const getCategorySummary = async (userId, filters) => {
  const match = { userId };

  if (filters.type) match.type = filters.type;

  const data = await Transaction.aggregate([
    { $match: match },
    {
      $group: {
        _id: "$category",
        total: { $sum: "$amount" }
      }
    },
    { $sort: { total: -1 } }
  ]);

  return data;
};
