import { StyleSheet, Text, View } from "react-native";
import React from "react";
import Colors from "../constants/Colors";
import InputComponentInicioSesion from "../components/InputIniciosesion";
import CustomButton from "../components/CustomButton";
import { ALERT_TYPE, Toast } from "react-native-alert-notification";
import { router } from "expo-router";
import { crearContraseña } from "../services/authService";

const crearNuevaContraseniaScreen = () => {
  const [password, SetPassword] = React.useState("");
  const [passwordConfirmation, SetPasswordConfirmation] = React.useState("");

  const validateInput = () => {
    let errors = "";
    if (!password) {
      errors = "No se ha ingresado la contraseña";
    }
    if (!passwordConfirmation) {
      errors = "No se ha ingresado la confirmación de la contraseña";
    }
    if (password !== passwordConfirmation) {
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

  const actualizarContraseña = async () => {
    if (!validateInput()) {
      return;
    }
    try {
      await crearContraseña(password);
      router.push("/inicioSesion");
    } catch (error) {
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: "Error",
        textBody:
          "Error al actualizar contraseña. Por favor, inténtalo de nuevo.",
      });
    }
  };

  return (
    <View style={styles.pantalla}>
      <Text style={styles.titulo}>Actualizar contraseña</Text>
      <Text style={styles.subtitulo}>
        Ingresá tu nueva contraseña y confirmala para poder continuar.
      </Text>
      <InputComponentInicioSesion
        label="Nueva contraseña"
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

      <CustomButton
        title="ACTUALIZAR CONTRASEÑA"
        backgroundColor={Colors.naranja.naranjaNormal}
        onPress={actualizarContraseña}
        textColor="white"
      />
    </View>
  );
};

export default crearNuevaContraseniaScreen;

const styles = StyleSheet.create({
  pantalla: {
    backgroundColor: Colors.verde.verdeIntermedio,
    flex: 1,
    paddingHorizontal: 25,
    justifyContent: "center",
  },
  titulo: {
    color: "white",
    fontSize: 35,
    fontWeight: "bold",
  },
  subtitulo: {
    color: "white",
    fontSize: 18,
    fontWeight: "normal",
    marginRight: 45,
  },
});
