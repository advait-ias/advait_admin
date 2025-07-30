import api from "../axiosConfig";
import { endpoints } from "../endpoints";

export const fetchAllTags = async () => {
  const res = await api.get(endpoints.tag.list);
  return res.data;
};

export const getTagById = (id: string) => api.get(endpoints.tag.detail(id));

export const createTag = (data: any) => api.post(endpoints.tag.create, data);

export const updateTag = (id: string, data: any) =>
  api.patch(endpoints.tag.update(id), data);

export const deleteTag = (id: string) => api.delete(endpoints.tag.delete(id));
