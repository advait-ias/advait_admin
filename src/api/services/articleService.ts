import api from "../axiosConfig";
import { endpoints } from "../endpoints";

export interface Article extends Document {
  _id: string;
  category: string;
  subCategory: string;
  language: string;
  headline: string;
  subHeadline: string;
  content: string;
  image: string;
  tags: string[];
  isActive: boolean;
}

export const fetchAllArticles = async (page: number, limit: number) => {
  const res = await api.get(
    `${endpoints.article.list}/order-by?page=${page}&limit=${limit}`
  );
  return res.data; // { data: [...], pagination: {...} }
};

export const getArticleById = (id: string) =>
  api.get(endpoints.article.detail(id));

export const createArticle = async (data: FormData): Promise<Article> => {
  const res = await api.post<Article>(endpoints.article.create, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

export const updateArticle = (id: string, data: any) =>
  api.patch(endpoints.article.update(id), data);

export const deleteArticle = (id: string) =>
  api.delete(endpoints.article.delete(id));
