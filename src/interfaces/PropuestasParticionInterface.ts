import { Estado } from "./EstadoInterface";
import { Gasto } from "./GastoInterface";
import { Usuario } from "./UsuarioInterface";

export interface PropuestaParticion {
  id: number;
  gasto: Gasto;
  usuario_creador: Usuario;
  particion_usuario_creador_gasto: number;
  particion_usuario_participe_gasto: number;
  estado: Estado;
}
