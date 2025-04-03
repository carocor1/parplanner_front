
import { Usuario } from "./UsuarioInterface";
import { Estado } from "./EstadoInterface";
export interface Evento{
    fecha: string | number | Date;
    id:number; 
    nombre:string; 
    diaEvento:string; 
    horaInicio:string; 
    horaFin:string; 
    alarmaCreador:boolean; 
    deleatedAt:Date;
    estado:Estado; 
    usuario_creador: Usuario; 
    usuario_participe: Usuario; 



}