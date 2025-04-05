import React, { useEffect, useState } from "react";
import { Calendar } from "react-native-calendars";
import {
  StyleSheet,
  View,
  Text,
  Modal,
  TouchableOpacity,
  FlatList,
} from "react-native";
import Colors from "@/src/constants/Colors";
import { Evento } from "../interfaces/EventoInteface";
import CustomButton from "./CustomButton";

interface CalendarioPlanningProps {
  fechasAsignadasCreador: string[];
  fechasAsignadasParticipe: string[];
  eventos?: Evento[];
}

const CalendarioPlanning: React.FC<CalendarioPlanningProps> = ({
  fechasAsignadasCreador,
  fechasAsignadasParticipe,
  eventos = [],
}) => {
  const [markedDates, setMarkedDates] = useState<{ [key: string]: any }>({});
  const [modalVisible, setModalVisible] = useState(false);
  const [eventosSeleccionados, setEventosSeleccionados] = useState<Evento[]>(
    []
  );

  useEffect(() => {
    const marcarFechas = () => {
      const fechasMarcadas: { [key: string]: any } = {};

      fechasAsignadasCreador.forEach((fecha) => {
        fechasMarcadas[fecha] = {
          selected: true,
          selectedColor: Colors.naranja.naranjaClaro,
          selectedTextColor: "black",
        };
      });

      fechasAsignadasParticipe.forEach((fecha) => {
        fechasMarcadas[fecha] = {
          selected: true,
          selectedColor: Colors.lila.lilaClaro,
          selectedTextColor: "black",
        };
      });

      setMarkedDates(fechasMarcadas);
    };

    marcarFechas();
  }, [fechasAsignadasCreador, fechasAsignadasParticipe]);

  const hoy = new Date();
  const fechaActual = hoy.toISOString().split("T")[0];

  const handleDayPress = (day: { dateString: string }) => {
    const eventosDelDia = eventos.filter(
      (e) =>
        new Date(e.diaEvento).toISOString().split("T")[0] === day.dateString
    );
    if (eventosDelDia.length > 0) {
      setEventosSeleccionados(eventosDelDia);
      setModalVisible(true);
    }
  };

  return (
    <View style={styles.container}>
      <Calendar
        markedDates={markedDates}
        markingType={"multi-dot"}
        locale={"es"}
        minDate={fechaActual}
        disableMonthChange={false}
        onDayPress={handleDayPress}
      />

      {/* Modal para mostrar información de los eventos */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPressOut={() => setModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>EVENTOS DEL DÍA</Text>
            {eventosSeleccionados.length > 0 ? (
              <FlatList
                data={eventosSeleccionados}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <View style={styles.eventoContainer}>
                    <Text style={styles.eventoNombre}>{item.nombre}</Text>
                    <Text style={styles.modalText}>
                      <Text style={{ fontWeight: "bold" }}>Hora Inicio:</Text>{" "}
                      {item.horaInicio}
                    </Text>
                    <Text style={styles.modalText}>
                      <Text style={{ fontWeight: "bold" }}>Hora Fin:</Text>{" "}
                      {item.horaFin}
                    </Text>
                  </View>
                )}
              />
            ) : (
              <Text style={styles.modalText}>
                No hay eventos para este día.
              </Text>
            )}
            <CustomButton
              title="CERRAR"
              backgroundColor={Colors.gris.oscuro}
              textColor="white"
              onPress={() => setModalVisible(false)}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 10,
    paddingVertical: 20,
    width: "90%",
    alignItems: "center",
    maxHeight: "80%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: "center",
    color: "black",
  },
  eventoContainer: {
    width: "100%",
    marginBottom: 10,
    backgroundColor: Colors.gris.muymuyClaro,
    overflow: "hidden",
    paddingHorizontal: 110,
  },

  eventoNombre: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.rosa.rosaPetitte,
    textAlign: "center",
    marginBottom: 3,
  },
});

export default CalendarioPlanning;
