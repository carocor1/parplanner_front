import { Planning } from "../interfaces/PlanningInterface";
import api from "./api";


export const registrarPlanning = async (
  fechaInicio: Date,
  selectedPlanning: number
) => {
  try {

    
    const response = await api.post("/planning", {
      fechaInicio,
      tipoPlanningId:selectedPlanning,
    });
    return response.data;
  } catch (error) {
    console.error("Error al registrar el planning:", error);
  }
};

export const getPlanningsByProgenitor = async (): Promise<Planning[]> => {
  try {
    const response = await api.get("/planning");
    const plannings: Planning[] = response.data;
    return plannings;
  } catch (error) {
    console.error("Error al recuperar los plannings:", error);
    throw error;
  }
};

export const getPlanningById = async (planningId: number): Promise<Planning> => {
  try {
    const response = await api.get(`/planning/${planningId}`);
    const planning: Planning= response.data;
    return planning;
  } catch (error) {
    throw error;
  }
};

export const aprobarPlanning = async (planningId: number) => {
  try {
    const response = await api.get(
      `/planning/aprobar/${planningId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error al aceptar el planning:", error);
  }
};


export const rechazarPlanning = async (
  planningId: number,
  fechaInicio: string,
  tipoPlanning: string
) => {
  try {
    const response = await api.post(`/planning/rechazar/${planningId}`, {
      fechaInicio,
      tipoPlanning,
    });
    return response.data; // Retorna la respuesta del servidor
  } catch (error) {
    console.error("Error al rechazar el planning:", error);
    throw error; // Lanza el error si necesitas manejarlo en otro lugar
  }
};
