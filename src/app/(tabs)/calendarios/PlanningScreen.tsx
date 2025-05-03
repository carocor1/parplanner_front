import { router, useFocusEffect } from "expo-router";
import {
  Text,
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
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
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import CustomHeader from "@/src/components/CustomHeader";
import CustomTextBox from "@/src/components/CustomTextBox";

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

  const expirarPlanning = () => {
    if (planning) {
      router.push({
        pathname: "/(tabs)/calendarios/CreacionPlanningScreen",
        params: { planningExpiradoId: planning.id },
      });
    } else {
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: "Error",
        textBody: "No se puede expirar el planning porque falta información.",
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
              {esPendiente && (
                <CustomHeader
                  title="PLANNING PROPUESTO"
                  backgroundColor={Colors.rosa.rosaPetitte}
                  textColor={Colors.rosa.rosaOscuro}
                />
              )}
              {esAprobado && (
                <CustomHeader
                  title="PLANNING ACTIVO"
                  backgroundColor={Colors.rosa.rosaPetitte}
                  textColor={Colors.rosa.rosaOscuro}
                />
              )}
              {!esAprobado && !esPendiente && (
                <CustomHeader
                  title="PLANNING"
                  backgroundColor={Colors.rosa.rosaPetitte}
                  textColor={Colors.rosa.rosaOscuro}
                />
              )}
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
                  <CustomTextBox
                    text={`${planning.usuario_participe.nombre.toUpperCase()} DEBERÁ APROBAR EL PLANNING QUE PROPUSISTE`}
                    backgroundColor={Colors.marron.marronClaro}
                    textColor={Colors.marron.marronNormal}
                  ></CustomTextBox>
                )}
                {esAprobado && (
                  <View style={{ marginTop: 40 }}>
                    <Text
                      style={{
                        fontSize: 14,
                        marginBottom: -10,
                        color: Colors.gris.oscuro,
                      }}
                    >
                      ¿No querés seguir manteniendo este planning activo?
                    </Text>
                    <CustomButton
                      onPress={expirarPlanning}
                      title="PROPONER NUEVO PLANNING"
                      backgroundColor={Colors.azul.azulOscuro}
                      textColor={Colors.azul.azulClaro}
                    ></CustomButton>
                  </View>
                )}
              </View>
            </>
          ) : (
            <View style={styles.container}>
              <View style={styles.containerTituloNoPlanning}>
                <Text style={styles.tituloNoPlanning}>PLANNING</Text>
              </View>

              <View style={styles.sinPlanningsContainer}>
                <MaterialIcons
                  name="calendar-month"
                  size={200}
                  color="lightgray"
                />
                <Text style={styles.textoSinPlanning}>
                  ¡Registrá un nuevo Planning para comenzar!
                </Text>

                <TouchableOpacity
                  style={styles.button}
                  onPress={() =>
                    router.push("/(tabs)/calendarios/CreacionPlanningScreen")
                  }
                >
                  <Text style={styles.buttonText}>REGISTRAR PLANNING</Text>
                </TouchableOpacity>
              </View>
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
    marginTop: 130,
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

  seccionDerecha: {
    justifyContent: "center",
    alignItems: "center",
    flex: 0.4,
  },
  containerTituloNoPlanning: {
    backgroundColor: Colors.rosa.rosaPetitte,
    borderBottomLeftRadius: 60,
    borderBottomRightRadius: 60,
    alignItems: "center",
    padding: 10,
    justifyContent: "center",
    width: "100%",
  },
  tituloNoPlanning: {
    fontSize: 26,
    fontWeight: "bold",
    alignSelf: "center",
    marginBottom: 10,
    textAlign: "center",
    color: Colors.rosa.rosaOscuro,
  },
  sinPlanningsContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    marginTop: 20,
    marginBottom: 40,
  },
  textoSinPlanning: {
    color: Colors.lila.lilaNormal,
    fontWeight: "bold",
    fontSize: 25,
    textAlign: "center",
    marginTop: 20,
  },
  button: {
    backgroundColor: Colors.marron.marronClaro,
    padding: 10,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30,
  },
  buttonText: {
    color: Colors.marron.marronNormal,
    fontWeight: "bold",
    fontSize: 24,
  },
});
