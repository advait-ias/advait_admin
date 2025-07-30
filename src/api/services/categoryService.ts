import api from "../axiosConfig";
import { endpoints } from "../endpoints";

export const fetchAllCategories = async () => {
  const res = await api.get(endpoints.category.list);
  return res.data;
};

export const getCategoryById = (id: string) =>
  api.get(endpoints.category.detail(id));

export const createCategory = (data: any) =>
  api.post(endpoints.category.create, data);

export const updateCategory = (id: string, data: any) =>
  api.patch(endpoints.category.update(id), data);

export const deleteCategory = (id: string) =>
  api.delete(endpoints.category.delete(id));
