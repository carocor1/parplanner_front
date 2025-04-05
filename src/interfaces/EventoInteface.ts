import { Usuario } from "./UsuarioInterface";
import { Estado } from "./EstadoInterface";
export interface Evento {
  id: number;
  nombre: string;
  diaEvento: Date;
  horaInicio: string;
  horaFin: string;
  alarmaCreador: boolean;
  deleatedAt: Date;
  estado: Estado;
  usuario_creador: Usuario;
  usuario_participe: Usuario;
}
