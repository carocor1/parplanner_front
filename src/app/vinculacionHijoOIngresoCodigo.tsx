import { useRouter } from "expo-router";
import SaveButton from "../components/SaveButton";
import { Text, View } from "../components/Themed";
import { ActivityIndicator, StyleSheet } from "react-native";
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from "react-native-confirmation-code-field";
import { useState } from "react";
import { verificarCodigoVinculacion } from "../services/hijoService";
import CancelButton from "../components/CancelButton";
import { enviarCodigoDeVinculacion } from "../services/hijoService";
import CustomTextInput from "../components/TextInput";
import Colors from "../constants/Colors";
import { Toast, ALERT_TYPE } from "react-native-alert-notification";

const vinculacionHijoOIngresoCodigoScreen = () => {
  const router = useRouter();
  const CELL_COUNT = 6;

  const [value, setValue] = useState("");
  const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const verificarCodigo = async () => {
    if (value.length !== CELL_COUNT) {
      Toast.show({
        type: ALERT_TYPE.WARNING,
        title: "Error",
        textBody: "El código ingresado no es válido.",
      });
      return;
    }
    try {
      await verificarCodigoVinculacion(value);
      router.push("/(tabs)/gastos/");
    } catch (error) {
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: "Error",
        textBody: "Error al verificar código. Por favor, inténtalo de nuevo.",
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
      setLoading(true);
      await enviarCodigoDeVinculacion(email);
      setLoading(false);
      Toast.show({
        type: ALERT_TYPE.SUCCESS,
        title: "Éxito",
        textBody: "El código de vinculación ha sido enviado correctamente.",
      });
    } catch (error) {
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
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator
              size="small"
              color={Colors.verde.verdeMuyOscuro}
            />
            <Text
              style={{
                color: Colors.verde.verdeMuyOscuro,
                fontWeight: "bold",
                marginTop: 5,
              }}
            >
              Enviando código...
            </Text>
          </View>
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

        <CodeField
          ref={ref}
          {...props}
          value={value}
          onChangeText={setValue}
          cellCount={CELL_COUNT}
          rootStyle={styles.codeFieldRoot}
          keyboardType="name-phone-pad"
          textContentType="oneTimeCode"
          autoComplete="sms-otp"
          renderCell={({ index, symbol, isFocused }) => (
            <Text
              key={index}
              style={[styles.cell, isFocused && styles.focusCell]}
              onLayout={getCellOnLayoutHandler(index)}
            >
              {symbol || (isFocused ? <Cursor /> : null)}
            </Text>
          )}
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
  title: { textAlign: "center", fontSize: 30, color: "black" },
  codeFieldRoot: { marginBottom: 20 },
  cell: {
    width: 50,
    height: 58,
    lineHeight: 43,
    fontSize: 30,
    fontWeight: "bold",
    color: "black",
    borderWidth: 3,
    borderColor: Colors.gris.claro,
    textAlign: "center",
    margin: 3,
    backgroundColor: Colors.gris.muyClaro,
    borderRadius: 6,
  },
  focusCell: {
    borderColor: Colors.verde.verdeMuyOscuro,
    color: Colors.verde.verdeMuyOscuro,
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    backgroundColor: Colors.gris.fondo,
  },
});

export default vinculacionHijoOIngresoCodigoScreen;
