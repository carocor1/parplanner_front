import api from "./api";
import { guardarToken } from "../utils/storage";

export const login = async (email: string, password: string) => {
  try {
    const response = await api.post("/auth/login", { email, password });
    const token = response.data.access_token;
    await guardarToken(token);
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
    const token = response.data.access_token;
    await guardarToken(token);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/* Registrar usuario
export const registrarUsuario = async (datosUsuario) => {
  try {
    const response = await api.post('/auth/register', datosUsuario);
    const token = response.data.access_token;
    await guardarToken(token);
    return response.data;
  } catch (error) {
    console.error('Error al registrar:', error);
    throw error;
  }
};
*/

/*
export const renovarToken = async () => {
  try {
    const response = await api.post('/auth/refresh');
    const newToken = response.data.access_token;
    await guardarToken(newToken);
    return newToken;
  } catch (error) {
    console.error('Error al renovar el token:', error);
    throw error;
  }

};
*/
