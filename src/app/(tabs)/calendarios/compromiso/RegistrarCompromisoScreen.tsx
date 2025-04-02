import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  ScrollView,
  Switch,
} from "react-native";
import { useRouter } from "expo-router";
import SaveButton from "@/src/components/SaveButton";
import CancelButton from "@/src/components/CancelButton";
import DatePickerEvento from "@/src/components/DatePickerEvento";
import TimePickerEvento from "@/src/components/TimePickerEvento";

const RegistrarCompromisoScreen = () => {
  const [nombre, setNombre] = useState("");
  const [diaEvento, setDiaEvento] = useState("");
  const [horaInicio, setHoraInicio] = useState("");
  const [horaFin, setHoraFin] = useState("");
  const [alarmaCreador, setAlarmaCreador] = useState(false);
  const [errors, setErrors] = useState("");

  const router = useRouter();

  const validarInput = () => {
    setErrors("");
    if (!nombre) {
      setErrors("El campo 'Nombre' es obligatorio.");
      return false;
    }

    if (!diaEvento) {
      setErrors("El campo 'dia Evento' es obligatorio.");
      return false;
    }

    if (!horaInicio) {
      setErrors("El campo 'Hora de Inicio' es obligatorio.");
      return false;
    }

    return true;
  };

  const registrarCompromiso = () => {
    if (!validarInput()) {
      return;
    }

    setNombre("");
    setDiaEvento("");
    setHoraInicio("");
    setHoraFin("");
    setAlarmaCreador(false);

    router.back();
  };

  const noGuardarCompromiso = () => {
    router.back();
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Nombre"
            value={nombre}
            onChangeText={setNombre}
          ></TextInput>
        </View>
      </View>
      <View style={styles.card}>
        <View style={styles.inputContainer}>
          <DatePickerEvento
            onDateChange={(date) => setDiaEvento(date.toLocaleDateString())}
            minimumDate={new Date()}
          />

          <TimePickerEvento
            placeholder="Hora Inicio"
            onTimeChange={(time) => setHoraInicio(time)}
          ></TimePickerEvento>

          <View style={styles.inputContainer}>
            <TimePickerEvento
              placeholder="Hora Fin"
              onTimeChange={(time) => setHoraFin(time)}
            ></TimePickerEvento>
          </View>

          <View style={styles.input}>
            <Text style={[styles.label, !alarmaCreador && { color: "#6666" }]}>
              Recordatorio
            </Text>
            <Switch
              value={alarmaCreador}
              onValueChange={(value) => setAlarmaCreador(value)}
            ></Switch>
          </View>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <CancelButton
          texto={"Cancelar"}
          onPress={noGuardarCompromiso}
        ></CancelButton>
        <SaveButton
          texto={"Guardar"}
          onPress={registrarCompromiso}
        ></SaveButton>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    padding: 20,
  },
  input: {
    width: "100%",
    padding: 10,
    marginBottom: 0,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    marginTop: 0,
  },
  errorText: {
    color: "red",
    marginBottom: 10,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 10,
    padding: 10,
    marginBottom: 25,
    justifyContent: "flex-start",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#ddd",
    width: "100%",
  },
  inputContainer: {
    marginTop: 0,
    marginBottom: 15,
    width: "100%",
    justifyContent: "center",
  },
  scrollContainer: {
    flexGrow: 1,
  },
  label: {
    color: "black",
    fontSize: 15,
    justifyContent: "center",
    alignItems: "center",
    textAlign: "justify",
  },
  buttonContainer: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default RegistrarCompromisoScreen;
