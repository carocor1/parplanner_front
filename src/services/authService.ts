import api from "./api";
import { eliminarTokens, guardarToken } from "../utils/storage";
import { router } from "expo-router";
import * as WebBrowser from "expo-web-browser";

export const login = async (email: string, password: string) => {
  try {
    const response = await api.post("/auth/login", { email, password });
    await guardarToken(response.data.access_token, response.data.refresh_token);
    return response.data;
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
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
    console.error("Error al registrar usuario:", error);
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

export const iniciarSesionConGoogle = async () => {
  try {
    const url = `${api.defaults.baseURL}/auth/google`;
    await WebBrowser.openBrowserAsync(url);
  } catch (error) {
    console.error("Error al abrir el navegador:", error);
  }
};

export const enviarCodigoCambiarContraseña = async (email: string) => {
  try {
    const response = await api.post("/auth/recuperar-contrasenia", { email });
    return response.data;
  } catch (error) {
    console.error("Error al enviar el código de cambio de contraseña:", error);
    throw error;
  }
};

export const verificarCodigoCambioContraseña = async (codigo: string) => {
  try {
    const response = await api.post("/auth/recuperar-contrasenia-codigo", {
      codigo,
    });
    await guardarToken(response.data.access_token, response.data.refresh_token);
    return response.data;
  } catch (error) {
    console.error(
      "Error al verificar el código de cambio de contraseña:",
      error
    );
    throw error;
  }
};

export const crearContraseña = async (contraseñaNueva: string) => {
  try {
    console.log("actualizando contraseña");
    const response = await api.post("/auth/cambiar-contrasenia", {
      contraseñaNueva,
    });
    return response.data;
  } catch (error) {
    console.error("Error al actualizar contraseña:", error);
    throw error;
  }
};
