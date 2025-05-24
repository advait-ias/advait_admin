// src/api/services/testService.ts
import api from '../axiosConfig';
import { endpoints } from '../endpoints';

export const fetchAllTests = async () => {
  const res = await api.get(endpoints.test.list);
  return res.data;
};

export const getTestById = (id: string) =>
  api.get(endpoints.test.detail(id));

export const createTest = (data: any) =>
  api.post(endpoints.test.create, data);

export const updateTest = (id: string, data: any) =>
  api.put(endpoints.test.update(id), data);

export const deleteTest = (id: string) =>
  api.delete(endpoints.test.delete(id));
