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

export const getGastoById = async (gastoId: number): Promise<Gasto> => {
  try {
    const response = await api.get(`/gastos/${gastoId}`);
    const gasto: Gasto = response.data;
    return gasto;
  } catch (error) {
    throw error;
  }
};

export const registrarGasto = async (
  titulo: string,
  monto: number,
  fecha: Date,
  particion_usuario_creador: number,
  particion_usuario_participe: number,
  categoria: string,
  descripcion?: string
) => {
  try {
    const response = await api.post("/gastos", {
      titulo,
      descripcion,
      monto,
      fecha,
      particion_usuario_creador,
      particion_usuario_participe,
      categoria,
    });
    return response.data;
  } catch (error) {
    console.error("Error al registrar el gasto:", error);
  }
};

export const actualizarGasto = async (
  id: number,
  titulo?: string,
  monto?: number,
  descripcion?: string,
  categoria?: string
) => {
  try {
    const response = await api.patch(`/gastos/${id}`, {
      titulo,
      monto,
      descripcion,
      categoria,
    });
    return response.data;
  } catch (error) {
    console.error("Error al actualizar el gasto", error);
  }
};

export const pagarGastos = async (gastos: Gasto[]) => {
  try {
    const gastosId = gastos.map((gasto) => gasto.id);
    const response = await api.post("/mercado-pago/create-preference", {
      gastosId,
    });
    return response.data;
  } catch (error) {
    console.error("Error al pagar los gastos", error);
  }
};
