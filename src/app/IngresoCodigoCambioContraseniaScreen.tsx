import { StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import Colors from "../constants/Colors";
import CustomButton from "../components/CustomButton";
import { ALERT_TYPE, Toast } from "react-native-alert-notification";
import { verificarCodigoCambioContraseña } from "../services/authService";
import { router } from "expo-router";
import CustomCodeInput from "../components/CustomCodeInput";

export default function IngresoCodigoCambioContraseniaScreen() {
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);

  const verificarCodigo = async () => {
    if (value.length !== 6) {
      Toast.show({
        type: ALERT_TYPE.WARNING,
        title: "Error",
        textBody: "El código ingresado no es válido.",
      });
      return;
    }
    try {
      setLoading(true);
      await verificarCodigoCambioContraseña(value);
      setLoading(false);
      router.push("/CrearNuevaContraseniaScreen");
    } catch (error) {
      setLoading(false);
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: "Error",
        textBody: "El código ingresado no es válido.",
      });
    }
  };

  return (
    <View style={styles.pantalla}>
      <Text style={styles.titulo}>Te enviamos un mail.</Text>
      <Text style={styles.subtitulo}>
        Te acabamos de enviar un correo con el código al mail que ingresaste.
        Por favor, introducelo a continuación:
      </Text>

      <CustomCodeInput
        value={value}
        setValue={setValue}
        cellCount={6}
        loading={loading}
        loadingText="Verificando código..."
        loadingColor={Colors.verde.verdeMuyOscuro}
        loadingTextColor={Colors.verde.verdeMuyOscuro}
        borderColor={Colors.verde.verdeClaro}
        focusBorderColor={Colors.verde.verdeMuyOscuro}
        focusTextColor={Colors.verde.verdeMuyOscuro}
        backColor={"white"}
        backColorIndicator={Colors.verde.verdeIntermedio}
      />

      <CustomButton
        title="VERIFICAR"
        backgroundColor={Colors.naranja.naranjaNormal}
        onPress={verificarCodigo}
        textColor="white"
      />
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
    marginBottom: 20,
  },
});
