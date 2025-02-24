import { StyleSheet } from "react-native";
import { Text, View } from "@/src/components/Themed";
import React, { useState } from "react";
import { useRouter } from "expo-router";
import { Colors } from "react-native/Libraries/NewAppScreen";

import InputComponentInicioSesion from "@/src/components/InputIniciosesion";
import SaveButton from "@/src/components/SaveButton";
import { register } from "../services/authService";
import { ALERT_TYPE, Toast } from "react-native-alert-notification";

const registrarUsuarioPantalla = () => {
  const [nombre, SetNombre] = useState("");
  const [password, SetPassword] = useState("");
  const [email, setEmail] = useState("");
  const [apellido, SetApellido] = useState("");
  const router = useRouter();

  const validarInput = () => {
    let errors = "";
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!nombre) {
      errors = "No se ha ingresado el usuario";
    } else if (!password) {
      errors = "No se ha ingresado la contraseña";
    } else if (!apellido) {
      errors = "No se ha ingresado el apellido";
    } else if (!email) {
      errors = "No se ha ingresado el email";
    } else if (!emailRegex.test(email)) {
      errors = "El email ingresado no es válido";
    }

    if (errors) {
      Toast.show({
        type: ALERT_TYPE.WARNING,
        title: "Error",
        textBody: errors,
      });
      return false;
    }

    return true;
  };

  const registrarse = async () => {
    if (!validarInput()) {
      return;
    }
    try {
      await register(email, password, nombre, apellido);
      setEmail("");
      SetNombre("");
      SetPassword("");
      SetApellido("");
      router.replace("/registroProgenitor");
    } catch (error) {
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: "Error",
        textBody: "Error al registrar usuario. Por favor, inténtalo de nuevo.",
      });
      console.error("Error al registrar usuario:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Registrate</Text>

      <InputComponentInicioSesion
        label="Nombre"
        value={nombre}
        setFunction={SetNombre}
        iconName="user"
        iconType="font-awesome"
      />
      <InputComponentInicioSesion
        label="Apellido"
        value={apellido}
        setFunction={SetApellido}
        iconName="user"
        iconType="font-awesome"
      />
      <InputComponentInicioSesion
        label="Email"
        value={email}
        setFunction={setEmail}
        iconName="envelope"
        iconType="font-awesome"
      />
      <InputComponentInicioSesion
        label="Contraseña"
        value={password}
        setFunction={SetPassword}
        iconName="eye"
        iconType="font-awesome"
        secureTextEntry
      />

      <View style={styles.buttonContainer}>
        <SaveButton texto="Crear Cuenta" onPress={registrarse} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: "#a9bb7c",
    flex: 1,
    justifyContent: "center",
    alignContent: "center",
    paddingTop: 50,
  },
  image: {
    width: "50%",
    aspectRatio: 1,
    alignSelf: "center",
  },
  textButton: {
    alignSelf: "center",
    fontWeight: "bold",
    color: Colors.light.tint,
    marginVertical: 10,
  },
  label: {
    color: "gray",
  },
  input: {
    borderWidth: 1,
    borderColor: "transparent",
    padding: 10,
    marginTop: 5,
    marginBottom: 20,
    backgroundColor: "white",
    borderRadius: 5,
  },
  buttonContainer: {
    marginTop: 30,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#a9bb7c",
  },
  forgotPasswordText: {
    color: "#FFFFFF",
    textAlign: "left",
    marginTop: 10,
    textDecorationLine: "underline",
    fontWeight: "bold",
  },
  text: {
    fontFamily: "sans-serif",
    fontSize: 36,
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 90,
    marginTop: -30,
  },
});

export default registrarUsuarioPantalla;
