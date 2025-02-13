import { url } from "../constants/constants";
import { Gasto } from "../interfaces/GastoInterface";
import api from "./api";

export const getGastosByProgenitor = async (): Promise<Gasto[]> => {
  try {
    const response = await api.get("/gastos");
    const gastos: Gasto[] = response.data;
    return gastos;
  } catch (error) {
    console.error("Error al recuperar los gastos:", error);
    throw error;
  }
};

export const getGastoById = async (gastoId: number): Promise<Gasto | null> => {
  try {
    const response = await api.get(`/gastos/${gastoId}`);
    const gasto: Gasto = response.data;
    return gasto;
  } catch (error) {
    console.error("Error al recuperar el gasto:", error);
    throw error;
  }
};
