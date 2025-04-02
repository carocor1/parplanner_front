import { router, useFocusEffect } from "expo-router";
import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import React, { useCallback, useState } from "react";
import { Planning } from "../interfaces/PlanningInterface";
import { getProgenitorIdFromToken } from "../utils/storage";
import {
  aprobarPlanning,
  getPlanningsByProgenitor,
} from "../services/planningService";
import { ALERT_TYPE, Toast } from "react-native-alert-notification";
import Colors from "../constants/Colors";
import { MaterialIcons } from "@expo/vector-icons";
import CalendarioPlanning from "../components/CalendarioPlanningDef";
import LoadingIndicator from "../components/LoadingIndicator";
import CustomButton from "../components/CustomButton";

export default function DocumentoScreen() {
  const [planning, setPlanning] = useState<Planning | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [progenitorLogueadoId, setProgenitorLogueadoId] = useState<
    number | null
  >(null);

  const fetchUltimoPlanning = async () => {
    setLoading(true);
    try {
      const id = await getProgenitorIdFromToken();
      if (id) {
        setProgenitorLogueadoId(id);
      }
      const planning = await getPlanningsByProgenitor();
      if (planning) {
        setPlanning(planning);
      }
    } catch (error) {
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: "Error",
        textBody:
          "Error al recuperar los plannings. Por favor, inténtalo de nuevo.",
      });
    } finally {
      setLoading(false);
    }
  };

  const aprobarSolicitudPlanning = async () => {
    try {
      if (planning) {
        await aprobarPlanning(planning.id);
        fetchUltimoPlanning();
      }
    } catch (error) {
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: "Error",
        textBody:
          "Error al aceptar la planificación. Por favor, inténtalo de nuevo.",
      });
    }
  };

  const rechazarSolicitudPlanning = () => {
    if (planning) {
      router.push({
        pathname: "/(tabs)/calendarios/SeleccionTipoPlanningScreen",
        params: { planningRechazandoId: planning.id },
      });
    } else {
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: "Error",
        textBody: "No se puede rechazar el planning porque falta información.",
      });
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchUltimoPlanning();
    }, [])
  );

  if (loading) {
    return <LoadingIndicator />;
  }

  const esCreador = planning?.usuario_creador.id === progenitorLogueadoId;
  const esPendiente = planning?.estado.id === 7;
  const esAprobado = planning?.estado.id === 8;

  const mensajeAmostrar = esPendiente
    ? esCreador
      ? "Propusiste la siguiente planificación:"
      : `${planning?.usuario_creador.nombre} te propone la siguiente planificación:`
    : "";

  return (
    <View style={styles.container}>
      <ScrollView>
        <View>
          {planning ? (
            <>
              <View style={styles.PlanningsContainer}>
                <View style={styles.estiloAlineacion}>
                  <View style={esPendiente ? { flex: 0.5 } : { flex: 0.6 }}>
                    <Text style={styles.titulo}>Planning</Text>

                    {esPendiente && (
                      <Text
                        style={
                          esCreador ? styles.textoNegro : styles.textoNaranja
                        }
                      >
                        {planning.usuario_creador.nombre}{" "}
                        {planning.usuario_creador.apellido}
                        {esCreador && " (Vos)"}
                      </Text>
                    )}
                  </View>
                  <View style={styles.seccionDerecha}>
                    <View
                      style={[
                        esAprobado
                          ? styles.rectanguloAceptada
                          : styles.rectanguloPendiente,
                        { marginBottom: 5 },
                      ]}
                    >
                      <Text
                        style={
                          esAprobado
                            ? styles.textoAceptada
                            : styles.textoPendiente
                        }
                      >
                        {planning.estado.nombre.toUpperCase()}
                      </Text>
                    </View>
                  </View>
                </View>

                {esPendiente && (
                  <Text style={styles.textoEnPendienteLadoDerecho}>
                    {mensajeAmostrar}
                  </Text>
                )}

                <CalendarioPlanning
                  fechasAsignadasCreador={planning.fechasAsignadasCreador}
                  fechasAsignadasParticipe={planning.fechasAsignadasParticipe}
                />

                <View style={styles.fechasAsignadasContainer}>
                  <View style={styles.rectanguloCreador}>
                    <Text style={styles.textoCreador}>
                      {esCreador
                        ? `${planning.usuario_creador.nombre.toUpperCase()} (Vos)`
                        : planning.usuario_creador.nombre.toUpperCase()}
                    </Text>
                  </View>
                  <View style={styles.rectanguloParticipe}>
                    <Text style={styles.textoParticipe}>
                      {esCreador
                        ? planning.usuario_participe.nombre.toUpperCase()
                        : `${planning.usuario_participe.nombre.toUpperCase()} (Vos)`}
                    </Text>
                  </View>
                </View>

                {esPendiente && !esCreador && (
                  <View style={styles.botonesNegociacion}>
                    <TouchableOpacity
                      style={[styles.botonPendiente, styles.botonAceptar]}
                      onPress={aprobarSolicitudPlanning}
                    >
                      <MaterialIcons name="check" size={24} color="white" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.botonPendiente, styles.botonRechazar]}
                      onPress={rechazarSolicitudPlanning}
                    >
                      <MaterialIcons name="close" size={24} color="white" />
                    </TouchableOpacity>
                  </View>
                )}
                {esPendiente && esCreador && (
                  <Text style={styles.textoEnPendienteLadoDerecho}>
                    {planning.usuario_participe.nombre} deberá aprobar el
                    planning que propusiste...
                  </Text>
                )}
              </View>
            </>
          ) : (
            <View>
              <Text style={styles.textoSinGasto}>
                ¡Registrá un nuevo Planning para comenzar!
              </Text>
              <CustomButton
                onPress={() =>
                  router.push("/(tabs)/calendarios/SeleccionTipoPlanningScreen")
                }
                title="REGISTRAR PLANNING"
                backgroundColor={Colors.naranja.naranjaOscuro}
                textColor="white"
              />
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#6A5ACD",
    justifyContent: "center",
    paddingHorizontal: 15,
    paddingVertical: 100,
  },
  ParteSuperiorContainer: {},
  PlanningsContainer: {
    backgroundColor: "#fff",
    borderRadius: 15,
    alignSelf: "center",
    padding: 15,
    justifyContent: "center",
    width: "100%",
    marginHorizontal: 200,
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
    marginTop: 5,
    textAlign: "center",
    lineHeight: 20,
  },
  fechasAsignadasContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 10,
    marginBottom: 20,
  },
  rectanguloCreador: {
    backgroundColor: Colors.naranja.naranjaClaro,
    padding: 5,
    borderRadius: 10,
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
  textoParticipe: {
    color: Colors.lila.lilaNormal,
    fontWeight: "bold",
  },
  botonesNegociacion: {
    marginTop: 5,
    flexDirection: "row",
    justifyContent: "space-between",
    width: 100,
    alignSelf: "center",
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
  botonRechazar: {
    backgroundColor: "red",
  },
  textoSinGasto: {
    fontWeight: "bold",
    fontSize: 25,
    textAlign: "center",
    color: "white",
    lineHeight: 30,
    paddingHorizontal: 50,
    paddingTop: 200,
  },
  seccionDerecha: {
    justifyContent: "center",
    alignItems: "center",
    flex: 0.4,
  },
});
