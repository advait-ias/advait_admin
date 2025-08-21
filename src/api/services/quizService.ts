// src/api/services/testService.ts
import api from "../axiosConfig";
import { endpoints } from "../endpoints";

export const fetchAllQuizzes = async () => {
  const res = await api.get(endpoints.quiz.list);
  return res.data;
};

export const getQuizById = (id: string) => api.get(endpoints.quiz.detail(id));

export const createQuiz = async (quizData: any) => {
  const res = await api.post("/quiz", quizData); // send JSON
  return res.data;
};

export const updateQuiz = (id: string, data: any) =>
  api.patch(endpoints.quiz.update(id), data);

export const deleteQuiz = (id: string) => api.delete(endpoints.quiz.delete(id));
