import { TipoPlanning } from "../interfaces/TipoPlanning";
import api from "./api";

export const getTipoPlanning = async (): Promise<TipoPlanning[]> => {
  try {
    const response = await api.get("/tipo-planning");
    const plannings: TipoPlanning[] = response.data;
    return plannings;
  } catch (error) {
    console.error("Error al obtener los plannings:", error);
    throw error;
  }
};

export const registrarTipoPlanning = async (
  nombre: string,
  distribucion: number[]
) => {
  try {
    const response = await api.post("/tipo-planning", {
      nombre,
      distribucion,
    });
    return response.data;
  } catch (error) {
    console.error("Error al registrar el tipo de Planning:", error);
  }
};
