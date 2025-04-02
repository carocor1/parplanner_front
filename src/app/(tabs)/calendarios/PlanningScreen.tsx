import { router, useFocusEffect } from "expo-router";
import { Text, View, ScrollView, StyleSheet } from "react-native";
import React, { useCallback, useState } from "react";
import { ALERT_TYPE, Toast } from "react-native-alert-notification";
import { getProgenitorIdFromToken } from "@/src/utils/storage";
import {
  aprobarPlanning,
  getPlanningsByProgenitor,
} from "@/src/services/planningService";
import { Planning } from "@/src/interfaces/PlanningInterface";
import LoadingIndicator from "@/src/components/LoadingIndicator";
import CustomEstadoRectangulo from "@/src/components/CustomEstadoRectangulo";
import CalendarioPlanning from "@/src/components/CalendarioPlanningDef";
import CustomButton from "@/src/components/CustomButton";
import Colors from "@/src/constants/Colors";

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
        pathname: "/(tabs)/calendarios/CreacionPlanningScreen",
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
                    <Text style={styles.titulo}>
                      {esPendiente
                        ? "Planning Propuesto"
                        : esAprobado
                        ? "Planning Activo"
                        : "Planning"}
                    </Text>

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
                    <CustomEstadoRectangulo
                      estado={planning.estado.nombre}
                      backgroundColor={
                        esAprobado
                          ? Colors.azul.azulClaro
                          : Colors.naranja.naranjaClaro
                      }
                      textColor={
                        esAprobado
                          ? Colors.azul.azulOscuro
                          : Colors.naranja.naranjaOscuro
                      }
                    />
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
                    <CustomButton
                      onPress={rechazarSolicitudPlanning}
                      backgroundColor={Colors.rojo.rojoOscuro}
                      textColor="white"
                      title="RECHAZAR"
                    ></CustomButton>
                    <CustomButton
                      onPress={aprobarSolicitudPlanning}
                      backgroundColor={Colors.verde.verdeOscuro2}
                      textColor="white"
                      title=" APROBAR "
                    ></CustomButton>
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
              <Text style={styles.textoSinPlanning}>
                ¡Registrá un nuevo Planning para comenzar!
              </Text>
              <CustomButton
                onPress={() =>
                  router.push("/(tabs)/calendarios/CreacionPlanningScreen")
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
    backgroundColor: Colors.lila.lilaNormal,
    justifyContent: "center",
    paddingHorizontal: 15,
  },
  PlanningsContainer: {
    marginTop: 70,
    backgroundColor: "white",
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
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 50,
  },
  textoSinPlanning: {
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
