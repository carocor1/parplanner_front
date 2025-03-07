import { router } from "expo-router";
import { Text, View } from "react-native";
import { Button } from "react-native-elements/dist/buttons/Button";
import React from "react";
import { StyleSheet } from "react-native";

export default function DocumentoScreen() {
  return (
    <View style={{ backgroundColor: "red" }}>
      <Text style={{ color: "RED" }}>Estoy en documentos</Text>
    </View>
  );
}
