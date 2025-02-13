import { useRouter } from "expo-router";
import SaveButton from "../components/SaveButton";
import { Text, View } from "../components/Themed";
import { StyleSheet, TextInput } from "react-native";
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

  const enviarCodigo = async () => {
    if (!email) {
      alert("Ingresá un email válido");
      return;
    }
    try {
      await enviarCodigoDeVinculacion(email);
      alert("Se ha enviado el código de vinculación al email ingresado");
    } catch (error) {
      alert(
        "Error al enviar el código de vinculación. Por favor, inténtalo de nuevo."
      );
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
        <TextInput
          placeholder="otroprogenitor@gmail.com"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          keyboardType="email-address"
        />
        <SaveButton texto="ENVIAR" onPress={() => enviarCodigo()} />
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
          keyboardType="number-pad"
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
    justifyContent: "center", // Centra los contenedores internos verticalmente
    alignItems: "center", // Centra los contenedores internos horizontalmente
    backgroundColor: "#f5f5f5",
  },
  container: {
    justifyContent: "center", // Centra el contenido verticalmente
    alignItems: "center", // Centra el contenido horizontalmente
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  titulo: {
    fontSize: 30,
    textAlign: "center",
    color: "black",
    fontWeight: "bold",
    marginBottom: 25,
    marginHorizontal: 20,
    lineHeight: 40, // Aumenta el interlineado
  },
  text: {
    color: "grey",
    textAlign: "center",
    fontSize: 18,
    fontWeight: "normal",
    marginBottom: 20,
    lineHeight: 28, // Aumenta el interlineado
  },
  input: {
    borderWidth: 1,
    borderColor: "#ced4da",
    borderRadius: 15,
    marginBottom: 20,
    width: "100%",
    padding: 10,
    fontSize: 16,
    backgroundColor: "#e9ecef",
  },
  o_text: {
    color: "grey",
    textAlign: "center",
    fontWeight: "normal",
    fontSize: 20,
    marginBottom: 30,
    lineHeight: 30,
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

export default vinculacionHijoOIngresoCodigoScreen;
