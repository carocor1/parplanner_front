import React from "react";
import { useEffect, useState} from "react";
import { StyleSheet,View,Text} from "react-native";
import Colors from "../constants/Colors";

import { Evento } from "../interfaces/EventoInteface";
import { ALERT_TYPE, Toast } from "react-native-alert-notification";
import { getEventos } from "../services/evento";

interface EventoItemProps{
    evento: Evento; 
    usuarioLogueadoId: number, 
    onRecargar: () => void;
}

const EventoItem: React.FC<EventoItemProps>=({evento,usuarioLogueadoId,onRecargar})=>{
    
    const esCreador= evento.usuario_creador.id===usuarioLogueadoId; 
    const [loading, setLoading] = useState(true);
    const fetchEventos = async () => {
        try {
          setLoading(true); 
          const eventos = await getEventos(); 
      
        } catch (error) {
          console.error("Error al recuperar los eventos:", error);
        } finally {
          setLoading(false); 
        }
    };

    useEffect(() => {
        fetchEventos();
    }, []);
    const fechaFormateada = new Date(evento.diaEvento).toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });

    const formatearHora = (hora: string) => {
        return hora.slice(0, 5) + " hs"; 
    };

    const horaFormateadaInicio = formatearHora(evento.horaInicio);
    const horaFormateadaFin = formatearHora(evento.horaFin);



    return(
    <View style={styles.eventoContainer}>
        <View style={styles.estiloAlineacion}>
            <View style={styles.containerEvento}>
                <Text style={styles.textoEvento}>{evento.nombre.toUpperCase()}</Text>
            </View>
            <View style={styles.fila}>
                <Text style={styles.textoDatos}>Fecha:  
                    <Text style={styles.textoNegroNormal}> {fechaFormateada}</Text>
                </Text>
                <Text style={styles.textoDatos}>Hora de Inicio:  
                    <Text style={styles.textoNegroNormal}> {horaFormateadaInicio}</Text>
                </Text>

                <Text style={styles.textoDatos}>Hora de Finalización:  
                    <Text style={styles.textoNegroNormal}> {horaFormateadaFin}</Text>
                </Text>

            </View>
           
           


        </View>

    </View>
)};

const styles = StyleSheet.create({
    eventoContainer: {
        padding: 15, 
        marginBottom: 0, 
        borderWidth: 0.5,
        borderColor: "rgba(0, 0, 0, 0.1)", 
        borderRadius: 12, 
        backgroundColor: "#f8fafa", 
    },
    seccionDerecha: {
        justifyContent: "center",
        alignItems: "center",
        flex: 0.4,
    },
    estiloAlineacion: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap"
    },
    textoEvento: {
        color: Colors.marron.marronNormal,
        fontWeight: "bold",
        fontSize: 16,
        textAlign: "center",
    },
    containerEvento: {
        backgroundColor: Colors.marron.marronClaro,
        padding: 10,
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 10,
        marginBottom: 10,
        width: "100%",
    },
    textoNegro: {
        color: Colors.negro.negroOscuro,
        fontWeight: "bold",
        marginBottom: 2,
    },
    textoNegroNormal: {
        color: "rgb(70, 89, 112)",
        fontWeight: "bold",
        marginBottom: 2,
        fontSize:14
    },
    textoParticipe: {
        color: Colors.lila.lilaNormal,
        fontWeight: "bold",
    },
     textoCreador: {
        color: Colors.naranja.naranjaOscuro,
        fontWeight: "bold",
    },
    rectanguloParticipe: {
        backgroundColor: Colors.lila.lilaClaro,
        padding: 5,
        borderRadius: 10,
        justifyContent: "center",
    },
    rectanguloCreador: {
        backgroundColor: Colors.naranja.naranjaClaro,
        padding: 5,
        borderRadius: 10,
    },
    textoDatos: {
        color: Colors.rosa.rosaOscuro,
        fontWeight: "bold",
        fontSize: 16,
        textAlign: "left",
    },
    fila: {
        alignSelf:"flex-start"
    },

});

export default EventoItem;