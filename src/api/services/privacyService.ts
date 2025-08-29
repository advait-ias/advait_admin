import api from "../axiosConfig";
import { endpoints } from "../endpoints";

export const fetchPrivacyPolicy = async () => {
    const res = await api.get(endpoints.privacyPolicy.list);
    return res.data;
};

export const createPrivacyPolicy = async (data: { content: string }) => {
    const res = await api.post(endpoints.privacyPolicy.create, data);
    return res.data;
};

export const updatePrivacyPolicy = async (data: { content: string }) => {
    const res = await api.patch(endpoints.privacyPolicy.create, data);
    return res.data;
};
