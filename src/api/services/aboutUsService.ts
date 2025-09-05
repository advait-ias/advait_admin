import api from "../axiosConfig";
import { endpoints } from "../endpoints";

export const fetchAboutUs = async () => {
  const res = await api.get(endpoints.aboutUs.list);
  return res.data;
};

export const createAboutUs = async (payload: { content: string }) => {
  const res = await api.post(endpoints.aboutUs.create, payload);
  return res.data;
};

export const updateAboutUs = async (payload: { content: string }) => {
  const res = await api.patch(endpoints.aboutUs.create, payload);
  return res.data;
};
