import api from "./api";
import { Evento } from "../interfaces/EventoInteface";

export const registrarEvento = async (
  nombre: string,
  diaEvento: Date,
  horaInicio: string,
  horaFin: string,
  alarmaCreador: boolean
) => {
  try {
    const response = await api.post("/eventos", {
      nombre,
      diaEvento,
      horaInicio,
      horaFin,
      alarmaCreador,
    });
    return response.data;
  } catch (error) {
    console.error("Error al registrar el evento:", error);
  }
};

export const getEventos = async (): Promise<Evento[]> => {
  try {
    const response = await api.get("/eventos");
    const eventos: Evento[] = response.data;
    return eventos;
  } catch (error) {
    console.error("Error al recuperar los eventos:", error);
    throw error;
  }
};
