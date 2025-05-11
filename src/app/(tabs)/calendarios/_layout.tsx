import React from "react";
import { Stack } from "expo-router";
import Colors from "@/src/constants/Colors";

export default function CalendarioLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="PlanningScreen"
        options={{
          title: "Planning",
          headerStyle: {
            backgroundColor: Colors.verde.verdeOscuro,
          },
          headerTintColor: Colors.verde.verdeMuyMuyOscuro,
        }}
      />
      <Stack.Screen
        name="CreacionPlanningScreen"
        options={{
          title: "Crear Planning",
          headerStyle: {
            backgroundColor: Colors.verde.verdeOscuro,
          },
          headerTintColor: Colors.verde.verdeMuyMuyOscuro,
        }}
      />
      <Stack.Screen
        name="CreacionTipoPlanningPersonalizadoScreen"
        options={{
          title: "Tipo Planning Personalizado",
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
