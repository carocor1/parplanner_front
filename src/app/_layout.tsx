import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import "react-native-reanimated";
import { AlertNotificationRoot } from "react-native-alert-notification";

import { useColorScheme } from "@/src/components/useColorScheme";

export { ErrorBoundary } from "expo-router";

export const unstable_settings = {
  initialRouteName: "(tabs)",
};

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  return (
    <AlertNotificationRoot>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen
            name="registroUsuario"
            options={{ title: "Registro Usuario", headerShown: false }}
          />
          <Stack.Screen
            name="cambiarContrasenia"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="ingresoCodigoCambioContrasenia"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="crearNuevaContrasenia"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="registroProgenitor"
            options={{ title: "Registro Progenitor", headerShown: false }}
          />
          <Stack.Screen
            name="registrohijo"
            options={{ title: "Registro Hijo", headerShown: false }}
          />
          <Stack.Screen
            name="vinculacionHijoOIngresoCodigo"
            options={{ headerShown: false }}
          />
          <Stack.Screen name="inicioSesion" options={{ headerShown: false }} />
          <Stack.Screen
            name="registroHijoOIngresoCodigo"
            options={{ headerShown: false }}
          />
        </Stack>
      </ThemeProvider>
    </AlertNotificationRoot>
  );
}
