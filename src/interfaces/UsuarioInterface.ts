export interface Usuario {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  contraseña: string;
  ciudad: string;
  cbu: string;
  sexo: string;
  documento: number;
  fechaEliminacion: Date;
  fecha_nacimiento: Date;
  provincia: string;
  nro_telefono: string;
  googleId: string;
}
