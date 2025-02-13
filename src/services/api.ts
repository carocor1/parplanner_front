import axios from "axios";
import { obtenerToken, eliminarToken } from "../utils/storage";
import { router } from "expo-router";

const api = axios.create({
  baseURL: "https://de87-190-244-241-204.ngrok-free.app/parplanner",
  headers: {
    "ngrok-skip-browser-warning": "true",
  },
});

api.interceptors.request.use(async (config) => {
  const token = await obtenerToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await eliminarToken();
      router.push("/iniciarSesion");
    }
    return Promise.reject(error);
  }
);

export default api;
