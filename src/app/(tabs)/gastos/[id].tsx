import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import ProponerParticionScreen from "./particionModal";
import { useLocalSearchParams } from "expo-router";
import { getGastoById } from "@/src/services/gastoService";
import { Gasto } from "@/src/interfaces/GastoInterface";

const DetalleGastoScreen: React.FC = () => {
  const { id, usuarioId } = useLocalSearchParams();
  const parsedGastoId = id ? Number(id) : null;

  const [gasto, setGasto] = useState<Gasto | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [modalVisible, setModalVisible] = useState(false);

  const openModal = () => setModalVisible(true);
  const closeModal = () => {
    setModalVisible(false);
    fetchGasto();
  };

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
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6A5ACD" />
        <Text style={styles.loadingText}>Cargando...</Text>
      </View>
    );
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

      <View style={styles.contenedorParticiones}>
        <View
          style={[
            styles.particionIndividual,
            gasto.usuario_creador.id === Number(usuarioId) &&
              styles.particionUsuarioLogueado,
          ]}
        >
          <Text style={styles.tituloParticion}>Partición de</Text>
          <Text style={styles.tituloParticion}>
            {gasto.usuario_creador.nombre}:
          </Text>
          <Text style={styles.particionValue}>
            {gasto.particion_usuario_creador}%
          </Text>
          <View style={styles.lineaDivisoria}></View>
          <Text style={styles.corresponde}>Corresponde:</Text>
          <Text style={styles.particionValue}>
            ${(gasto.particion_usuario_creador * gasto.monto) / 100}
          </Text>
        </View>

        <View
          style={[
            styles.particionIndividual,
            gasto.usuario_participe.id === Number(usuarioId) &&
              styles.particionUsuarioLogueado,
          ]}
        >
          <Text style={styles.tituloParticion}>Partición de</Text>
          <Text style={styles.tituloParticion}>
            {gasto.usuario_participe.nombre}:
          </Text>
          <Text style={styles.particionValue}>
            {gasto.particion_usuario_participe}%
          </Text>
          <View style={styles.lineaDivisoria}></View>
          <Text style={styles.corresponde}>Corresponde:</Text>
          <Text style={styles.particionValue}>
            ${(gasto.particion_usuario_participe * gasto.monto) / 100}
          </Text>
        </View>
      </View>

      <TouchableOpacity>
        <MaterialIcons name="attach-file" size={24} color="white" />
        <Text>Descargar comprobante de compra</Text>
      </TouchableOpacity>

      {esPendiente && (
        <TouchableOpacity
          style={styles.botonProponerParticion}
          onPress={openModal}
        >
          <Text style={styles.buttonText}>PROPONER NUEVA PARTICIÓN</Text>
        </TouchableOpacity>
      )}

      <ProponerParticionScreen
        visible={modalVisible}
        onClose={closeModal}
        gasto={gasto}
        idUsuarioLogueado={Number(usuarioId)}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#f5f5f5",
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
    color: "#666",
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
    color: "#0353a4",
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
  tituloParticion: {
    fontSize: 16,
    color: "#333",
  },
  particionValue: {
    fontSize: 30,
    color: "#555",
    fontWeight: "bold",
  },
  corresponde: {
    fontSize: 14,
    color: "#333",
    marginVertical: 5,
  },
  particionIndividual: {
    flex: 1,
    padding: 10,
    marginHorizontal: 5,
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
    alignItems: "center",
  },
  particionUsuarioLogueado: {
    borderColor: "#014f86",
    borderWidth: 5,
  },
  contenedorParticiones: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  lineaDivisoria: {
    borderBottomColor: "#ddd",
    borderBottomWidth: 1,
    width: "100%",
    marginVertical: 5,
  },
  botonProponerParticion: {
    backgroundColor: "#DF732E",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginLeft: 10,
    marginTop: 30,
  },
  buttonText: {
    color: "white",
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
