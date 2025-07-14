import api from "../axiosConfig";
import { endpoints } from "../endpoints";

export const fetchAllLanguages = async () => {
  const res = await api.get(endpoints.language.list);
  return res.data;
};

export const getLanguageById = (id: string) =>
  api.get(endpoints.language.detail(id));

export const createLanguage = (data: any) =>
  api.post(endpoints.language.create, data);

export const updateLanguage = (id: string, data: any) =>
  api.put(endpoints.language.update(id), data);

export const deleteLanguage = (id: string) =>
  api.delete(endpoints.language.delete(id));
