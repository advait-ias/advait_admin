import api from "../axiosConfig";
import { endpoints } from "../endpoints";

export const fetchAllPYQs = async () => {
  const res = await api.get(endpoints.pyq.list);
  return res.data;
};

export const getPYQById = (id: string) =>
  api.get(endpoints.pyq.detail(id));

export const createPYQ = (data: any) =>
  api.post(endpoints.pyq.create, data);

export const updatePYQ = (id: string, data: any) =>
  api.patch(endpoints.pyq.update(id), data);

export const deletePYQ = (id: string) =>
  api.delete(endpoints.pyq.delete(id));
