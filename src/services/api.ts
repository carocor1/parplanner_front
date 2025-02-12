import axios from "axios";
import { obtenerToken, eliminarToken } from "../utils/storage";

const api = axios.create({
  baseURL: "https://rested-present-trout.ngrok-free.app/parplanner",
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
      // Redirigir al usuario a la pantalla de login
      // Ejemplo: navigation.navigate('Login');
    }
    return Promise.reject(error);
  }
);

export default api;
