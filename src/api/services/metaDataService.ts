import api from "../axiosConfig";
import { endpoints } from "../endpoints";

export const fetchMetaData = async () => {
  const res = await api.get(endpoints.metaData.list);
  return res.data;
};

export const createMetaData = async (formData: FormData) => {
  const res = await api.post(endpoints.metaData.create, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const updateMetaData = async (id: string, formData: FormData) => {
  const res = await api.patch(endpoints.metaData.create, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};
