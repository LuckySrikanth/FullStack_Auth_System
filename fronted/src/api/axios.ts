import axios from "axios";
import type { AxiosRequestConfig } from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: false,
});

api.interceptors.request.use((config: AxiosRequestConfig) => {
  const token = localStorage.getItem("accessToken");

  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    };
  }

  return config;
});

export default api;
