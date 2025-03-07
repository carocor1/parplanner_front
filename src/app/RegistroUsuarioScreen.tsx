import { StyleSheet } from "react-native";
import { Text, View } from "@/src/components/Themed";
import React, { useState } from "react";
import { useRouter } from "expo-router";
import Colors from "../constants/Colors";
import InputComponentInicioSesion from "@/src/components/InputInicioSesion";
import SaveButton from "@/src/components/SaveButton";
import { register } from "../services/authService";
import { ALERT_TYPE, Toast } from "react-native-alert-notification";

const registrarUsuarioScreen = () => {
  const [nombre, SetNombre] = useState("");
  const [password, SetPassword] = useState("");
  const [email, setEmail] = useState("");
  const [apellido, SetApellido] = useState("");
  const router = useRouter();
  const [passwordConfirmation, SetPasswordConfirmation] = useState("");

  const validarInput = () => {
    let errors = "";
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!nombre) {
      errors = "No se ha ingresado el nombre";
    } else if (!apellido) {
      errors = "No se ha ingresado el apellido";
    } else if (!password) {
      errors = "No se ha ingresado la contraseña";
    } else if (!email) {
      errors = "No se ha ingresado el email";
    } else if (!emailRegex.test(email)) {
      errors = "El email ingresado no es válido";
    } else if (!passwordConfirmation) {
      errors = "No se ha ingresado la confirmación de la contraseña";
    } else if (password !== passwordConfirmation) {
      errors = "Las contraseñas no coinciden";
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
      router.replace("/RegistroProgenitorScreen");
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
      <Text style={styles.subtitulo}>
        Completá con tus datos personales para finalizar el registro.
      </Text>

      <InputComponentInicioSesion
        label="Nombre"
        value={nombre}
        setFunction={SetNombre}
        iconName="user"
        iconType="font-awesome"
        autoCapitalize="words"
      />
      <InputComponentInicioSesion
        label="Apellido"
        value={apellido}
        setFunction={SetApellido}
        iconName="user"
        iconType="font-awesome"
        autoCapitalize="words"
      />
      <InputComponentInicioSesion
        label="Email"
        value={email}
        setFunction={setEmail}
        iconName="envelope"
        iconType="font-awesome"
        keyboardType="email-address"
      />
      <InputComponentInicioSesion
        label="Contraseña"
        value={password}
        setFunction={SetPassword}
        iconName="eye"
        iconType="font-awesome"
        secureTextEntry
      />
      <InputComponentInicioSesion
        label="Repetir contraseña"
        value={passwordConfirmation}
        setFunction={SetPasswordConfirmation}
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
    backgroundColor: Colors.verde.verdeIntermedio,
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
    marginTop: 50,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.verde.verdeIntermedio,
  },
  forgotPasswordText: {
    color: "white",
    textAlign: "left",
    marginTop: 10,
    textDecorationLine: "underline",
    fontWeight: "bold",
  },
  text: {
    fontFamily: "sans-serif",
    marginTop: -30,
    fontSize: 45,
    fontWeight: "bold",
    textAlign: "center",
    color: Colors.verde.verdeOscuro3,
  },
  subtitulo: {
    fontSize: 18,
    textAlign: "center",
    color: "white",
    fontWeight: "normal",
    paddingHorizontal: 15,
    marginBottom: 10,
  },
});

export default registrarUsuarioScreen;
