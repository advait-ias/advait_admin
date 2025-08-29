import api from "../axiosConfig";
import { endpoints } from "../endpoints";

export const fetchTerms = async () => {
    const res = await api.get(endpoints.termsAndConditions.list);
    return res.data;
};

export const createTerms = async (data: { content: string }) => {
    const res = await api.post(endpoints.termsAndConditions.create, data);
    return res.data;
};

export const updateTerms = async (data: { content: string }) => {
    const res = await api.patch(endpoints.termsAndConditions.create, data);
    return res.data;
};
