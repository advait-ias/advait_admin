// src/api/services/courseService.ts
import api from '../axiosConfig';
import { endpoints } from '../endpoints';

export const fetchAllCourses = async () => {
  const res = await api.get(endpoints.course.list);
  return res.data;
};

export const getCourseById = (id: string) =>
  api.get(endpoints.course.detail(id));

export const createCourse = (data: any) =>
  api.post(endpoints.course.create, data);

export const updateCourse = (id: string, data: any) =>
  api.put(endpoints.course.update(id), data);

export const deleteCourse = (id: string) =>
  api.delete(endpoints.course.delete(id));
