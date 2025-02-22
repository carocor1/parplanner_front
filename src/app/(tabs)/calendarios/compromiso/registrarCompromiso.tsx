import React, { useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { useRouter } from "expo-router";
import SaveButton from "@/src/components/SaveButton";
import CancelButton from "@/src/components/CancelButton";

const RegistrarCompromiso = () => {
  const [nombre, setNombre] = useState("");
  const [fecha, setFecha] = useState("");
  const [tipoCompromiso, setTipoCompromiso] = useState("");
  const [errors, setErrors] = useState("");
  const router = useRouter();

  const validarInput = () => {
    setErrors("");
    if (!nombre) {
      setErrors("El campo 'Nombre' es obligatorio.");
      return false;
    }

    if (!fecha) {
      setErrors("El campo 'Fecha' es obligatorio.");
      return false;
    }

    if (!tipoCompromiso) {
      setErrors("El campo 'Tipo de compromiso' es obligatorio.");
      return false;
    }

    return true;
  };

  const registrarCompromiso = () => {
    if (!validarInput()) {
      return;
    }

    setNombre("");
    setFecha("");
    setTipoCompromiso("");

    router.back();
  };

  return (
    <View style={styles.container}>
      {/* Mostrar los campos de input */}
      <TextInput
        style={styles.input}
        placeholder="Nombre"
        value={nombre}
        onChangeText={setNombre}
      />
      <TextInput
        style={styles.input}
        placeholder="Fecha"
        value={fecha}
        onChangeText={setFecha}
      />
      <TextInput
        style={styles.input}
        placeholder="Tipo de compromiso"
        value={tipoCompromiso}
        onChangeText={setTipoCompromiso}
      />

      {/* Mostrar los mensajes de error si existen */}
      {errors ? <Text style={styles.errorText}>{errors}</Text> : null}

      {/* Botones */}
      <SaveButton onPress={registrarCompromiso} texto={"Guardar"} />
      <CancelButton onPress={() => router.back()} texto={"Cancelar"} />
    </View>
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
    marginBottom: 25,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
  },
  errorText: {
    color: "red",
    marginBottom: 10,
  },
});

export default RegistrarCompromiso;
