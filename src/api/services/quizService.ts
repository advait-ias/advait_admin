// src/api/services/testService.ts
import api from "../axiosConfig";
import { endpoints } from "../endpoints";

export const fetchAllQuizzes = async () => {
  const res = await api.get(endpoints.quiz.list);
  return res.data;
};

export const getQuizById = (id: string) => api.get(endpoints.quiz.detail(id));

export const createQuiz = async (data: FormData): Promise<any> => {
  const res = await api.post(endpoints.quiz.create, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

export const updateQuiz = (id: string, data: any) =>
  api.patch(endpoints.quiz.update(id), data);

export const deleteQuiz = (id: string) => api.delete(endpoints.quiz.delete(id));
