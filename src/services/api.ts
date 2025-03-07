import axios from "axios";
import {
  eliminarTokens,
  guardarToken,
  obtenerRefreshToken,
  obtenerToken,
} from "../utils/storage";
import { router } from "expo-router";

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
      const newAccessToken = await renovarAccessToken();
      if (newAccessToken) {
        error.config.headers.Authorization = `Bearer ${newAccessToken}`;
        return axios(error.config);
      }
    }
    return Promise.reject(error);
  }
);

export const renovarAccessToken = async () => {
  const refreshToken = await obtenerRefreshToken();
  try {
    const response = await api.post("/auth/refresh", {
      refresh_token: refreshToken,
    });
    const { access_token, refresh_token } = response.data;
    guardarToken(access_token, refresh_token);
    return access_token;
  } catch (error) {
    await eliminarTokens();
    router.replace("/InicioSesionScreen");
  }
};

export default api;
