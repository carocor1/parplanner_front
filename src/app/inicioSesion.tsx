import { StyleSheet, TouchableOpacity, Image } from "react-native";
import { Text, View } from "@/src/components/Themed";
import React, { useState } from "react";
import { useRouter } from "expo-router";
import Colors from "@/src/constants/Colors";
import InputComponentInicioSesion from "@/src/components/InputIniciosesion";
import { login } from "@/src/services/authService";
import {
  verificarHijoAsociado,
  verificarRegistroUsuario,
} from "@/src/services/userService";
import { verificarSegundoProgenitorAsociado } from "@/src/services/hijoService";
import GoogleLogInButton from "../components/GoogleLogInButton";
import CustomButton from "../components/CustomButton";

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
      SetEmail("");
      SetPassword("");
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
          router.push("/(tabs)/gastos/gasto");
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
      <Text style={styles.titulo}>Iniciar Sesión</Text>
      <Text style={styles.subtitulo}>
        {" "}
        Ingresá tus credenciales para acceder a tu cuenta
      </Text>

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
        <Text style={styles.forgotPasswordText}>Olvidé mi contraseña</Text>
      </TouchableOpacity>

      <Text style={styles.error}>{errors}</Text>

      <CustomButton
        title="INICIAR SESIÓN"
        onPress={onLogin}
        backgroundColor={Colors.naranja.naranjaNormal}
        textColor="white"
      />
      <GoogleLogInButton />
      <Text style={styles.SignUp}>¿No tienes una cuenta? </Text>
      <TouchableOpacity onPress={RegistrarUsuario}>
        <Text style={styles.SignUp2}>Registrate</Text>
      </TouchableOpacity>
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
  titulo: {
    fontSize: 45,
    fontWeight: "bold",
    textAlign: "center",
    color: "white",
  },
  subtitulo: {
    fontSize: 18,
    textAlign: "center",
    color: "white",
    fontWeight: "normal",
    paddingHorizontal: 15,
    marginBottom: 100,
  },
  error: {
    color: "red",
    textAlign: "center",
  },
  forgotPasswordText: {
    color: "#FFFFFF",
    textAlign: "left",
    marginTop: 7,
    textDecorationLine: "underline",
    fontWeight: "bold",
    marginLeft: 10,
  },
  SignUp: {
    marginTop: 100,
    marginVertical: 1,
    fontSize: 14,
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  SignUp2: {
    marginVertical: 1,
    fontSize: 14,
    color: Colors.verde.verdeOscuro3,
    fontWeight: "bold",
    textAlign: "center",
    textDecorationLine: "underline",
  },
});

export default IniciarSesion;
