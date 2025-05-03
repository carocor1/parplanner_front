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
import Colors from "../constants/Colors";

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
            name="CambiarContraseniaScreen"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="IngresoCodigoCambioContraseniaScreen"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="CrearNuevaContraseniaScreen"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="RegistroProgenitorScreen"
            options={{ title: "Registro Progenitor", headerShown: false }}
          />
          <Stack.Screen
            name="RegistroHijoScreen"
            options={{ title: "Registro Hijo", headerShown: false }}
          />
          <Stack.Screen
            name="VinculacionHijoOIngresoCodigoScreen"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="InicioSesionScreen"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="RegistroHijoOIngresoCodigoScreen"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="RegistroUsuarioScreen"
            options={{ headerShown: false }}
          />
        </Stack>
      </ThemeProvider>
    </AlertNotificationRoot>
  );
}
