import Colors from "@/src/constants/Colors";
import { Stack, Tabs } from "expo-router";

export default function GastosLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="GastosScreen"
        options={{
          title: "Gastos",
          headerStyle: {
            backgroundColor: Colors.verde.verdeOscuro,
          },
          headerTintColor: Colors.verde.verdeMuyMuyOscuro,
        }}
      />
      <Stack.Screen
        name="RegistrarGastoScreen"
        options={{
          title: "Registrar gasto",
          headerStyle: {
            backgroundColor: Colors.verde.verdeOscuro,
          },
          headerTintColor: Colors.verde.verdeMuyMuyOscuro,
        }}
      />
      <Stack.Screen
        name="edit"
        options={{
          title: "Editar Gasto",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="[id]"
        options={{
          title: "Detalle Gasto",
          headerStyle: {
            backgroundColor: Colors.verde.verdeOscuro,
          },
          headerTintColor: Colors.verde.verdeMuyMuyOscuro,
        }}
      />
    </Stack>
  );
}
