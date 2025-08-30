import api from "../axiosConfig";
import { endpoints } from "../endpoints";

export interface User {
  _id: string;
  mobileNumber: string;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
}

// ✅ GET all users
export const fetchAllUsers = async (): Promise<User[]> => {
  const res = await api.get<User[]>(endpoints.user.list);
  return res.data;
};

// ✅ GET user by ID
export const getUserById = async (id: string): Promise<User> => {
  const res = await api.get<User>(endpoints.user.detail(id));
  return res.data;
};

// ✅ POST create user
export const createUser = async (data: Partial<User>): Promise<User> => {
  const res = await api.post<User>(endpoints.user.create, data);
  return res.data;
};

// ✅ PUT update user
export const updateUser = async (
  id: string,
  data: Partial<User>
): Promise<User> => {
  const res = await api.patch<User>(endpoints.user.update(id), data);
  return res.data;
};

// ✅ DELETE user
export const deleteUser = async (id: string): Promise<{ message: string }> => {
  const res = await api.delete<{ message: string }>(endpoints.user.delete(id));
  return res.data;
};
