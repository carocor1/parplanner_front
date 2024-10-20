import { url } from '../constants/constants';
import { Gasto } from '../interfaces/Gasto';


export const getGastosByProgenitor = async (progenitorId: number): Promise<Gasto[]> => {
  try {
    const response = await fetch(`${url}/gasto/progenitor/${progenitorId}`);
    const data = await response.json();
    
    const gastos: Gasto[] = data.map((gasto: any) => ({
      id: gasto.id,
      titulo: gasto.titulo,
      monto: gasto.monto,
      descripcion: gasto.descripcion,
      comprobanteCompra: gasto.comprobanteCompra,
      particionProgenitorCreador: gasto.particionProgenitorCreador,
      particionProgenitorParticipe: gasto.particionProgenitorParticipe,
      progenitorCreador: {
        id: gasto.progenitorCreadorId,
        nombre: gasto.progenitorCreadorNombre,
        apellido: gasto.progenitorCreadorApellido,
      },
      progenitorParticipe: {
        id: gasto.progenitorParticipeId,
        nombre: gasto.progenitorParticipeNombre,
        apellido: gasto.progenitorParticipeApellido,
      },
      estado: {
        nombre: gasto.nombreEstado,
      },
      fecha: gasto.fechaCreacion, 
      categoria: {
        nombre: gasto.nombreCategoria,
      },
    }));

    return gastos;
  } catch (error) {
    console.error('Error al recuperar los gastos:', error);
    throw error; 
  }
};

export const getGastoById = async (gastoId: number): Promise<Gasto | null> => {
  try {
    const response = await fetch(`${url}/gasto/${gastoId}`);
    if (!response.ok) {
      throw new Error('Error al obtener el gasto');
    }

    const gasto = await response.json();
    
    const parsedGasto: Gasto = {
      id: gasto.id,
      titulo: gasto.titulo,
      monto: gasto.monto,
      descripcion: gasto.descripcion,
      comprobanteCompra: gasto.comprobanteCompra,
      particionProgenitorCreador: gasto.particionProgenitorCreador,
      particionProgenitorParticipe: gasto.particionProgenitorParticipe,
      progenitorCreador: {
        id: gasto.progenitorCreadorId,
        nombre: gasto.progenitorCreadorNombre,
        apellido: gasto.progenitorCreadorApellido,
      },
      progenitorParticipe: {
        id: gasto.progenitorParticipeId,
        nombre: gasto.progenitorParticipeNombre,
        apellido: gasto.progenitorParticipeApellido,
      },
      estado: {
        nombre: gasto.nombreEstado,
      },
      fecha: gasto.fechaCreacion, 
      categoria: {
        nombre: gasto.nombreCategoria,
      },
    };
    console.log(parsedGasto);
    return parsedGasto;
  } catch (error) {
    console.error('Error al recuperar el gasto:', error);
    throw error; 
  }
};