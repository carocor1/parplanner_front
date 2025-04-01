import { Stack } from "expo-router";

export default function CompromisoLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="RegistrarCompromisoScreen"
        options={{
          title: "Registrar compromiso",
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
