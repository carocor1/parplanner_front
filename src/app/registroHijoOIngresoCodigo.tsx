import { useRouter } from "expo-router";
import SaveButton from "../components/SaveButton";
import { Text, View } from "../components/Themed";
import { StyleSheet } from "react-native";
import { useState } from "react";
import { verificarCodigoVinculacion } from "../services/hijoService";
import CancelButton from "../components/CancelButton";
import Colors from "../constants/Colors";
import { ALERT_TYPE, Toast } from "react-native-alert-notification";
import CustomCodeInput from "../components/CustomCodeInput";

const registroHijoOIngresoCodigoScreen = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState("");

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
      console.log("verificando código de vinculación");
      console.log(value);
      await verificarCodigoVinculacion(value);
      setLoading(false);
      router.push("/(tabs)/gastos/gasto");
    } catch (error) {
      setLoading(false);
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: "Error",
        textBody: "El código de vinculación ingresado no es válido.",
      });
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

        <CustomCodeInput
          value={value}
          setValue={setValue}
          cellCount={6}
          loading={loading}
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
});

export default registroHijoOIngresoCodigoScreen;
