import React from "react";
import { Stack } from "expo-router";
import Colors from "@/src/constants/Colors";

export default function CalendarioLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="calendario" 
        options={{
          title: "Calendario",
          headerStyle: {
            backgroundColor: Colors.verde.verdeOscuro,
          },
          headerTintColor: Colors.verde.verdeMuyMuyOscuro,
        }} 
      />
      <Stack.Screen 
        name="registrarCompromiso" 
        options={{
          title: "Registrar compromiso",
          headerStyle: {
            backgroundColor: Colors.verde.verdeOscuro,
          },
          headerTintColor: Colors.verde.verdeMuyMuyOscuro,
        }} 
      />
    </Stack>
  );
}
