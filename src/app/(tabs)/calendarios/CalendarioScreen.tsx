import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import ComponenteCalendario from "@/src/components/ComponenteCalendario";
import CustomButton from "@/src/components/CustomButton";
import Colors from "@/src/constants/Colors";

export default function CalendarioScreen() {
  const [fechasSeleccionadas, setFechasSeleccionadas] = useState<string[]>([]);

  const manejarFechasSeleccionadas = (fechas: string[]) => {
    setFechasSeleccionadas(fechas);
  };

  return (
    <View style={styles.container}>
      <View style={styles.calendarioContainer}>
        <ComponenteCalendario onSelectDates={manejarFechasSeleccionadas} />
      </View>

      <TouchableOpacity
        style={styles.botonFlotante}
        onPress={() =>
          router.push(
            "/(tabs)/calendarios/compromiso/RegistrarCompromisoScreen"
          )
        }
      >
        <FontAwesome name="plus" size={24} color="white" />
      </TouchableOpacity>

      <CustomButton
        title="ELEGIR PLANNING"
        onPress={() =>
          router.push("/(tabs)/calendarios/SeleccionTipoPlanningScreen")
        }
        backgroundColor={Colors.naranja.naranjaNormal}
        textColor="white"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  calendarioContainer: {
    flex: 1,
    width: "100%",
    alignItems: "center",
  },
  botonFlotante: {
    position: "absolute",
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#778c43",
    alignItems: "center",
    justifyContent: "center",
    right: 20,
    bottom: 20,
    zIndex: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
});
