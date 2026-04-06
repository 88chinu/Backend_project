import User from "../models/User.js";

export const getUsers = async (query) => {
  const { page = 1, limit = 10, role, status } = query;

  const filter = {};
  if (role) filter.role = role;
  if (status) filter.status = status;

  const users = await User.find(filter)
    .skip((page - 1) * limit)
    .limit(Number(limit));

  const total = await User.countDocuments(filter);

  return { total, page, users };
};

export const getUserById = async (id) => {
  return await User.findById(id);
};

export const updateUser = async (id, data) => {
  return await User.findByIdAndUpdate(id, data, { new: true });
};

export const deleteUser = async (id) => {
  return await User.findByIdAndDelete(id);
};