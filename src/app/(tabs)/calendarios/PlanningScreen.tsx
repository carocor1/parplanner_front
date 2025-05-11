import { router, useFocusEffect } from "expo-router";
import {
  Text,
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
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
import CustomHeader from "@/src/components/CustomHeader";
import CustomTextBox from "@/src/components/CustomTextBox";
import { Evento } from "@/src/interfaces/EventoInteface";
import { getEventos } from "@/src/services/eventoService";
import FloatingActionButton from "@/src/components/FloatingActionButton";
import EventosModal from "./EventosModal";

export default function PlanningScreen() {
  const [planning, setPlanning] = useState<Planning | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [progenitorLogueadoId, setProgenitorLogueadoId] = useState<number>();
  const [listaEventos, setListaEventos] = useState<Evento[]>([]);
  const [menuVisible, setMenuVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

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

  const fetchEventos = async () => {
    try {
      const id = await getProgenitorIdFromToken();
      if (id) {
        setProgenitorLogueadoId(id);
      }
      setLoading(true);
      const eventos = await getEventos();
      setListaEventos(eventos);
    } catch (error) {
      console.error("Error al recuperar los eventos:", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchEventos();
    }, [])
  );

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

  const handleNuevoPlanning = () => {
    setMenuVisible(false);
    if (planning) {
      expirarPlanning();
    } else {
      router.push("/calendarios/CreacionPlanningScreen");
    }
  };

  const handleNuevoEvento = () => {
    setMenuVisible(false);
    router.push("/calendarios/RegistrarEventoScreen");
  };

  const getTextoDinamico = () => {
    if (planning == null && listaEventos.length === 0) {
      return "No hay ningún evento ni planning disponible, ¡crea uno!";
    } else if (planning == null) {
      return "No hay ningún planning disponible, ¡crea uno!";
    }
    return null;
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
    <TouchableWithoutFeedback onPress={() => setMenuVisible(false)}>
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
                    eventos={listaEventos}
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
                  {listaEventos.length > 0 && (
                    <CustomButton
                      onPress={() => setModalVisible(true)}
                      title="VER EVENTOS PRÓXIMOS"
                      backgroundColor={Colors.marron.marronClaro}
                      textColor={Colors.marron.marronNormal}
                    ></CustomButton>
                  )}
                </View>
              </>
            ) : (
              <View style={styles.container}>
                <View style={styles.containerTituloNoPlanning}>
                  <Text style={styles.tituloNoPlanning}>PLANNING</Text>
                </View>
                <View style={styles.sinPlanningsContainer}>
                  <CalendarioPlanning
                    fechasAsignadasCreador={[]}
                    fechasAsignadasParticipe={[]}
                    eventos={listaEventos}
                  />

                  {getTextoDinamico() && (
                    <Text style={styles.textoSinPlanning}>
                      {getTextoDinamico()}
                    </Text>
                  )}
                  {listaEventos.length > 0 && (
                    <CustomButton
                      onPress={() => setModalVisible(true)}
                      title="VER EVENTOS PRÓXIMOS"
                      backgroundColor={Colors.marron.marronClaro}
                      textColor={Colors.marron.marronNormal}
                    ></CustomButton>
                  )}
                </View>
              </View>
            )}
          </View>
        </ScrollView>
        <View style={styles.floatingButton}>
          <FloatingActionButton
            onPress={() => setMenuVisible(!menuVisible)}
            iconSize={24}
            iconColor="white"
            backgroundColor={Colors.rosa.rosaOscuro}
          />
        </View>
        {menuVisible && (
          <>
            <View style={styles.overlay} />
            <View style={styles.menu}>
              {!esPendiente && (
                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={handleNuevoPlanning}
                >
                  <Text style={styles.menuText}>Nuevo Planning</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                style={styles.menuItem}
                onPress={handleNuevoEvento}
              >
                <Text style={styles.menuText}>Nuevo Evento</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
        {/* Modal de eventos */}
        {progenitorLogueadoId && (
          <EventosModal
            visible={modalVisible}
            onClose={() => setModalVisible(false)}
            eventos={listaEventos}
            usuarioLogueadoId={progenitorLogueadoId}
            onRecargar={fetchEventos}
          />
        )}
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    justifyContent: "center",
  },
  PlanningsContainer: {
    marginTop: 100,
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
  textoEvento: {
    color: "blue",
    textDecorationLine: "underline",
    fontSize: 16,
    textAlign: "center",
    marginTop: 10,
    fontStyle: "italic",
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
    paddingHorizontal: 70,
    marginTop: -20,
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
    marginBottom: 0,
    textAlign: "center",
    color: Colors.rosa.rosaOscuro,
  },
  sinPlanningsContainer: {
    marginTop: 10,
    backgroundColor: "white",
    borderRadius: 15,
    alignSelf: "center",
    padding: 15,
    justifyContent: "center",
    flex: 1,
    width: "100%",
    marginHorizontal: 200,
    marginBottom: 170,
  },
  textoSinPlanning: {
    color: Colors.negro.negroNormal,
    fontWeight: "bold",
    fontSize: 25,
    textAlign: "center",
    marginTop: 90,
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 1,
  },
  menu: {
    position: "absolute",
    bottom: 65,
    right: 45,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
    zIndex: 2,
  },
  menuItem: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  menuText: {
    fontSize: 16,
    color: Colors.rosa.rosaOscuro,
  },
  floatingButton: {
    bottom: 13,
    zIndex: 3,
  },
});
