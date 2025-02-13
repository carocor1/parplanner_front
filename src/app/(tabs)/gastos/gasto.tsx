import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { router, useFocusEffect } from "expo-router";
import GastoItem from "@/src/components/GastoItem";
import { FontAwesome } from "@expo/vector-icons";
import { Gasto } from "@/src/interfaces/GastoInterface";
import { getGastosByProgenitor } from "@/src/services/gastoService";
import { getProgenitorIdFromToken } from "@/src/utils/storage";

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
      console.error("Error al recuperar los gastos:", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchGastos(); // Cada vez que la pantalla esté en foco, se refrescan los gastos
    }, [])
  );

  useEffect(() => {
    if (!progenitorLogueadoId) return;

    const calcularDeuda = () => {
      const deuda = listaGastos.reduce((total, gasto) => {
        if (
          gasto.estado.nombre === "Pendiente" &&
          gasto.usuario_participe.id === progenitorLogueadoId
        ) {
          return (
            total + (gasto.monto * gasto.particion_usuario_participe) / 100
          );
        }
        return total;
      }, 0);
      setDeudaTotal(deuda);
    };

    calcularDeuda();
  }, [listaGastos, progenitorLogueadoId]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6A5ACD" />
        <Text style={styles.loadingText}>Cargando...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView>
        {/* Rectángulo con información de deuda */}
        <View style={styles.deudaContainer}>
          <Text style={styles.debeText}>Debés</Text>
          <Text style={styles.cantidadText}>${deudaTotal.toFixed(2)}</Text>
          <Text style={styles.pagoText}>Pagá con Mercado Pago</Text>
        </View>

        <View style={styles.gastosContainer}>
          <Text style={styles.gastosTitle}>Gastos</Text>
          {progenitorLogueadoId &&
            listaGastos.map((gasto) => (
              <GastoItem
                key={gasto.id}
                gasto={gasto}
                usuarioLogueadoId={progenitorLogueadoId}
              />
            ))}
        </View>
      </ScrollView>

      {/* Botón flotante circular */}
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
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 16,
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
    color: "rgba(255, 255, 255, 0.7)",
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 18,
    color: "#6A5ACD",
  },
});

export default GastosScreen;
