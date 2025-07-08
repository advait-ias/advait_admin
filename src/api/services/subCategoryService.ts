import api from "../axiosConfig";
import { endpoints } from "../endpoints";

export const fetchAllSubCategories = async () => {
  const res = await api.get(endpoints.subCategory.list);
  return res.data;
};

export const getSubCategoryById = (id: string) =>
  api.get(endpoints.subCategory.detail(id));

export const createSubCategory = (data: any) =>
  api.post(endpoints.subCategory.create, data);

export const updateSubCategory = (id: string, data: any) =>
  api.put(endpoints.subCategory.update(id), data);

export const deleteSubCategory = (id: string) =>
  api.delete(endpoints.subCategory.delete(id));
