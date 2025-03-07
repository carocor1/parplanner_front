import Colors from "@/src/constants/Colors";
import { Stack, Tabs } from "expo-router";

export default function GastosLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="PerfilUsuarioScreen"
        options={{
          title: "Perfil",
          headerStyle: {
            backgroundColor: Colors.verde.verdeOscuro,
          },
          headerTintColor: Colors.verde.verdeMuyMuyOscuro,
        }}
      />
      <Stack.Screen
        name="hijo"
        options={{
          title: "Hijo",
          headerStyle: {
            backgroundColor: Colors.verde.verdeOscuro,
          },
          headerTintColor: Colors.verde.verdeMuyMuyOscuro,
        }}
      />
    </Stack>
  );
}
