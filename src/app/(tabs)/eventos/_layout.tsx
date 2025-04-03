import React from "react";
import { Stack } from "expo-router";
import Colors from "@/src/constants/Colors";

export default function EventosLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="EventosScreen"
        options={{
          title: "Eventos",
          headerStyle: {
            backgroundColor: Colors.verde.verdeOscuro,
          },
          headerTintColor: Colors.verde.verdeMuyMuyOscuro,
        }}
      />
      <Stack.Screen
        name="RegistrarEventoScreen"
        options={{
          title: "Registrar Evento",
          headerStyle: {
            backgroundColor: Colors.verde.verdeOscuro,
          },
          headerTintColor: Colors.verde.verdeMuyMuyOscuro,
        }}
      />
    </Stack>
  );
}
