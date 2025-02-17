import { Categoria } from "./CategoriaInterface";
import { Estado } from "./EstadoInterface";
import { PropuestaParticion } from "./PropuestasParticionInterface";
import { Usuario } from "./UsuarioInterface";

export interface Gasto {
  id: number;
  titulo: string;
  monto: number;
  descripcion: string;
  particion_usuario_creador: number;
  particion_usuario_participe: number;
  fecha: Date;
  usuario_creador: Usuario;
  usuario_participe: Usuario;
  fechaEliminacion: Date;
  estado: Estado;
  categoria: Categoria;
  propuestas_particion: PropuestaParticion[];
}
