import React, { useState } from "react";
import { StyleSheet, TextInput, View, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import DatePickerEvento from "@/src/components/DatePickerEvento";
import TimePickerEvento from "@/src/components/TimePickerEvento";
import { registrarEvento } from "@/src/services/eventoService";
import { ALERT_TYPE, Toast } from "react-native-alert-notification";
import Colors from "@/src/constants/Colors";
import CustomButton from "@/src/components/CustomButton";
import LoadingIndicator from "@/src/components/LoadingIndicator";
import CustomHeader from "@/src/components/CustomHeader";

const RegistrarEventoScreen = () => {
  const [nombre, setNombre] = useState("");
  const [diaEvento, setDiaEvento] = useState<Date | null>(null);
  const [horaInicio, setHoraInicio] = useState("");
  const [horaFin, setHoraFin] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const validarInput = () => {
    if (!nombre) {
      return "El campo 'Nombre' es obligatorio.";
    }
    if (!diaEvento) {
      return "El campo 'Día del Evento' es obligatorio.";
    }
    if (!horaInicio) {
      return "El campo 'Hora Inicio' es obligatorio.";
    }
    if (!horaFin) {
      return "El campo 'Hora Fin' es obligatorio.";
    }
    if (horaInicio >= horaFin) {
      return "La hora de fin debe ser mayor a la hora de inicio.";
    }
    return null;
  };

  const registrarCompromiso = async () => {
    const error = validarInput();
    if (error) {
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: "Error",
        textBody: error,
      });
      return;
    }
    setLoading(true);
    try {
      if (diaEvento) {
        await registrarEvento(nombre, diaEvento, horaInicio, horaFin, false);
        Toast.show({
          type: ALERT_TYPE.SUCCESS,
          title: "Éxito",
          textBody: "Evento registrado correctamente.",
        });
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
      <CustomHeader
        title="EVENTO"
        backgroundColor={Colors.rosa.rosaPetitte}
        textColor={Colors.rosa.rosaOscuro}
      />
      <View style={styles.card}>
        <TextInput
          style={styles.input}
          placeholder="Nombre"
          value={nombre}
          onChangeText={setNombre}
        />
        <DatePickerEvento
          onDateChange={(date) => setDiaEvento(date)}
          minimumDate={new Date()}
        />
        <TimePickerEvento
          placeholder="Hora Inicio"
          onTimeChange={(time) => setHoraInicio(time)}
        />
        <TimePickerEvento
          placeholder="Hora Fin"
          onTimeChange={(time) => setHoraFin(time)}
        />
      </View>
      <View style={styles.buttonContainer}>
        <CustomButton
          title="CANCELAR"
          backgroundColor={Colors.rojo.rojoNormal}
          textColor="white"
          onPress={() => router.back()}
        />
        <CustomButton
          title="GUARDAR"
          backgroundColor={Colors.marron.marronClaro}
          textColor={Colors.marron.marronNormal}
          onPress={registrarCompromiso}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    padding: 20,
  },
  input: {
    width: "100%",
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    marginBottom: 15,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    width: "100%",
    elevation: 3,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
});

export default RegistrarEventoScreen;
