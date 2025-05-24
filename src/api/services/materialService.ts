// src/api/services/materialService.ts
import api from '../axiosConfig';
import { endpoints } from '../endpoints';

export const fetchAllMaterials = async () => {
  const res = await api.get(endpoints.material.list);
  return res.data;
};

export const getMaterialById = (id: string) =>
  api.get(endpoints.material.detail(id));

export const createMaterial = (data: any) =>
  api.post(endpoints.material.create, data);

export const updateMaterial = (id: string, data: any) =>
  api.put(endpoints.material.update(id), data);

export const deleteMaterial = (id: string) =>
  api.delete(endpoints.material.delete(id));
