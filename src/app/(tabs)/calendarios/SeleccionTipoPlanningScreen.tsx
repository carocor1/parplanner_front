import { StyleSheet, Text, View } from "react-native";
import React from "react";
import CustomButton from "@/src/components/CustomButton";
import { router } from "expo-router";
import Colors from "@/src/constants/Colors";

const SeleccionTipoPlanningScreen = () => {
  return (
    <View>
      <Text style={{ color: "red" }}>Buenos dias señora zoy</Text>
      <CustomButton
        title="PLANNING PERSONALIZADO"
        onPress={() =>
          router.push(
            "/(tabs)/calendarios/CreacionTipoPlanningPersonalizadoScreen"
          )
        }
        backgroundColor={Colors.naranja.naranjaNormal}
        textColor="white"
      />
    </View>
  );
};

const styles = StyleSheet.create({});

export default SeleccionTipoPlanningScreen;
