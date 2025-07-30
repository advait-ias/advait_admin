import api from "../axiosConfig";
import { endpoints } from "../endpoints";

export interface Faculty {
  _id: string;
  name: string;
  email: string;
  mobile: number;
  gender: string;
  exams: string[];
  courses: string[];
  tests: string[];
  experience: number;
  education: string;
  interviewAppeared: string;
  isVerified: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

// ✅ GET all faculties
export const fetchAllFaculty = async (): Promise<Faculty[]> => {
  const res = await api.get<Faculty[]>(endpoints.faculty.list);
  return res.data;
};

// ✅ GET a faculty by ID
export const getFacultyById = async (id: string): Promise<Faculty> => {
  const res = await api.get<Faculty>(endpoints.faculty.detail(id));
  return res.data;
};

// ✅ POST create a new faculty
export const createFaculty = async (data: FormData): Promise<Faculty> => {
  const res = await api.post<Faculty>(endpoints.faculty.create, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

// ✅ PUT update a faculty
export const updateFaculty = async (
  id: string,
  data: Partial<Faculty>
): Promise<Faculty> => {
  const res = await api.patch<Faculty>(endpoints.faculty.update(id), data);
  return res.data;
};

// ✅ DELETE a faculty
export const deleteFaculty = async (
  id: string
): Promise<{ message: string }> => {
  const res = await api.delete<{ message: string }>(
    endpoints.faculty.delete(id)
  );
  return res.data;
};
