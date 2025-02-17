import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { getGastoById } from "@/src/services/gastoService";
import { Gasto } from "@/src/interfaces/GastoInterface";
import Colors from "@/src/constants/Colors";
import ParticionesCuadrados from "@/src/components/ParticionesCuadrados";
import LoadingIndicator from "@/src/components/LoadingIndicator";

const DetalleGastoScreen: React.FC = () => {
  const { id, usuarioId } = useLocalSearchParams();
  const parsedGastoId = id ? Number(id) : null;
  const [gasto, setGasto] = useState<Gasto | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchGasto = async () => {
    try {
      if (parsedGastoId) {
        setLoading(true);
        const gasto = await getGastoById(parsedGastoId);
        if (!gasto) {
          throw new Error("Gasto no encontrado");
        } else {
          setGasto(gasto);
        }
      }
    } catch (error) {
      console.error("Error al cargar el gasto:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGasto();
  }, [parsedGastoId]);

  if (loading) {
    return <LoadingIndicator />;
  }

  if (!gasto) {
    return <Text>Gasto no disponible</Text>;
  }

  const esPendiente = gasto.estado.nombre === "Pendiente";

  return (
    <View style={styles.container}>
      <View
        style={[
          esPendiente ? styles.rectanguloPendiente : styles.rectanguloPagada,
          { marginBottom: 5 },
        ]}
      >
        <Text style={esPendiente ? styles.textoPendiente : styles.textoPagada}>
          {gasto.estado.nombre.toUpperCase()}
        </Text>
      </View>

      <Text style={styles.tituloLabel}>Título del gasto: </Text>
      <Text style={styles.titulo}>{gasto.titulo}</Text>
      <Text style={styles.descripcion}>{gasto.descripcion}</Text>

      <View style={styles.categoriaConteiner}>
        <Text style={styles.categoriaLabel}>Categoría: </Text>
        <Text style={styles.categoria}>{gasto.categoria.nombre}</Text>
      </View>

      <View style={styles.contenedorMonto}>
        <Text style={styles.monto}>Total:</Text>
        <Text style={styles.montoImportado}>${gasto.monto}</Text>
      </View>

      <ParticionesCuadrados
        usuarioCreador={gasto.usuario_creador}
        usuarioParticipe={gasto.usuario_participe}
        usuarioId={Number(usuarioId)}
        monto={gasto.monto}
        particionUsuarioCreador={gasto.particion_usuario_creador}
        particionUsuarioParticipe={gasto.particion_usuario_participe}
      ></ParticionesCuadrados>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: Colors.gris.fondo,
  },
  tituloLabel: {
    fontSize: 18,
    color: "#666",
    alignSelf: "center",
    marginTop: 10,
  },
  categoriaConteiner: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
    marginBottom: 8,
  },
  contenedorMonto: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 8,
  },
  categoriaLabel: {
    fontSize: 16,
    color: Colors.rosa.rosaNormal,
    marginBottom: 10,
    textAlign: "center",
  },
  errorText: {
    alignSelf: "center",
    fontSize: 18,
    color: "red",
  },
  monto: {
    alignSelf: "center",
    fontSize: 18,
    marginRight: 10,
  },
  montoImportado: {
    alignSelf: "center",
    fontWeight: "bold",
    fontSize: 40,
    color: Colors.azul.azulMuyOscuro,
  },
  titulo: {
    fontSize: 28,
    fontWeight: "bold",
    alignSelf: "center",
    marginBottom: 10,
    textAlign: "center",
  },
  descripcion: {
    fontSize: 18,
    color: "#666",
    alignSelf: "center",
    textAlign: "center",
  },
  categoria: {
    fontSize: 18,
    color: "#bd4f6c",
    fontWeight: "bold",
    textAlign: "center",
  },
  rectanguloPendiente: {
    backgroundColor: "#FFE5B4",
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 15,
    alignSelf: "center",
  },
  textoPendiente: {
    color: "#cd8d0d",
    fontWeight: "bold",
    fontSize: 25,
  },
  rectanguloPagada: {
    backgroundColor: "#ccdaed",
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 15,
    alignSelf: "center",
  },
  textoPagada: {
    color: "#5f80ad",
    fontWeight: "bold",
    fontSize: 25,
  },
});

export default DetalleGastoScreen;
