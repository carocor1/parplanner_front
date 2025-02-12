import {
  StyleSheet,
  TextInput,
  Button,
  Pressable,
  TouchableOpacity,
} from "react-native";
import { Text, View } from "@/src/components/Themed";
import React, { useState, useEffect } from "react";
import { Link, useRouter } from "expo-router";
import { Colors } from "react-native/Libraries/NewAppScreen";
import InputComponentInicioSesion from "@/src/components/InputIniciosesion";
import SaveButton from "@/src/components/SaveButton";
import { login } from "@/src/services/authService";
import {
  verificarHijoAsociado,
  verificarRegistroUsuario,
} from "@/src/services/userService";
import { verificarSegundoProgenitorAsociado } from "@/src/services/hijoService";

const IniciarSesion = () => {
  const [email, SetEmail] = useState("");
  const [password, SetPassword] = useState("");
  const [errors, setErrors] = useState("");

  const router = useRouter();

  const validarInput = () => {
    setErrors("");
    if (!email) {
      setErrors("No se ha ingresado el email");
      return false;
    }
    if (!password) {
      setErrors("No se ha ingresado la contraseña");
      return false;
    }
    return true;
  };

  const olvidarContraseña = () => {
    console.log("Enviando a la pantalla de recuperar contraseña");
  };

  const onLogin = async () => {
    if (!validarInput()) {
      return;
    }
    try {
      await login(email, password);
      //SetEmail("");
      //SetPassword("");

      const tieneHijoAsociado = await verificarHijoAsociado();
      const estaRegistrado = await verificarRegistroUsuario();

      if (!estaRegistrado) {
        router.push("/registroProgenitor");
      }
      if (estaRegistrado && !tieneHijoAsociado) {
        router.push("/registroHijoOIngresoCodigo");
      }
      if (estaRegistrado && tieneHijoAsociado) {
        const segundoProgenitorAsociado =
          await verificarSegundoProgenitorAsociado();
        if (segundoProgenitorAsociado) {
          router.push("/(tabs)/gastos/");
        } else {
          router.push("/vinculacionHijoOIngresoCodigo");
        }
      }
    } catch (error) {
      setErrors(
        "Error al iniciar sesión. Por favor, verifica tus credenciales e intenta nuevamente."
      );
    }
  };

  const RegistrarUsuario = () => {
    router.push("/registroUsuario");
  };

  return (
    <View style={styles.container}>
      <InputComponentInicioSesion
        label="Email"
        value={email}
        setFunction={SetEmail}
        iconName="user"
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
      <TouchableOpacity onPress={olvidarContraseña}>
        <Text style={styles.forgotPasswordText}> Olvidé mi contraseña</Text>
      </TouchableOpacity>

      <Text style={styles.error}>{errors}</Text>

      <View style={styles.buttonContainer}>
        <SaveButton texto="Iniciar Sesión" onPress={onLogin} />
      </View>
      <Text style={styles.SignUp}>¿No tienes una cuenta? </Text>
      <TouchableOpacity onPress={RegistrarUsuario}>
        <Text style={styles.SignUp2}> Registrate</Text>
      </TouchableOpacity>
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
  error: {
    color: "red",
    textAlign: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#a9bb7c",
    marginBottom: 20,
    marginTop: 30,
  },
  forgotPasswordText: {
    color: "#FFFFFF", // Color azul para el texto clickeable
    textAlign: "left",
    marginTop: 10,
    textDecorationLine: "underline",
    fontWeight: "bold", // Subrayar el texto para indicar que es clickeable
  },
  SignUp: {
    marginVertical: 1, // Espaciado vertical
    fontSize: 14,
    color: "black",
    fontWeight: "bold",
    textAlign: "center",
  },
  SignUp2: {
    marginVertical: 1, // Espaciado vertical
    fontSize: 14,
    color: "black",
    fontWeight: "bold",
    textAlign: "center",
    textDecorationLine: "underline",
  },
});

export default IniciarSesion;
