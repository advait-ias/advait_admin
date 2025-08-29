import api from "../axiosConfig";
import { endpoints } from "../endpoints";

// Get all FAQs
export const fetchAllFaqs = async () => {
    const res = await api.get(endpoints.faq.list);
    return res.data.faqs;
};

// Add a new FAQ
export const createFaq = async (faqData: { question: string; answer: string }) => {
    const res = await api.post(endpoints.faq.create, faqData);
    return res.data;
};

export const deleteFaq = async (id: string) => {
    const res = await api.delete(endpoints.faq.delete(id));
    return res.data;
};