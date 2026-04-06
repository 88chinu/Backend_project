import Record from "../models/Record.js";

export const getRecords = async (query) => {
  const {
    page = 1,
    limit = 10,
    type,
    category,
    startDate,
    endDate,
    search,
  } = query;

  const filter = {};

  if (type) filter.type = type;
  if (category) filter.category = category;

  if (startDate || endDate) {
    filter.date = {};
    if (startDate) filter.date.$gte = new Date(startDate);
    if (endDate) filter.date.$lte = new Date(endDate);
  }

  if (search) {
    filter.notes = { $regex: search, $options: "i" };
  }

  const records = await Record.find(filter)
    .sort({ date: -1 })
    .skip((page - 1) * limit)
    .limit(Number(limit));

  const total = await Record.countDocuments(filter);

  return { total, page, records };
};

export const getRecordById = async (id) => {
  return await Record.findById(id);
};

export const createRecord = async (data) => {
  return await Record.create(data);
};

export const updateRecord = async (id, data) => {
  return await Record.findByIdAndUpdate(id, data, { new: true });
};

export const deleteRecord = async (id) => {
  return await Record.findByIdAndUpdate(id, { isDeleted: true });
};