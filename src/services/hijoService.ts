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
    console.error("Error al registrar el hijo:", error);
    throw error;
  }
};
