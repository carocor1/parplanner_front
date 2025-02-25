import { Hijo } from "../interfaces/HijoInterface";
import api from "./api";

export const registrarHijo = async (
  nombre: string,
  apellido: string,
  fecha_nacimiento: Date,
  provincia: string,
  ciudad: string,
  documento: number,
  sexo: string
) => {
  try {
    const response = await api.post("/hijos", {
      nombre,
      apellido,
      fecha_nacimiento,
      provincia,
      ciudad,
      documento,
      sexo,
    });
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const verificarSegundoProgenitorAsociado = async () => {
  try {
    const response = await api.get("/hijos/verificar-vinculacion");
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const verificarCodigoVinculacion = async (codigo: string) => {
  try {
    const response = await api.post("/hijos/vincular-codigo", {
      codigo,
    });
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const enviarCodigoDeVinculacion = async (email_progenitor: string) => {
  try {
    const response = await api.post("/hijos/vinculacion", {
      email_progenitor,
    });
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const obtenerHijo = async (id: number) => {
  try {
    const response = await api.get(`/hijos/${id}`);
    const hijo: Hijo = response.data;
    return hijo;
  } catch (error) {
    throw error;
  }
};

export const actualizarHijo = async (
  id: number,
  nombre?: string,
  apellido?: string,
  provincia?: string,
  ciudad?: string,
  documento?: number,
  sexo?: string
) => {
  try {
    const response = await api.patch(`/hijos/${id}`, {
      nombre,
      apellido,
      provincia,
      ciudad,
      documento,
      sexo,
    });
    return response.data;
  } catch (error) {
    console.log("Error al actualizar el usuario:", error);
  }
};
