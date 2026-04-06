import Record from "../models/Record.js";

export const getSummary = async () => {
  const result = await Record.aggregate([
    {
      $group: {
        _id: "$type",
        total: { $sum: "$amount" },
      },
    },
  ]);

  let income = 0;
  let expense = 0;

  result.forEach((r) => {
    if (r._id === "income") income = r.total;
    if (r._id === "expense") expense = r.total;
  });

  return {
    income,
    expense,
    balance: income - expense,
  };
};

export const getCategoryBreakdown = async () => {
  return await Record.aggregate([
    {
      $group: {
        _id: "$category",
        total: { $sum: "$amount" },
      },
    },
  ]);
};

export const getMonthlyTrend = async (months = 6) => {
  const date = new Date();
  date.setMonth(date.getMonth() - months);

  return await Record.aggregate([
    {
      $match: { date: { $gte: date } },
    },
    {
      $group: {
        _id: {
          year: { $year: "$date" },
          month: { $month: "$date" },
          type: "$type",
        },
        total: { $sum: "$amount" },
      },
    },
    {
      $sort: { "_id.year": 1, "_id.month": 1 },
    },
  ]);
};

export const getWeeklyBreakdown = async () => {
  const start = new Date();
  start.setDate(1);

  return await Record.aggregate([
    {
      $match: { date: { $gte: start } },
    },
    {
      $group: {
        _id: {
          week: { $week: "$date" },
          type: "$type",
        },
        total: { $sum: "$amount" },
      },
    },
  ]);
};

export const getRecentRecords = async (limit = 10) => {
  return await Record.find()
    .sort({ createdAt: -1 })
    .limit(Number(limit));
};