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
              {(esPendiente)&& <View style={styles.containerTitulo}>
                <Text style={styles.titulo}>PLANNING PROPUESTO</Text>
              </View>}
              {(esAprobado)&& <View style={styles.containerTitulo}>
                <Text style={styles.titulo}>PLANNING ACTIVO</Text>
              </View>}
              {(!esAprobado &&!esPendiente)&& <View style={styles.containerTitulo}>
                <Text style={styles.titulo}>PLANNING</Text>
              </View>}
              <View style={styles.PlanningsContainer}>
                <View style={styles.estiloAlineacion}>
                  <View style={esPendiente ? { flex: 0.5 } : { flex: 0.6 }}>
                    

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
                  <View style={styles.containerPlanning}>
                    <Text style={styles.textoPlanning}>
                    {planning.usuario_participe.nombre.toUpperCase()} DEBERÁ APROBAR EL PLANNING QUE PROPUSISTE
                  </Text>
                  </View>
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
    backgroundColor: "white",
    justifyContent: "center",

  },
  PlanningsContainer: {
    marginTop: 20,
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
    fontSize: 26,
    fontWeight: "bold",
    alignSelf: "center",
    marginBottom: 10,
    textAlign: "center",
    color: Colors.rosa.rosaOscuro,
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
  containerTitulo: {
    backgroundColor: Colors.rosa.rosaPetitte,
    borderBottomLeftRadius: 60,
    borderBottomRightRadius: 60,
    alignItems: "center",
    height: "16%",
    width: "100%",
    padding: 10,
    justifyContent: "center",
  },
  textoPlanning: {
    color: Colors.marron.marronNormal,
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
  },
  containerPlanning: {
    backgroundColor: Colors.marron.marronClaro,
    padding: 10,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 10,
    width: "100%",
  },
});
