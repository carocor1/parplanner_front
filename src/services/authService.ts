import api from "./api";
import { eliminarTokens, guardarToken } from "../utils/storage";
import { router } from "expo-router";

export const login = async (email: string, password: string) => {
  try {
    const response = await api.post("/auth/login", { email, password });
    await guardarToken(response.data.access_token, response.data.refresh_token);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const register = async (
  email: string,
  contraseña: string,
  nombre: string,
  apellido: string
) => {
  try {
    const response = await api.post("/auth/registro", {
      email,
      contraseña,
      nombre,
      apellido,
    });
    await guardarToken(response.data.access_token, response.data.refresh_token);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const cerrarSesion = async () => {
  try {
    await eliminarTokens();
    router.replace("/inicioSesion");
  } catch (error) {
    console.error("Error al cerrar sesión:", error);
  }
};
