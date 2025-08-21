import api from "../axiosConfig";
import { endpoints } from "../endpoints";

export interface Blog extends Document {
  _id: string;
  headline: string;
  content: string;
  image: string;
  tags: string[];
  isActive: boolean;
}

export const fetchAllTestimonials = async () => {
  const res = await api.get(endpoints.testimonial.list);
  return res.data;
};

export const getTestimonialById = (id: string) => api.get(endpoints.testimonial.detail(id));

export const createTestimonial = async (data: FormData): Promise<Blog> => {
  const res = await api.post<Blog>(endpoints.testimonial.create, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

export const updateTestimonial = (id: string, data: any) =>
  api.patch(endpoints.testimonial.update(id), data);

export const deleteTestimonial = (id: string) => api.delete(endpoints.testimonial.delete(id));
