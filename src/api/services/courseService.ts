// src/api/services/courseService.ts
import api from '../axiosConfig';
import { endpoints } from '../endpoints';

export interface Course extends Document {
  _id: string;
  title: string;
  description: string;
  price: number;
  discount: number;
  discountType: string;
  discountStartDate: Date;
  discountEndDate: Date;
  discountDuration: number;
  duration: number;
  limit: number;
  startDate: Date;
  endDate: Date;
  coverImage: string;
  exams: string;
  isActive: boolean;
}

export const fetchAllCourses = async () => {
  const res = await api.get(endpoints.course.list);
  return res.data;
};

export const getCourseById = (id: string) =>
  api.get(endpoints.course.detail(id));


export const createCourse = async (data: FormData): Promise<Course> => {
  const res = await api.post<Course>(endpoints.course.create, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

export const updateCourse = (id: string, data: any) =>
  api.put(endpoints.course.update(id), data);

export const deleteCourse = (id: string) =>
  api.delete(endpoints.course.delete(id));
