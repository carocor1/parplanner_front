import React, { useEffect, useState, ReactNode } from "react";
import { View, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { obtenerToken } from "../utils/storage";
import {
  verificarHijoAsociado,
  verificarRegistroUsuario,
} from "../services/userService";
import { verificarSegundoProgenitorAsociado } from "../services/hijoService";

interface AuthCheckProps {
  children: ReactNode;
}

const AuthCheck: React.FC<AuthCheckProps> = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await obtenerToken();
        if (!token) {
          router.replace("/inicioSesion");
        } else {
          const tieneHijoAsociado = await verificarHijoAsociado();
          const estaRegistrado = await verificarRegistroUsuario();
          if (!estaRegistrado) {
            router.push("/registroProgenitor");
          }
          if (estaRegistrado && !tieneHijoAsociado) {
            router.push("/registroHijoOIngresoCodigo");
          }
          if (estaRegistrado && tieneHijoAsociado) {
            const segundoProgenitorAsociado =
              await verificarSegundoProgenitorAsociado();
            if (segundoProgenitorAsociado) {
              router.push("/(tabs)/gastos/");
            } else {
              router.push("/vinculacionHijoOIngresoCodigo");
            }
          }
          setLoading(false);
        }
      } catch (error) {
        console.error("Error al verificar el token:", error);
        router.replace("/inicioSesion");
      }
    };

    checkAuth();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#6A5ACD" />
      </View>
    );
  }

  return <>{children}</>;
};

export default AuthCheck;
