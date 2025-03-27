import { Usuario} from "./UsuarioInterface";
import { TipoPlanning } from "./TipoPlanning";
import { Estado } from "./EstadoInterface";

export interface Planning{
    id:number; 
    fechaInicio:Date; 
    deleatedAt: Date; 
    tipoPlanningId: TipoPlanning; 
    estado: Estado; 
    usuario_creador: Usuario;
    usuario_participe: Usuario;
    fechasAsignadasCreador: string[];
    fechasAsignadasParticipe: string[];

}
