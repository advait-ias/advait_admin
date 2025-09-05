// src/api/services/getInTouchService.ts
import api from "../axiosConfig";
import { endpoints } from "../endpoints";

export const fetchGetInTouch = async () => {
  const res = await api.get(endpoints.getInTouch.list);
  return res.data;
};

export const createGetInTouch = async (payload: {
  address: string;
  contactNumber: string;
  email: string;
}) => {
  const res = await api.post(endpoints.getInTouch.create, payload);
  return res.data;
};

export const updateGetInTouch = async (payload: {
  address?: string;
  contactNumber?: string;
  email?: string;
}) => {
  const res = await api.patch(endpoints.getInTouch.create, payload);
  return res.data;
};
