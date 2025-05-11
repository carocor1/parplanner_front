import React from "react";
import {
  Modal,
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableWithoutFeedback,
} from "react-native";
import Colors from "@/src/constants/Colors";
import EventoItem from "@/src/components/EventoItem";
import { Evento } from "@/src/interfaces/EventoInteface";
import CustomButton from "@/src/components/CustomButton";

interface EventosModalProps {
  visible: boolean;
  onClose: () => void;
  eventos: Evento[];
  usuarioLogueadoId: number;
  onRecargar: () => void;
}

const EventosModal: React.FC<EventosModalProps> = ({
  visible,
  onClose,
  eventos,
  usuarioLogueadoId,
  onRecargar,
}) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContent}>
              <View style={styles.contenedorTitulo}>
                <Text style={styles.modalTitulo}>Eventos Próximos</Text>
              </View>
              <ScrollView
                style={styles.scrollViewContainer}
                showsVerticalScrollIndicator={true}
                keyboardShouldPersistTaps="handled"
              >
                {eventos.length > 0 ? (
                  eventos.map((evento) => (
                    <EventoItem key={evento.id} evento={evento} />
                  ))
                ) : (
                  <View style={styles.sinEventosContainer}>
                    <Text style={styles.textoSinEvento}>
                      No hay eventos disponibles.
                    </Text>
                  </View>
                )}
              </ScrollView>
              <CustomButton
                title="CERRAR"
                onPress={onClose}
                backgroundColor={Colors.gris.muyClaro}
                textColor={Colors.gris.oscuro}
              ></CustomButton>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};
export default EventosModal;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: "70%",
  },
  modalTitulo: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: Colors.lila.lilaNormal,
  },
  scrollViewContainer: {
    marginTop: 10,
  },
  sinEventosContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  textoSinEvento: {
    color: Colors.lila.lilaNormal,
    fontWeight: "bold",
    fontSize: 18,
    textAlign: "center",
  },
  contenedorTitulo: {
    backgroundColor: Colors.lila.lilaClaro,
    marginTop: -20,
    paddingTop: 10,
    marginHorizontal: -20,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
  },
});
