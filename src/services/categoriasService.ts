import { Categoria } from "../interfaces/CategoriaInterface";
import api from "./api";

export const getCategorias = async (): Promise<Categoria[]> => {
  try {
    const response = await api.get("/categorias");
    const categorias: Categoria[] = response.data;
    return categorias;
  } catch (error) {
    console.error("Error al obtener las categorías:", error);
    throw error;
  }
};
