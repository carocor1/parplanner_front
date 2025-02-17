import { PropuestaParticion } from "../interfaces/PropuestasParticionInterface";
import api from "./api";

export const obtenerPropuestasParticion = async (gastoId: number) => {
  try {
    const response = await api.get(
      `/propuestas-particion/ultima-propuesta/${gastoId}`
    );
    const ultima_propuesta: PropuestaParticion = response.data;
    return ultima_propuesta;
  } catch (error) {
    console.error("Error al obtener las propuestas de partición:", error);
  }
};

export const aprobarParticion = async (propuestaId: number) => {
  try {
    const response = await api.get(
      `/propuestas-particion/aprobar/${propuestaId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error al aceptar la propuesta de partición:", error);
  }
};

export const rechazarParticion = async (
  propuestaId: number,
  particion_usuario_creador_gasto: number,
  particion_usuario_participe_gasto: number
) => {
  try {
    const response = await api.post(
      `/propuestas-particion/rechazar/${propuestaId}`,
      {
        particion_usuario_creador_gasto,
        particion_usuario_participe_gasto,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error al rechazar la propuesta de partición:", error);
  }
};
