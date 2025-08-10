// src/api/services/testService.ts
import api from "../axiosConfig";
import { endpoints } from "../endpoints";

export const fetchAllMCQs = async () => {
  const res = await api.get(endpoints.mcq.list);
  return res.data;
};

export const getMCQById = (id: string) => api.get(endpoints.mcq.detail(id));

export const createMCQ = (data: any) => api.post(endpoints.mcq.create, data);

export const updateMCQ = (id: string, data: any) =>
  api.patch(endpoints.mcq.update(id), data);

export const deleteMCQ = (id: string) => api.delete(endpoints.mcq.delete(id));
