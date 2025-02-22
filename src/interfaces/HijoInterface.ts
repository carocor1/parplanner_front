import { Usuario } from "./UsuarioInterface";

export interface Hijo {
  id: number;
  nombre: string;
  apellido: string;
  fecha_nacimiento: Date;
  provincia: string;
  ciudad: string;
  documento: number;
  sexo: string;
  progenitores: Usuario[];
  codigoInvitacion: string;
  codigoExpiracion: Date;
  fechaEliminacion: Date;
}
