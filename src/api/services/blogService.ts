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

export const fetchAllBlogs = async () => {
  const res = await api.get(endpoints.blog.list);
  return res.data;
};

export const getBlogById = (id: string) => api.get(endpoints.blog.detail(id));

export const createBlog = async (data: FormData): Promise<Blog> => {
  const res = await api.post<Blog>(endpoints.blog.create, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

export const updateBlog = (id: string, data: any) =>
  api.put(endpoints.blog.update(id), data);

export const deleteBlog = (id: string) => api.delete(endpoints.blog.delete(id));
