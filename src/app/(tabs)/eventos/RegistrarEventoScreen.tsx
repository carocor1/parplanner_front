import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import DatePickerEvento from "@/src/components/DatePickerEvento";
import TimePickerEvento from "@/src/components/TimePickerEvento";
import { registrarEvento } from "@/src/services/evento";
import { ALERT_TYPE, Toast } from "react-native-alert-notification";
import Colors from "@/src/constants/Colors";
import LoadingIndicator from "@/src/components/LoadingIndicator";

const RegistrarEventoScreen = () => {
  const [nombre, setNombre] = useState("");
  const [diaEvento, setDiaEvento] = useState("");
  const [horaInicio, setHoraInicio] = useState("");
  const [horaFin, setHoraFin] = useState("");
  const [alarmaCreador, setAlarmaCreador] = useState(false);
  const [errors, setErrors] = useState("");
  const [loading, setLoading] = useState(false);
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

  const registrarCompromiso = async () => {
    if (!validarInput()) {
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: "Error",
        textBody: errors,
      });
      return;
    }
    setLoading(true);
    try {
      if (nombre && diaEvento && horaInicio) {
        await registrarEvento(
          nombre,
          diaEvento,
          horaInicio,
          horaFin,
          alarmaCreador
        );
        setNombre("");
        setDiaEvento("");
        setHoraInicio("");
        setHoraFin("");
        setAlarmaCreador(false);

        router.back();
      }
    } catch (error) {
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: "Error",
        textBody: "Error al crear el Evento. Por favor, inténtalo de nuevo.",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingIndicator />;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.containerTitulo}>
        <Text style={styles.titulo}>EVENTO</Text>
      </View>
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
            onDateChange={(date) => {
              const year = date.getFullYear();
              const month = String(date.getMonth() + 1).padStart(2, "0");
              const day = String(date.getDate()).padStart(2, "0");
              const formattedDate = `${year}-${month}-${day}`;
              setDiaEvento(formattedDate);
            }}
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
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.buttonCancelar}
          onPress={() => router.back()}
        >
          <Text style={styles.buttonTextCancelar}>CANCELAR</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={registrarCompromiso}>
          <Text style={styles.buttonText}>GUARDAR</Text>
        </TouchableOpacity>
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
    justifyContent: "space-between",
    alignItems: "center",
    gap: 20,
  },
  button: {
    backgroundColor: Colors.marron.marronClaro,
    padding: 10,
    borderRadius: 10,
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: Colors.marron.marronNormal,
    fontWeight: "bold",
    fontSize: 20,
  },

  buttonCancelar: {
    backgroundColor: "#d86c5a",
    padding: 10,
    borderRadius: 10,
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  buttonTextCancelar: {
    color: "white",
    fontWeight: "bold",
    fontSize: 20,
  },
  containerTitulo: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.rosa.rosaPetitte,
    borderBottomLeftRadius: 60,
    borderBottomRightRadius: 60,
    alignItems: "center",
    height: "16%",
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
});

export default RegistrarEventoScreen;
