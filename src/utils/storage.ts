import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";

export const guardarToken = async (token: string) => {
  try {
    await AsyncStorage.setItem("access_token", token);
  } catch (error) {}
};

export const obtenerToken = async () => {
  try {
    return await AsyncStorage.getItem("access_token");
  } catch (error) {
    console.log("Error al obtener el token");
    return null;
  }
};

export const getProgenitorIdFromToken = async (): Promise<number | null> => {
  const token = await obtenerToken();
  if (token) {
    try {
      const decodedToken = jwtDecode(token);
      if (!decodedToken.sub) {
        return null;
      } else {
        return Number(decodedToken.sub);
      }
    } catch (error) {
      console.error("Error al decodificar el token:", error);
      return null;
    }
  }
  return null;
};

export const eliminarToken = async () => {
  try {
    await AsyncStorage.removeItem("access_token");
  } catch (error) {}
};
