import api from "../axiosConfig";
import { endpoints } from "../endpoints";

export const fetchAllExams = async () => {
  const res = await api.get(endpoints.exam.list);
  return res.data;
};

export const getExamById = (id: string) => api.get(endpoints.exam.detail(id));

export const createExam = (data: any) => api.post(endpoints.exam.create, data);

export const updateExam = (id: string, data: any) =>
  api.put(endpoints.exam.update(id), data);

export const deleteExam = (id: string) => api.delete(endpoints.exam.delete(id));
