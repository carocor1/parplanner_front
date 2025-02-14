import { useRouter } from "expo-router";
import SaveButton from "../components/SaveButton";
import { Text, View } from "../components/Themed";
import { Button, Platform, StyleSheet } from "react-native";
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from "react-native-confirmation-code-field";
import { useState } from "react";
import { verificarCodigoVinculacion } from "../services/hijoService";
import CancelButton from "../components/CancelButton";
import Colors from "../constants/Colors";

const registroHijoOIngresoCodigoScreen = () => {
  const router = useRouter();
  const CELL_COUNT = 6;

  const [value, setValue] = useState("");
  const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });

  const verificarCodigo = async () => {
    if (value.length !== CELL_COUNT) {
      //Mejorar alerta
      alert("El código ingresado no es válido");
      return;
    }
    try {
      await verificarCodigoVinculacion(value);
      router.push("/(tabs)/gastos/");
    } catch (error) {
      alert(
        "Error al verificar el código de vinculación. Por favor, inténtalo de nuevo."
      );
    }
  };

  return (
    <View style={styles.container_mayor}>
      <Text style={styles.titulo}>¡Sólo te falta vincular a tu hijo!</Text>
      <View style={styles.container}>
        <Text style={styles.text}>
          <Text style={styles.bold}>Registrá a tu hijo</Text> y luego enviale un{" "}
          <Text style={styles.bold}>código de vinculación</Text> al email del
          otro progenitor para que se asocie
        </Text>
        <SaveButton
          texto="REGISTRAR HIJO"
          onPress={() => router.push("/registrohijo")}
        />
      </View>
      <View style={styles.container}>
        <Text style={styles.o_text}>
          ------------------------- Ó -------------------------
        </Text>
        <Text style={styles.text}>
          Si ya recibiste un{" "}
          <Text style={styles.bold}>código de vinculación</Text> por parte del
          otro progenitor, entonces <Text style={styles.bold}>ingresalo</Text> a
          continuación:
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
    backgroundColor: "#f5f5f5",
  },
  container: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  titulo: {
    fontSize: 30,
    textAlign: "center",
    color: Colors.verde.verdeMuyOscuro,
    fontWeight: "bold",
    marginBottom: 25,
    marginHorizontal: 20,
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
  },
  bold: {
    fontWeight: "bold",
    color: Colors.negro.negroNormal,
  },
  root: { flex: 1, padding: 20 },
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
    borderColor: "#ced4da",
    textAlign: "center",
    margin: 3,
    backgroundColor: "#e9ecef",
    borderRadius: 6,
  },
  focusCell: {
    borderColor: "#778c43",
    color: "#778c43",
  },
});

export default registroHijoOIngresoCodigoScreen;
