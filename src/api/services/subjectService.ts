import api from "../axiosConfig";
import { endpoints } from "../endpoints";

export const fetchAllSubjects = async () => {
  const res = await api.get(endpoints.subject.list);
  return res.data;
};

export const getSubjectById = (id: string) =>
  api.get(endpoints.subject.detail(id));

export const createSubject = (data: any) =>
  api.post(endpoints.subject.create, data);

export const updateSubject = (id: string, data: any) =>
  api.patch(endpoints.subject.update(id), data);

export const deleteSubject = (id: string) =>
  api.delete(endpoints.subject.delete(id));
