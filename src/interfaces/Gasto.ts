export interface Gasto {
    id: number; 
    titulo: string;
    monto: number; 
    descripcion: string; 
    comprobanteCompra: string; 
    particionProgenitorCreador: number; 
    particionProgenitorParticipe: number;
    progenitorCreador: { 
      id: number;
      nombre: string; 
      apellido: string;
    };
    progenitorParticipe: { 
      id: number; 
      nombre: string;
      apellido: string;
    };
    estado: {
      nombre: string; 
    };
    fecha: string; 
    categoria: { nombre: string };
}
  