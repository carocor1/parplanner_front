import { router } from "expo-router";
import { Text, View } from "react-native";
import { Button } from "react-native-elements/dist/buttons/Button";
import React from "react";
import { StyleSheet } from "react-native";

export default function documento() {
  return (
    <View style={{ backgroundColor: "red" }}>
      <Button onPress={() => router.push("/crearNuevaContrasenia")}>
        HOLAAAAAAAAAAAAAAAA
      </Button>
      <Text style={{ color: "RED" }}>Estoy en documentos</Text>
    </View>
  );
}

const styles = StyleSheet.create({});
