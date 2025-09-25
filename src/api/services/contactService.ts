import api from "../axiosConfig";
import { endpoints } from "../endpoints";

export const fetchContact = async () => {
  const res = await api.get(endpoints.contact.list);
  return res.data;
};

export const createContact = async (data: {
  address: string;
  contactNumber: string;
  email: string;
}) => {
  const res = await api.post(endpoints.contact.create, data);
  return res.data;
};

export const updateContact = async (data: {
  address: string;
  contactNumber: string;
  email: string;
}) => {
  const res = await api.patch(endpoints.contact.create, data);
  return res.data;
};