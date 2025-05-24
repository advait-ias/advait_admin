// src/api/services/studentService.ts
import api from "../axiosConfig";
import { endpoints } from "../endpoints";

export interface Student {
    _id: string;
    name: string;
    email: string;
    mobile: number;
    gender: string;
    exams: string[];
    courses: string[];
    tests: string[];
    activity: string[];
    isVerified: boolean;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    __v: number;
}

// ✅ GET all students
export const fetchAllStudents = async (): Promise<Student[]> => {
    const res = await api.get<Student[]>(endpoints.student.list);
    return res.data;
};

// ✅ GET student by ID
export const getStudentById = async (id: string): Promise<Student> => {
    const res = await api.get<Student>(endpoints.student.detail(id));
    return res.data;
};

// ✅ POST create student
export const createStudent = async (data: Partial<Student>): Promise<Student> => {
    const res = await api.post<Student>(endpoints.student.create, data);
    return res.data;
};

// ✅ PUT update student
export const updateStudent = async (id: string, data: Partial<Student>): Promise<Student> => {
    const res = await api.put<Student>(endpoints.student.update(id), data);
    return res.data;
};

// ✅ DELETE student
export const deleteStudent = async (id: string): Promise<{ message: string }> => {
    const res = await api.delete<{ message: string }>(endpoints.student.delete(id));
    return res.data;
};
