import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Planning } from "../interfaces/PlanningInterface";
import { aprobarPlanning, rechazarPlanning } from "../services/planningService";
import { ALERT_TYPE, Toast } from "react-native-alert-notification";
import Colors from "../constants/Colors";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";

interface PlanningItemProps {
  planning: Planning;
  usuarioLogueadoId: number;
  onRecargar: () => void;
}

const PlanningItem: React.FC<PlanningItemProps> = ({
  planning,
  usuarioLogueadoId,
  onRecargar,
}) => {
  const [fechaInicio, setFechaInicio] = useState(new Date()); // Fecha inicial por defecto
  const [selectedPlanning, setSelectedPlanning] = useState<number | null>(null);

  const esCreador = planning.usuario_creador.id === usuarioLogueadoId;
  const esPendiente = planning.estado.id === 7;
  const esAprobado = planning.estado.id === 8;

    const aprobarSolicitudPlanning = async () => {
        try {
        if (planning) {
            await aprobarPlanning(planning.id);
            onRecargar();
        }
        } catch (error) {
        Toast.show({
            type: ALERT_TYPE.DANGER,
            title: "Error",
            textBody: "Error al aceptar la planificación. Por favor, inténtalo de nuevo.",
        });
        }
    };
    const rechazarSolicitudPlanning = () => {
      if (planning) {
 
        router.push({pathname:`../calendarios/SeleccionTipoPlanningScreen`, params:{usuarioId: usuarioLogueadoId, planningId: planning.id}})
      } else {
        console.error("Error: El planning no está definido.");
        Toast.show({
          type: ALERT_TYPE.DANGER,
          title: "Error",
          textBody: "No se puede rechazar el planning porque falta información.",
        });
      }
    };

 
  const fechaFormateada = planning?.fechaInicio
    ? new Date(planning.fechaInicio).toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
    : "Fecha no disponible";

  const mensajeAmostrar = esPendiente
    ? esCreador
      ? "Propusiste la siguiente planificación"
      : `${planning.usuario_creador.nombre} te propone esta planificación`
    : "";

  return (
    <View style={styles.PlanningContainer}>
      {/* Primera sección: Información principal */}
      <View style={styles.estiloAlineacion}>
        <View style={esPendiente ? { flex: 0.5 } : { flex: 0.6 }}>
          <Text style={styles.titulo}>Planning Propuesto</Text>
          <Text style={{ marginBottom: 2 }}>{fechaFormateada}</Text>
          <Text style={esCreador ? styles.textoNegro : styles.textoNaranja}>
            {planning.usuario_creador.nombre} {planning.usuario_creador.apellido}

            {esCreador && " (Vos)"}
          </Text>

          
        </View>

        {/* Segunda sección: Estado */}
        <View style={styles.seccionDerecha}>
          <View
            style={[
              esAprobado ? styles.rectanguloAceptada : styles.rectanguloPendiente,
              { marginBottom: 5 },
            ]}
          >
            <Text style={esAprobado ? styles.textoAceptada : styles.textoPendiente}>
              {planning.estado.nombre.toUpperCase()}
            </Text>
          </View>
        </View>
      </View>

 
      {/* Mensaje y botones */}
      {(esPendiente && !esCreador ) && (
        <>
          <Text style={styles.textoEnPendienteLadoDerecho}>{mensajeAmostrar}</Text>
          <Text style={styles.subtituloPendienteLadoDerecho}>
            Esperando aceptación del planning propuesto...
          </Text>
          <View style={styles.botonesNegociacion}>
            <TouchableOpacity
              style={[styles.botonPendiente, styles.botonAceptar]}
              onPress={aprobarSolicitudPlanning}
            >
              <MaterialIcons name="check" size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.botonPendiente, styles.botonRechazar]} onPress={rechazarSolicitudPlanning}><MaterialIcons name="close" size={24} color="white" /></TouchableOpacity>
          </View>
        </>
        
      )}

      {(esPendiente || esAprobado) && (
        
        <TouchableOpacity  style={styles.botonAbrir} onPress={()=> router.push({pathname:`../calendarios/${planning.id}`, params:{usuarioId: usuarioLogueadoId}})}>
        <Text style={styles.textoBoton}>Abrir</Text></TouchableOpacity>)}
    </View>
  );
};

const styles = StyleSheet.create({
  PlanningContainer: {
    paddingLeft: 15,
    paddingTop: 10,
    paddingBottom: 10,
    marginBottom: 0,
    borderWidth: 0.5,
    borderColor: "gray",
  },
  estiloAlineacion: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  titulo: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 2,
  },
  textoNegro: {
    color: Colors.negro.negroOscuro,
    fontWeight: "bold",
    marginBottom: 2,
  },
  textoNaranja: {
    color: Colors.naranja.naranjaOscuro,
    fontWeight: "bold",
    marginBottom: 2,
  },
  rectanguloPendiente: {
    backgroundColor: Colors.naranja.naranjaClaro,
    padding: 5,
    borderRadius: 10,
  },
  textoPendiente: {
    color: Colors.naranja.naranjaOscuro,
    fontWeight: "bold",
  },
  rectanguloAceptada: {
    backgroundColor: Colors.azul.azulClaro,
    padding: 5,
    borderRadius: 10,
  },
  textoAceptada: {
    color: Colors.azul.azulOscuro,
    fontWeight: "bold",
  },
  textoEnPendienteLadoDerecho: {
    textAlign: "center",
    lineHeight: 20,
  },
  subtituloPendienteLadoDerecho: {
    marginTop: 3,
    textAlign: "center",
    fontSize: 12,
    fontStyle: "italic",
    color: Colors.negro.negroNormal,
  },
  seccionDerecha: {
    justifyContent: "center",
    alignItems: "center",
    flex: 0.4,
  },
  botonAbrir: {
    backgroundColor: "white",
    borderColor: Colors.azul.celeste,
    borderWidth: 2,
    borderRadius: 15,
    padding: 3,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    marginRight: 8,
  },
  botones: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    marginTop: 5,
  },
  botonesNegociacion: {
    marginTop: 5,
    flexDirection: "row",
    justifyContent: "space-between",
    width: 100,
  },
  botonPendiente: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "green",
  },
  botonAceptar: {
    backgroundColor: "green",
  },
  textoBoton: {
   color: Colors.azul.celeste,
    fontSize: 12,
    marginRight: 8,
    marginLeft: 8,
  },
  botonRechazar: {
    backgroundColor: "red",
  },
});

export default PlanningItem;
