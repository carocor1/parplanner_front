import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { router, useFocusEffect } from "expo-router";
import GastoItem from "@/src/components/GastoItem";
import { FontAwesome } from "@expo/vector-icons";
import { Gasto } from "@/src/interfaces/GastoInterface";
import {
  getGastosByProgenitor,
  pagarGastos,
} from "@/src/services/gastoService";
import { getProgenitorIdFromToken } from "@/src/utils/storage";
import LoadingIndicator from "@/src/components/LoadingIndicator";
import { obtenerPropuestasParticion } from "@/src/services/propuestaParticionService";
import { openBrowserAsync } from "expo-web-browser";
import Colors from "@/src/constants/Colors";
import MercadoPagoButton from "@/src/components/MercadoPagoButton";
import { ALERT_TYPE, Toast } from "react-native-alert-notification";

const GastosScreen = () => {
  const [listaGastos, setListaGastos] = useState<Gasto[]>([]);
  const [deudaTotal, setDeudaTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [progenitorLogueadoId, setProgenitorLogueadoId] = useState<
    number | null
  >(null);

  const fetchGastos = async () => {
    setLoading(true);
    try {
      const id = await getProgenitorIdFromToken();
      if (id) {
        setProgenitorLogueadoId(id);
      }
      const gastos = await getGastosByProgenitor();
      setListaGastos(gastos);
    } catch (error) {
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: "Error",
        textBody:
          "Error al recuperar los gastos. Por favor, inténtalo de nuevo.",
      });
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchGastos();
    }, [])
  );

  const filtrarGastosPendientesAPagar = (gastos: Gasto[]) => {
    const gastosFiltrados = listaGastos.filter(
      (gasto) =>
        gasto.estado.nombre === "Pendiente" &&
        gasto.usuario_participe.id === progenitorLogueadoId
    );
    return gastosFiltrados;
  };

  const pagarConMercadoPago = async () => {
    const gastos = filtrarGastosPendientesAPagar(listaGastos);
    if (gastos.length !== 0) {
      const response = await pagarGastos(gastos);
      if (response.url) {
        openBrowserAsync(response.url);
      }
    } else {
      Toast.show({
        type: ALERT_TYPE.WARNING,
        title: "Error",
        textBody: "No hay gastos pendientes",
      });
    }
  };

  useEffect(() => {
    if (!progenitorLogueadoId) return;

    const calcularDeuda = async () => {
      let deuda = 0;
      for (const gasto of listaGastos) {
        if (
          gasto.estado.nombre === "Pendiente" &&
          gasto.usuario_participe.id === progenitorLogueadoId
        ) {
          const ultimaPropuesta = await obtenerPropuestasParticion(gasto.id);
          if (ultimaPropuesta) {
            deuda +=
              (gasto.monto *
                ultimaPropuesta.particion_usuario_participe_gasto) /
              100;
          }
        }
      }
      setDeudaTotal(deuda);
    };

    calcularDeuda();
  }, [listaGastos, progenitorLogueadoId]);

  if (loading) {
    return <LoadingIndicator />;
  }

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.deudaContainer}>
          {deudaTotal !== 0 && (
            <>
              <Text style={styles.debeText}>Debés</Text>
              <Text style={styles.cantidadText}>${deudaTotal.toFixed(2)}</Text>
              <MercadoPagoButton
                onPress={pagarConMercadoPago}
              ></MercadoPagoButton>
            </>
          )}

          {deudaTotal === 0 && (
            <Text style={styles.noDebeText}>
              ¡Por el momento no debés nada!
            </Text>
          )}
        </View>

        {listaGastos.length > 0 ? (
          <>
            <View style={styles.gastosContainer}>
              <Text style={styles.gastosTitle}>Gastos</Text>
              {progenitorLogueadoId &&
                listaGastos.map((gasto) => (
                  <GastoItem
                    key={gasto.id}
                    gasto={gasto}
                    usuarioLogueadoId={progenitorLogueadoId}
                    onRecargar={fetchGastos}
                  />
                ))}
            </View>
          </>
        ) : (
          <Text style={styles.textoSinGasto}>
            ¡Registrá un nuevo gasto para comenzar a particionar!
          </Text>
        )}
      </ScrollView>

      <TouchableOpacity
        style={styles.botonFlotante}
        onPress={() => router.push("/gastos/registrargasto")}
      >
        <FontAwesome name="plus" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  deudaContainer: {
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#6A5ACD",
    paddingBottom: 90,
    paddingTop: 60,
    width: "100%",
  },
  debeText: {
    color: Colors.lila.lilaMuyClaro,
    fontSize: 16,
  },
  noDebeText: {
    color: Colors.lila.lilaMuyClaro,
    fontSize: 24,
    fontWeight: "bold",
    paddingHorizontal: 60,
    textAlign: "center",
    lineHeight: 34,
    paddingVertical: 18,
  },

  cantidadText: {
    color: "white",
    fontSize: 35,
    fontWeight: "bold",
    paddingBottom: 5,
  },
  pagoText: {
    fontSize: 16,
    textAlign: "right",
    color: Colors.lila.lilaMuyClaro,
  },
  gastosContainer: {
    marginTop: -65,
    backgroundColor: "#fff",
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    elevation: 4,
    zIndex: 1,
    width: "92%",
    alignSelf: "center",
  },
  gastosTitle: {
    marginLeft: 10,
    marginTop: 10,
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },

  botonFlotante: {
    position: "absolute",
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#778c43",
    alignItems: "center",
    justifyContent: "center",
    right: 20,
    bottom: 20,
    zIndex: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  textoSinGasto: {
    fontWeight: "bold",
    fontSize: 25,
    textAlign: "center",
    color: "gray",
    lineHeight: 30,
    paddingHorizontal: 50,
    paddingVertical: 200,
  },
});

export default GastosScreen;
