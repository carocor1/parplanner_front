export const progenitores = [
  { id: 1, nombre: "Belén", apellido: "Gómez", fechaNacimiento: "1985-05-15", email: "belen@example.com" },
  { id: 2, nombre: "Máximo", apellido: "Fernández", fechaNacimiento: "1983-08-20", email: "maximo@example.com" }
];

export const estados = [
  { id: 1, nombre: 'Pendiente' },
  { id: 2, nombre: 'Pagada' }
];


export const categorias = [
  { id: 1, nombre: 'Educación' },
  { id: 2, nombre: 'Salud' },
  { id: 3, nombre: 'Recreación' },
  { id: 4, nombre: 'Indumentaria' }
];

export const gastos = [
  {
    id: 1,
    titulo: "Compra de útiles escolares",
    monto: 400,
    descripcion: "Compra de útiles para el colegio.",
    comprobanteCompra: "comprobante1.pdf",
    particionProgenitorCreador: 50, // Belén - 50%
    particionProgenitorParticipe: 50, // Máximo - 50%
    progenitorCreador: progenitores[0], // Belén
    progenitorParticipe: progenitores[1], // Máximo
    estado: { nombre: "Pendiente" },
    fecha: "10/01/2024", // Nueva fecha añadida
    categoria: {id: 4, nombre: 'Indumentaria'}
  },
  {
    id: 2,
    titulo: "Pago de alquiler",
    monto: 1200,
    descripcion: "Alquiler del mes de agosto.",
    comprobanteCompra: "comprobante2.pdf",
    particionProgenitorCreador: 70, // Máximo - 70%
    particionProgenitorParticipe: 30, // Belén - 30%
    progenitorCreador: progenitores[1], // Máximo
    progenitorParticipe: progenitores[0], // Belén
    estado: { nombre: "Pagada" },
    fecha: "01/08/2024", // Nueva fecha añadida
    categoria: {id: 4, nombre: 'Indumentaria'}
  },
  {
    id: 3,
    titulo: "Compra de ropa",
    monto: 600,
    descripcion: "Ropa de invierno para los niños.",
    comprobanteCompra: "comprobante3.pdf",
    particionProgenitorCreador: 40, // Belén - 40%
    particionProgenitorParticipe: 60, // Máximo - 60%
    progenitorCreador: progenitores[0], // Belén
    progenitorParticipe: progenitores[1], // Máximo
    estado: { nombre: "Pendiente" },
    fecha: "15/03/2024", // Nueva fecha añadida
    categoria: {id: 4, nombre: 'Indumentaria'}
  },
  {
    id: 4,
    titulo: "Compra de juguetes",
    monto: 300,
    descripcion: "Regalos de cumpleaños.",
    comprobanteCompra: "comprobante4.pdf",
    particionProgenitorCreador: 90, // Máximo - 100%
    particionProgenitorParticipe: 10, // Belén - 0%
    progenitorCreador: progenitores[1], // Máximo
    progenitorParticipe: progenitores[0], // Belén
    estado: { nombre: "Pagada" },
    fecha: "20/05/2024", // Nueva fecha añadida
    categoria: {id: 3, nombre: 'Recreación' }
  },
  {
    id: 5,
    titulo: "Servicios de internet",
    monto: 500,
    descripcion: "Pago mensual del servicio de internet.",
    comprobanteCompra: "comprobante5.pdf",
    particionProgenitorCreador: 30, // Belén - 30%
    particionProgenitorParticipe: 70, // Máximo - 70%
    progenitorCreador: progenitores[0], // Belén
    progenitorParticipe: progenitores[1], // Máximo
    estado: { nombre: "Pendiente" },
    fecha: "01/09/2024", // Nueva fecha añadida
    categoria: {id: 1, nombre: 'Educación' }
  },
  {
    id: 6,
    titulo: "Mantenimiento del auto",
    monto: 800,
    descripcion: "Mantenimiento general del vehículo.",
    comprobanteCompra: "comprobante6.pdf",
    particionProgenitorCreador: 80, // Máximo - 80%
    particionProgenitorParticipe: 20, // Belén - 20%
    progenitorCreador: progenitores[1], // Máximo
    progenitorParticipe: progenitores[0], // Belén
    estado: { nombre: "Pendiente" },
    fecha: "12/06/2024", // Nueva fecha añadida
    categoria: {id: 1, nombre: 'Educación'}
  },
  {
    id: 7,
    titulo: "Vacaciones familiares",
    monto: 2000,
    descripcion: "Gastos de viaje y hospedaje.",
    comprobanteCompra: "comprobante7.pdf",
    particionProgenitorCreador: 60, // Belén - 60%
    particionProgenitorParticipe: 40, // Máximo - 40%
    progenitorCreador: progenitores[0], // Belén
    progenitorParticipe: progenitores[1], // Máximo
    estado: { nombre: "Pagada" },
    fecha: "10/07/2024", // Nueva fecha añadida
    categoria: {id: 3, nombre: 'Recreación'}
  }
];
