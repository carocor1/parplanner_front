import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableWithoutFeedback,
  Dimensions,
} from "react-native";
import SaveButton from "@/src/components/SaveButton";
import CancelButton from "@/src/components/CancelButton";
import { Gasto } from "@/src/interfaces/GastoInterface";
import InputSpinner from "react-native-input-spinner";
import { rechazarParticion } from "@/src/services/propuestaParticionService";
import { PropuestaParticion } from "@/src/interfaces/PropuestasParticionInterface";

const screenHeight = Dimensions.get("window").height;

type Props = {
  visible: boolean;
  onClose: () => void;
  gasto: Gasto;
  idUsuarioLogueado: number;
  propuestaParticion: PropuestaParticion;
};

const ProponerParticionScreen: React.FC<Props> = ({
  visible,
  onClose,
  gasto,
  idUsuarioLogueado,
  propuestaParticion,
}) => {
  const esCreador = gasto.usuario_creador.id === idUsuarioLogueado;
  const [particionCreadorSeleccionada, setParticionCreadorSeleccionada] =
    useState(propuestaParticion.particion_usuario_creador_gasto);
  const [particionParticipeSeleccionada, setParticionParticipeSeleccionada] =
    useState(propuestaParticion.particion_usuario_participe_gasto);

  const handleParticionChange = (value: number) => {
    setParticionCreadorSeleccionada(value);
    setParticionParticipeSeleccionada(100 - value);
  };

  const handleParticion2Change = (num: number) => {
    setParticionParticipeSeleccionada(num);
    setParticionCreadorSeleccionada(100 - num);
  };

  const handleSubmit = async () => {
    try {
      await rechazarParticion(
        propuestaParticion.id,
        particionCreadorSeleccionada,
        particionParticipeSeleccionada
      );
      onClose();
    } catch (error) {
      console.error("Error al enviar la partición:", error);
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalBackground}>
          <TouchableWithoutFeedback onPress={() => {}}>
            <View style={styles.modalContainer}>
              <Text style={styles.title}>Proponer Nueva Partición</Text>

              <View style={styles.particiones}>
                <View style={styles.grupoParticionIndividual}>
                  <Text style={styles.labelParticion}>
                    {esCreador
                      ? "Vos %:"
                      : `${gasto.usuario_creador.nombre} %:`}
                  </Text>
                  <InputSpinner
                    max={100}
                    min={0}
                    step={10}
                    skin="round"
                    value={particionCreadorSeleccionada}
                    onChange={handleParticionChange}
                    color="#cccccc"
                    style={styles.spinner}
                  />
                  <Text style={styles.pagarLabel}>
                    {esCreador ? "Pagarás:" : `Pagará:`}
                  </Text>
                  <Text style={styles.pagarValue}>
                    ${(particionCreadorSeleccionada * gasto.monto) / 100}
                  </Text>
                </View>

                <View style={styles.grupoParticionIndividual}>
                  <Text style={styles.labelParticion}>
                    {!esCreador
                      ? "Vos %:"
                      : `${gasto.usuario_participe.nombre} %:`}
                  </Text>
                  <InputSpinner
                    max={100}
                    min={0}
                    step={5}
                    skin="round"
                    value={particionParticipeSeleccionada}
                    onChange={handleParticion2Change}
                    color="#cccccc"
                    style={styles.spinner}
                  />
                  <Text style={styles.pagarLabel}>
                    {!esCreador ? "Pagarás:" : `Pagará:`}
                  </Text>
                  <Text style={styles.pagarValue}>
                    ${(particionParticipeSeleccionada * gasto.monto) / 100}
                  </Text>
                </View>
              </View>

              <View style={styles.buttonContainer}>
                <CancelButton texto="CERRAR" onPress={onClose} />
                <SaveButton texto="ENVIAR" onPress={handleSubmit} />
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  },
  modalContainer: {
    width: "100%",
    height: screenHeight * 0.38,
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  particiones: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    marginTop: 10,
  },
  grupoParticionIndividual: {
    alignItems: "center",
    marginHorizontal: 20,
  },
  labelParticion: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 5,
  },
  spinner: {
    width: 140,
  },
  pagarLabel: {
    marginTop: 10,
  },
  pagarValue: {
    fontWeight: "bold",
    fontSize: 22,
    color: "#555",
  },
});

export default ProponerParticionScreen;
