// src/api/axiosConfig.ts
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "https://api.advaitias.co.in",
  // baseURL: "http://localhost:8000",
  headers: {
    "Content-Type": "application/json",
  },
});

// Optional response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Global error logging or toast
    console.error("API Error:", error);
    return Promise.reject(error);
  }
);

export default api;
