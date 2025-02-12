import api from "./api";

export const verificarHijoAsociado = async () => {
  try {
    const response = await api.get("/usuarios/tiene-hijo");
    return response.data;
  } catch (error) {
    console.error("Error al verificar si tiene un hijo asociado:", error);
    throw error;
  }
};

export const verificarRegistroUsuario = async () => {
  try {
    const response = await api.get("/usuarios/verificar-registro");
    return response.data;
  } catch (error) {
    console.error(
      "Error al verificar si el usuario se encuentra registrado:",
      error
    );
    throw error;
  }
};

export const registroProgenitor = async (
  nro_telefono: string,
  fecha_nacimiento: Date,
  provincia: string,
  ciudad: string,
  documento: number,
  sexo: string,
  cbu: string
) => {
  try {
    const response = await api.post("/usuarios/registro", {
      nro_telefono,
      fecha_nacimiento,
      provincia,
      ciudad,
      documento,
      sexo,
      cbu,
    });
    return response.data;
  } catch (error) {
    console.error("Error al registrar el progenitor:", error);
    throw error;
  }
};
