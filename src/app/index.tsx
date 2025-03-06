import React, { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { eliminarTokens, obtenerToken } from "../utils/storage";
import {
  verificarHijoAsociado,
  verificarRegistroUsuario,
} from "../services/userService";
import { verificarSegundoProgenitorAsociado } from "../services/hijoService";
import LoadingIndicator from "../components/LoadingIndicator";

export default function index() {
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
              router.push("/(tabs)/gastos/gasto");
            } else {
              router.push("/vinculacionHijoOIngresoCodigo");
            }
          }
          setLoading(false);
        }
      } catch (error) {
        router.replace("/inicioSesion");
      }
    };
    checkAuth();
  }, []);

  if (loading) {
    return <LoadingIndicator></LoadingIndicator>;
  }
}
