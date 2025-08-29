import api from "../axiosConfig";
import { endpoints } from "../endpoints";

// GET - fetch Why Choose Us
export const fetchWhyChooseUs = async () => {
    const res = await api.get(endpoints.whyChooseUs.list);
    return res.data;
};

// POST - create Why Choose Us
export const createWhyChooseUs = async (data: FormData) => {
    const res = await api.post(endpoints.whyChooseUs.create, data, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
};

// PATCH - update Why Choose Us
export const updateWhyChooseUs = async (data: FormData) => {
    const res = await api.patch(endpoints.whyChooseUs.create, data, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
};
