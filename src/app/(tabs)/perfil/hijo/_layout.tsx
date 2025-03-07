import { Stack } from "expo-router";

export default function HijoLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="PerfilHijoScreen"
        options={{
          title: "Hijo",
          headerStyle: {
            backgroundColor: "#96ac60",
          },
          headerTintColor: "#fff",
          headerShown: false,
        }}
      />
    </Stack>
  );
}
