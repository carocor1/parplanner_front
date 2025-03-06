import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { getGastoById } from "@/src/services/gastoService";
import { Gasto } from "@/src/interfaces/GastoInterface";
import Colors from "@/src/constants/Colors";
import ParticionesCuadrados from "@/src/components/ParticionesCuadrados";
import LoadingIndicator from "@/src/components/LoadingIndicator";
import { PropuestaParticion } from "@/src/interfaces/PropuestasParticionInterface";
import { obtenerPropuestasParticion } from "@/src/services/propuestaParticionService";

const DetalleGastoScreen: React.FC = () => {
  const { id, usuarioId } = useLocalSearchParams();
  const parsedGastoId = id ? Number(id) : null;
  const [gasto, setGasto] = useState<Gasto | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [ultimaPropuesta, setUltimaPropuesta] = useState<PropuestaParticion>();

  const fetchGasto = async () => {
    try {
      if (parsedGastoId) {
        setLoading(true);
        const gasto = await getGastoById(parsedGastoId);
        if (!gasto) {
          throw new Error("Gasto no encontrado");
        } else {
          setGasto(gasto);
          const ultimaPropuesta = await obtenerPropuestasParticion(gasto.id);
          if (!ultimaPropuesta) {
            throw new Error("Propuesta no encontrada");
          }
          setUltimaPropuesta(ultimaPropuesta);
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
  const esPagado = gasto.estado.nombre === "Pagado";
  const esEnNegociacion = gasto.estado.nombre === "Negociando";

  return (
    <View style={styles.container}>
      <View style={styles.contenedorGasto}>
        <View
          style={[
            esPendiente
              ? styles.rectanguloPendiente
              : esPagado
              ? styles.rectanguloPagada
              : styles.rectanguloEnNegociacion,
            { marginBottom: 5 },
          ]}
        >
          <Text
            style={
              esPendiente
                ? styles.textoPendiente
                : esPagado
                ? styles.textoPagada
                : styles.textoEnNegociacion
            }
          >
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
      </View>

      {ultimaPropuesta && (
        <View style={styles.contenedorParticiones}>
          {esEnNegociacion && (
            <Text style={styles.propuesta}>
              La última propuesta de partición hecha propone:
            </Text>
          )}
          {esPendiente && (
            <Text style={styles.propuesta}>Las particiones aplicadas son:</Text>
          )}
          {esPagado && (
            <Text style={styles.propuesta}>
              Las particiones que se aplicaron fueron:
            </Text>
          )}
          <ParticionesCuadrados
            usuarioCreador={gasto.usuario_creador}
            usuarioParticipe={gasto.usuario_participe}
            usuarioId={Number(usuarioId)}
            monto={gasto.monto}
            particionUsuarioCreador={
              ultimaPropuesta?.particion_usuario_creador_gasto
            }
            particionUsuarioParticipe={
              ultimaPropuesta?.particion_usuario_participe_gasto
            }
          ></ParticionesCuadrados>
        </View>
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    flex: 1,
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
  rectanguloEnNegociacion: {
    backgroundColor: Colors.rojo.rojoClaro,
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
  textoEnNegociacion: {
    color: Colors.rojo.rojoOscuro,
    fontWeight: "bold",
    fontSize: 25,
  },
  contenedorParticiones: {
    backgroundColor: Colors.marron.marronClaro,
    paddingTop: 80,
    marginTop: 40,
    borderTopLeftRadius: 70,
    borderTopRightRadius: 70,
    paddingHorizontal: 20,
    flex: 1,
  },
  contenedorGasto: {
    marginTop: 30,
    flex: 1,
    justifyContent: "space-between",
    paddingHorizontal: 30,
    marginBottom: 60,
  },
  propuesta: {
    marginTop: -46,
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    lineHeight: 25,
    marginBottom: 20,
    paddingHorizontal: 40,
  },
});

export default DetalleGastoScreen;
