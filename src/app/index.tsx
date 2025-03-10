import React, { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { obtenerToken } from "../utils/storage";
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
          router.replace("/InicioSesionScreen");
        } else {
          const tieneHijoAsociado = await verificarHijoAsociado();
          const estaRegistrado = await verificarRegistroUsuario();
          if (!estaRegistrado) {
            router.push("/RegistroProgenitorScreen");
          }
          if (estaRegistrado && !tieneHijoAsociado) {
            router.push("/RegistroHijoOIngresoCodigoScreen");
          }
          if (estaRegistrado && tieneHijoAsociado) {
            const segundoProgenitorAsociado =
              await verificarSegundoProgenitorAsociado();
            if (segundoProgenitorAsociado) {
              router.push("/(tabs)/gastos/GastosScreen");
            } else {
              router.push("/VinculacionHijoOIngresoCodigoScreen");
            }
          }
          setLoading(false);
        }
      } catch (error) {
        router.replace("/InicioSesionScreen");
      }
    };
    checkAuth();
  }, []);

  if (loading) {
    return <LoadingIndicator></LoadingIndicator>;
  }
}
