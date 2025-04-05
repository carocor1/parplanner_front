import { StyleSheet, Text, View, ScrollView } from "react-native";
import React, { useState } from "react";
import { useFocusEffect, router } from "expo-router";
import LoadingIndicator from "@/src/components/LoadingIndicator";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import EventoItem from "@/src/components/EventoItem";
import Colors from "@/src/constants/Colors";
import FloatingActionButton from "@/src/components/FloatingActionButton";
import CalendarioPlanning from "@/src/components/CalendarioPlanningDef";
import CustomButton from "@/src/components/CustomButton";
import { getProgenitorIdFromToken } from "@/src/utils/storage";
import { getEventos } from "@/src/services/eventoService";
import { Evento } from "@/src/interfaces/EventoInteface";

const EventosScreen = () => {
  const [loading, setLoading] = useState(true);
  const [listaEventos, setListaEventos] = useState<Evento[]>([]);
  const [usuarioLogueadoId, setUsuarioLogueadoId] = useState(0);
  const [fechasEventos, setFechasEventos] = useState<string[]>([]);

  const fetchEventos = async () => {
    try {
      const id = await getProgenitorIdFromToken();
      if (id) {
        setUsuarioLogueadoId(id);
      }
      setLoading(true);
      const eventos = await getEventos();
      setListaEventos(eventos);
      if (listaEventos.length > 0) {
        const fechasFormateadas = eventos.map(
          (evento) => new Date(evento.diaEvento).toISOString().split("T")[0]
        );
        setFechasEventos(fechasFormateadas);
      }
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

  const registrarEvento = () => {
    router.push("/(tabs)/eventos/RegistrarEventoScreen");
  };

  if (loading) {
    return <LoadingIndicator />;
  }

  return (
    <View style={styles.container}>
      {listaEventos.length > 0 && (
        <View style={styles.containerTexto}>
          <Text style={styles.texto}>PENDIENTES</Text>
        </View>
      )}
      <View style={styles.calendarioContainer}>
        <CalendarioPlanning
          fechasAsignadasCreador={fechasEventos}
          fechasAsignadasParticipe={[]}
          eventos={listaEventos}
        />
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        {listaEventos.length > 0 ? (
          listaEventos.map((evento) => (
            <EventoItem
              key={evento.id}
              evento={evento}
              usuarioLogueadoId={usuarioLogueadoId}
              onRecargar={fetchEventos}
            />
          ))
        ) : (
          <View style={styles.sinEventosContainer}>
            <MaterialIcons name="event" size={160} color="lightgray" />
            <Text style={styles.textoSinEvento}>
              No hay eventos disponibles. ¡Crea uno!
            </Text>
            <CustomButton
              title="CREAR EVENTO"
              backgroundColor={Colors.marron.marronClaro}
              textColor={Colors.marron.marronNormal}
              onPress={registrarEvento}
            ></CustomButton>
          </View>
        )}
      </ScrollView>

      {listaEventos.length > 0 && (
        <FloatingActionButton
          onPress={() => router.push("/(tabs)/eventos/RegistrarEventoScreen")}
          backgroundColor={Colors.verde.verdeOscuro}
        />
      )}
    </View>
  );
};

export default EventosScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  EventosContainer: {
    backgroundColor: "white",
    justifyContent: "flex-start",
    marginTop: 20,
    flex: 1,
  },
  texto: {
    color: Colors.lila.lilaNormal,
    fontWeight: "bold",
    fontSize: 20,
    textAlign: "center",
  },
  calendarioContainer: {
    margin: 10,
    backgroundColor: "white",
    width: "100%",
    height: 310,
  },
  containerTexto: {
    backgroundColor: Colors.lila.lilaClaro,
    padding: 10,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  textoSinEvento: {
    color: Colors.lila.lilaNormal,
    fontWeight: "bold",
    fontSize: 25,
    textAlign: "center",
  },
  sinEventosContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 60,
  },
});
