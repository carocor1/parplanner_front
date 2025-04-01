import React from "react";
import { Stack } from "expo-router";
import Colors from "@/src/constants/Colors";

export default function CalendarioLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="CalendarioScreen"
        options={{
          title: "Calendario",
          headerStyle: {
            backgroundColor: Colors.verde.verdeOscuro,
          },
          headerTintColor: Colors.verde.verdeMuyMuyOscuro,
        }}
      />
      <Stack.Screen
        name="SeleccionTipoPlanningScreen"
        options={{
          title: "Selección Tipo Planning",
          headerStyle: {
            backgroundColor: Colors.verde.verdeOscuro,
          },
          headerTintColor: Colors.verde.verdeMuyMuyOscuro,
        }}
      />
      <Stack.Screen
        name="compromiso"
        options={{
          title: "Registrar Compromiso",
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
        name="[id]"
        options={{
          title: "Detalle del Planning Propuesto",
          headerStyle: {
            backgroundColor: Colors.verde.verdeOscuro,
          },
          headerTintColor: Colors.verde.verdeMuyMuyOscuro,
        }}
      />
    

    </Stack>
  );
}
