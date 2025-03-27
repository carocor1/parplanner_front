import React from "react";
import { useEffect, useState } from "react";

import Colors from "../constants/Colors";
import { View } from "./Themed";
import { Evento } from "../interfaces/EventoInteface";

import { ALERT_TYPE, Toast } from "react-native-alert-notification";

interface EventoItemProps{
    evento: Evento; 
    usuarioLogueadoId: number, 
    onRecargar: () => void;
}

const EventoItem: React.FC<EventoItemProps>=({evento,usuarioLogueadoId,onRecargar})=>{
    
    const esCreador= evento.usuario_creador.id===usuarioLogueadoId; 
    const esPendiente= evento.estado.id===12;
    const esAceptado= evento.estado.id===13; 
    const esRechazado= evento.estado.id===14; 


    return(
    <View></View>
)};