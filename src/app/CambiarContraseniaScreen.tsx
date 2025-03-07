import { StyleSheet, Text, View } from "react-native";
import React from "react";
import Colors from "../constants/Colors";
import InputComponentInicioSesion from "../components/InputInicioSesion";
import CustomButton from "../components/CustomButton";
import { enviarCodigoCambiarContraseña } from "../services/authService";
import { ALERT_TYPE, Toast } from "react-native-alert-notification";
import { router } from "expo-router";
import SmallLoadingIndicator from "../components/SmallLoadingIndicator";

export default function cambiarContraseñaScreen() {
  const [email, SetEmail] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const validateEmail = () => {
    let errors = "";
    if (!email) {
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

  const enviarCodigo = async () => {
    if (validateEmail()) {
      try {
        setLoading(true);
        await enviarCodigoCambiarContraseña(email);
        setLoading(false);
        router.push("/IngresoCodigoCambioContraseniaScreen");
      } catch (error) {
        setLoading(false);
        Toast.show({
          type: ALERT_TYPE.WARNING,
          title: "Error",
          textBody: "El mail ingresado no corresponde a un usuario registrado.",
        });
      }
    }
  };
  return (
    <View style={styles.pantalla}>
      <Text style={styles.titulo}>Olvidé mi contraseña</Text>
      <Text style={styles.subtitulo}>
        Ingresá tu dirección de correo electrónico registrado y te enviaremos un
        código alfanumérico que deberás ingresar para poder actualizar tu
        contraseña.
      </Text>
      <InputComponentInicioSesion
        label="Email"
        value={email}
        setFunction={SetEmail}
        iconName="envelope"
        iconType="font-awesome"
        keyboardType="email-address"
      />
      <CustomButton
        title="ENVIAR CÓDIGO"
        backgroundColor={Colors.naranja.naranjaNormal}
        onPress={enviarCodigo}
        textColor="white"
      />
      {loading && (
        <SmallLoadingIndicator
          text="Enviando código..."
          color={Colors.verde.verdeMuyOscuro}
          textColor={Colors.verde.verdeMuyOscuro}
          backColor={Colors.verde.verdeIntermedio}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  pantalla: {
    backgroundColor: Colors.verde.verdeIntermedio,
    flex: 1,
    paddingHorizontal: 25,
    justifyContent: "center",
  },
  titulo: {
    color: Colors.verde.verdeOscuro3,
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
