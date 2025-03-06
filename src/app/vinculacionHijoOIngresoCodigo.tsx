import { useRouter } from "expo-router";
import SaveButton from "../components/SaveButton";
import { Text, View } from "../components/Themed";
import { StyleSheet } from "react-native";
import { useState } from "react";
import { verificarCodigoVinculacion } from "../services/hijoService";
import CancelButton from "../components/CancelButton";
import { enviarCodigoDeVinculacion } from "../services/hijoService";
import CustomTextInput from "../components/TextInput";
import Colors from "../constants/Colors";
import { Toast, ALERT_TYPE } from "react-native-alert-notification";
import SmallLoadingIndicator from "../components/SmallLoadingIndicator";
import CustomCodeInput from "../components/CustomCodeInput";
import CustomButton from "../components/CustomButton";
import { cerrarSesion } from "../services/authService";

const vinculacionHijoOIngresoCodigoScreen = () => {
  const router = useRouter();
  const [value, setValue] = useState("");
  const [email, setEmail] = useState("");
  const [loadingEnvioCodigo, setLoadingEnvioCodigo] = useState(false);
  const [loadingVerificarCodigo, setLoadingVerificarCodigo] = useState(false);

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
      setLoadingVerificarCodigo(true);
      await verificarCodigoVinculacion(value);
      setLoadingVerificarCodigo(false);
      router.push("/(tabs)/gastos/");
    } catch (error) {
      setLoadingVerificarCodigo(false);
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: "Error",
        textBody: "El código de vinculación ingresado no es válido.",
      });
    }
  };

  const enviarCodigo = async () => {
    if (!email) {
      Toast.show({
        type: ALERT_TYPE.WARNING,
        title: "Email inválido",
        textBody: "Por favor, reingresá el email del otro progenitor.",
      });
      return;
    }
    try {
      setLoadingEnvioCodigo(true);
      await enviarCodigoDeVinculacion(email);
      setLoadingEnvioCodigo(false);
      Toast.show({
        type: ALERT_TYPE.SUCCESS,
        title: "Éxito",
        textBody: "El código de vinculación ha sido enviado correctamente.",
      });
    } catch (error) {
      setLoadingEnvioCodigo(false);
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: "Error",
        textBody:
          "No pudimos enviar el código de vinculación correctamente. Por favor, intentá nuevamente.",
      });
    }
  };

  return (
    <View style={styles.container_mayor}>
      <Text style={styles.titulo}>¡Ya registraste a tu hijo!</Text>
      <View style={styles.container}>
        <Text style={styles.text}>
          A continuación, ingresá el email del otro progenitor para enviarle un
          código de vinculación que deberá introducir para finalizar la
          asociación.
        </Text>
        <View style={styles.input}>
          <CustomTextInput
            label="Email"
            placeholder="Escribe el email del progenitor a invitar"
            value={email}
            onChangeText={(email) => {
              setEmail(email);
            }}
            primaryColor={Colors.verde.verdeMuyOscuro}
            keyboardType="email-address"
          />
        </View>
        <SaveButton texto="ENVIAR" onPress={() => enviarCodigo()} />
        {loadingEnvioCodigo && (
          <SmallLoadingIndicator
            text="Enviando código..."
            color={Colors.verde.verdeMuyOscuro}
            textColor={Colors.verde.verdeMuyOscuro}
            backColor={Colors.gris.fondo}
          />
        )}
      </View>
      <View style={styles.container}>
        <Text style={styles.o_text}>
          ------------------------- Ó -------------------------
        </Text>
        <Text style={styles.text}>
          Si ya recibiste un código de vinculación por parte del otro
          progenitor, entonces ingresalo a continuación:
        </Text>

        <CustomCodeInput
          value={value}
          setValue={setValue}
          cellCount={6}
          loading={loadingVerificarCodigo}
          loadingText="Verificando código..."
          loadingColor={Colors.verde.verdeMuyOscuro}
          loadingTextColor={Colors.verde.verdeMuyOscuro}
          borderColor={Colors.gris.claro}
          focusBorderColor={Colors.verde.verdeMuyOscuro}
          focusTextColor={Colors.verde.verdeMuyOscuro}
          backColor={Colors.gris.muyClaro}
          backColorIndicator={Colors.gris.fondo}
        />

        <CancelButton texto="VERIFICAR" onPress={verificarCodigo} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container_mayor: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.gris.fondo,
  },
  container: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.gris.fondo,
    padding: 20,
  },
  titulo: {
    fontSize: 30,
    textAlign: "center",
    color: "black",
    fontWeight: "bold",
    marginBottom: 25,
    marginHorizontal: 20,
    lineHeight: 40,
  },
  input: {
    width: "100%",
    backgroundColor: Colors.gris.fondo,
    marginBottom: 13,
  },
  text: {
    color: "grey",
    textAlign: "center",
    fontSize: 18,
    fontWeight: "normal",
    marginBottom: 20,
    lineHeight: 28,
  },
  o_text: {
    color: "grey",
    textAlign: "center",
    fontWeight: "normal",
    fontSize: 20,
    marginBottom: 30,
    lineHeight: 30,
  },
});

export default vinculacionHijoOIngresoCodigoScreen;
