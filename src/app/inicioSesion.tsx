import { StyleSheet, TouchableOpacity } from "react-native";
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
import { ALERT_TYPE, Toast } from "react-native-alert-notification";
import LoadingIndicator from "../components/LoadingIndicator";

const IniciarSesionScreen = () => {
  const [email, SetEmail] = useState("");
  const [password, SetPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const validarInput = () => {
    let errors = "";
    if (!email) {
      errors = "No se ha ingresado el email";
    }
    if (!password) {
      errors = "No se ha ingresado la contraseña";
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

  const onLogin = async () => {
    if (!validarInput()) {
      return;
    }
    try {
      setLoading(true);
      await login(email, password);
      SetEmail("");
      SetPassword("");
      const tieneHijoAsociado = await verificarHijoAsociado();
      const estaRegistrado = await verificarRegistroUsuario();
      if (!estaRegistrado) {
        setLoading(false);
        router.push("/registroProgenitor");
      }
      if (estaRegistrado && !tieneHijoAsociado) {
        setLoading(false);
        router.push("/registroHijoOIngresoCodigo");
      }
      if (estaRegistrado && tieneHijoAsociado) {
        const segundoProgenitorAsociado =
          await verificarSegundoProgenitorAsociado();
        if (segundoProgenitorAsociado) {
          setLoading(false);
          router.push("/(tabs)/gastos/gasto");
        } else {
          setLoading(false);
          router.push("/vinculacionHijoOIngresoCodigo");
        }
      }
    } catch (error) {
      setLoading(false);
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: "Error",
        textBody:
          "Error al iniciar sesión. Por favor, verifica tus credenciales e intenta nuevamente.",
      });
    }
  };

  if (loading) {
    return <LoadingIndicator />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Iniciar Sesión</Text>
      <Text style={styles.subtitulo}>
        Ingresá tus credenciales para acceder a tu cuenta.
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
      <TouchableOpacity onPress={() => router.push("/cambiarContrasenia")}>
        <Text style={styles.forgotPasswordText}>Olvidé mi contraseña</Text>
      </TouchableOpacity>

      <CustomButton
        title="INICIAR SESIÓN"
        onPress={onLogin}
        backgroundColor={Colors.naranja.naranjaNormal}
        textColor="white"
      />
      <GoogleLogInButton />
      <Text style={styles.SignUp}>¿No tienes una cuenta? </Text>
      <TouchableOpacity onPress={() => router.push("/registroUsuario")}>
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
    color: Colors.verde.verdeOscuro3,
  },
  subtitulo: {
    fontSize: 18,
    textAlign: "center",
    color: "white",
    fontWeight: "normal",
    paddingHorizontal: 15,
    marginBottom: 100,
  },
  forgotPasswordText: {
    color: "white",
    textAlign: "left",
    marginTop: 7,
    textDecorationLine: "underline",
    fontWeight: "bold",
    marginLeft: 10,
    marginBottom: 30,
  },
  SignUp: {
    marginTop: 100,
    marginVertical: 1,
    fontSize: 16,
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  SignUp2: {
    marginVertical: 1,
    fontSize: 16,
    color: Colors.verde.verdeOscuro3,
    fontWeight: "bold",
    textAlign: "center",
    textDecorationLine: "underline",
  },
});

export default IniciarSesionScreen;
