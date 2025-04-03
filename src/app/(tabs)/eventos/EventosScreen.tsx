import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useFocusEffect, router } from "expo-router";
import LoadingIndicator from "@/src/components/LoadingIndicator";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { getEventos } from "@/src/services/evento";
import { Evento } from "@/src/interfaces/EventoInteface";
import EventoItem from "@/src/components/EventoItem";
import Colors from "@/src/constants/Colors";
import FloatingActionButton from "@/src/components/FloatingActionButton";

const EventosScreen = () => {
  const [loading, setLoading] = useState(true);
  const [listaEventos, setListaEventos] = useState<Evento[]>([]);
  const [usuarioLogueadoId, setUsuarioLogueadoId] = useState(0);

  const fetchEventos = async () => {
    try {
      setLoading(true);
      const eventos = await getEventos();
      setListaEventos(eventos);
    } catch (error) {
      console.error("Error al recuperar los eventos:", error);
    } finally {
      setLoading(false);
    }
  };

  // Recargar eventos cada vez que la pantalla se pone en foco
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
      <View style={styles.containerTitulo}>
        <Text style={styles.titulo}>EVENTOS</Text>
      </View>

      {listaEventos.length > 0 && (
        <View style={styles.containerTexto}>
          <Text style={styles.texto}>PENDIENTES</Text>
        </View>
      )}

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
            <MaterialIcons name="event" size={200} color="lightgray" />
            <Text style={styles.textoSinEvento}>
              No hay eventos disponibles. ¡Crea uno!
            </Text>

            <TouchableOpacity style={styles.button} onPress={registrarEvento}>
              <Text style={styles.buttonText}>CREAR EVENTO</Text>
            </TouchableOpacity>
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
  noEventosText: {
    textAlign: "center",
    fontSize: 16,
    color: "gray",
    marginTop: 20,
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
  titulo: {
    fontSize: 26,
    fontWeight: "bold",
    alignSelf: "center",
    marginBottom: 10,
    textAlign: "center",
    color: Colors.rosa.rosaOscuro,
  },
  texto: {
    color: Colors.lila.lilaNormal,
    fontWeight: "bold",
    fontSize: 20,
    textAlign: "center",
  },
  containerTexto: {
    backgroundColor: Colors.lila.lilaClaro,
    padding: 10,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 0,
    width: "100%",
    marginTop: 40,
  },
  textoSinEvento: {
    color: Colors.lila.lilaNormal,
    fontWeight: "bold",
    fontSize: 25,
    textAlign: "center",
    marginTop: 20,
  },
  sinEventosContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
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
