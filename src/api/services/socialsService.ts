import api from "../axiosConfig";
import { endpoints } from "../endpoints";

export const fetchSocials = async () => {
    const res = await api.get(endpoints.socials.list);
    return res.data;
};

export const createSocial = async (data: { platform: string; link: string }) => {
    const res = await api.post(endpoints.socials.create, data);
    return res.data;
};
