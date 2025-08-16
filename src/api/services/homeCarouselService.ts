import api from "../axiosConfig";
import { endpoints } from "../endpoints";

export const fetchAllHomeCarousel = async () => {
  const res = await api.get(endpoints.homeCarousel.list);
  return res.data;
};

export const getHomeCarouselById = (id: string) =>
  api.get(endpoints.homeCarousel.detail(id));

export const addHomeCarousel = async (imageFile: File) => {
  const formData = new FormData();
  formData.append("image", imageFile);
  const res = await api.post(endpoints.homeCarousel.create, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const updateHomeCarousel = (id: string, data: any) =>
  api.patch(endpoints.homeCarousel.update(id), data);

export const deleteHomeCarousel = (id: string) =>
  api.delete(endpoints.homeCarousel.delete(id));
