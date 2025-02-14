import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { Gasto } from "../interfaces/GastoInterface";
import Colors from "../constants/Colors";

interface GastoItemProps {
  gasto: Gasto;
  usuarioLogueadoId: number;
}

const GastoItem: React.FC<GastoItemProps> = ({ gasto, usuarioLogueadoId }) => {
  const esCreador = gasto.usuario_creador.id === usuarioLogueadoId;
  const esPendiente = gasto.estado.nombre === "Pendiente";

  const responsabilidadParticipante = (
    gasto.monto *
    (gasto.particion_usuario_participe / 100)
  ).toFixed(2);

  const calcularMensajeDeuda = (): string => {
    if (esPendiente && esCreador) {
      return "te debe";
    } else if (esPendiente) {
      return "Debés"; // Mensaje si es participante y pendiente
    } else if (esCreador) {
      return "te pagó"; // Mensaje si es creador y pagado
    } else {
      return "Pagaste"; // Mensaje si es participante y pagado
    }
  };

  const mensajeDeuda = calcularMensajeDeuda();

  const fechaFormateada = new Date(gasto.fecha).toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  return (
    <View style={styles.gastoContainer}>
      <View style={styles.estiloAlineacion}>
        {/* Sección de 60% del contenedor */}
        <View style={{ flex: 0.6 }}>
          <Text style={styles.titulo}>{gasto.titulo}</Text>
          <Text style={{ marginBottom: 2 }}>{fechaFormateada}</Text>
          <Text style={esCreador ? styles.textoLila : styles.textoNaranja}>
            {gasto.usuario_creador.nombre} {gasto.usuario_creador.apellido}
            {esCreador && " (Vos)"}
          </Text>
          <Text style={{ marginBottom: 2 }}>
            Partición ({gasto.particion_usuario_creador}/
            {gasto.particion_usuario_participe})
          </Text>
          <Text style={{ marginBottom: 2 }}>Total: ${gasto.monto}</Text>
        </View>

        {/* Sección de 40% del contenedor */}
        <View style={styles.seccionDerecha}>
          <View
            style={[
              esPendiente
                ? styles.rectanguloPendiente
                : styles.rectanguloPagada,
              { marginBottom: 5 },
            ]}
          >
            <Text
              style={esPendiente ? styles.textoPendiente : styles.textoPagada}
            >
              {gasto.estado.nombre.toUpperCase()}
            </Text>
          </View>
          <Text style={{ marginBottom: 1 }}>
            {mensajeDeuda.includes("te debe") ||
            mensajeDeuda.includes("pagó") ? (
              <Text>{gasto.usuario_participe.nombre} </Text>
            ) : null}
            {mensajeDeuda}
          </Text>
          <Text style={esPendiente ? styles.textoRojo : styles.textoVerde}>
            ${responsabilidadParticipante}
          </Text>

          {/* Botón personalizado Abrir */}
          <View style={styles.botones}>
            {/* Mostrar botón Editar solo si el usuario logueado es el creador */}
            {esCreador && esPendiente && (
              <TouchableOpacity
                style={styles.botonAbrir}
                onPress={() =>
                  router.push({
                    pathname: `../gastos/edit/${gasto.id}`,
                    params: {
                      // Pasar gasto correctamente
                      usuarioId: usuarioLogueadoId, // Pasar ID del usuario
                    },
                  })
                }
              >
                <Text style={styles.textoBoton}>Editar</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={styles.botonAbrir}
              onPress={() =>
                router.push({
                  pathname: `../gastos/${gasto.id}`,
                  params: {
                    usuarioId: usuarioLogueadoId,
                  },
                })
              }
            >
              <Text style={styles.textoBoton}>Abrir</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  gastoContainer: {
    paddingLeft: 15,
    paddingTop: 10,
    paddingBottom: 10,
    marginBottom: 0,
    borderWidth: 0.5,
    borderColor: "gray",
  },
  seccionDerecha: {
    justifyContent: "center",
    alignItems: "center",
    flex: 0.4,
  },
  estiloAlineacion: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  textoLila: {
    color: "#434444",
    fontWeight: "bold",
    marginBottom: 2,
  },
  textoNaranja: {
    color: "#cd8d0d",
    fontWeight: "bold",
    marginBottom: 2,
  },
  titulo: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 2,
  },
  textoVerde: {
    color: "#7cb518",
    fontSize: 23,
    fontWeight: "bold",
    marginBottom: 10,
  },
  textoRojo: {
    color: "#d62828",
    fontSize: 23,
    fontWeight: "bold",
    marginBottom: 10,
  },
  rectanguloPendiente: {
    backgroundColor: Colors.naranja.naranjaClaro,
    padding: 5,
    borderRadius: 10,
  },
  textoPendiente: {
    color: Colors.naranja.naranjaOscuro,
    fontWeight: "bold",
  },
  rectanguloPagada: {
    backgroundColor: Colors.azul.azulClaro,
    paddingHorizontal: 14,
    padding: 5,
    borderRadius: 10,
  },
  textoPagada: {
    color: Colors.azul.azulOscuro,
    fontWeight: "bold",
  },
  botonAbrir: {
    backgroundColor: "white",
    borderColor: Colors.azul.celeste,
    borderWidth: 2,
    borderRadius: 15,
    padding: 3,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    marginRight: 8,
  },
  textoBoton: {
    color: Colors.azul.celeste,
    fontSize: 12,
    marginRight: 8,
    marginLeft: 8,
  },
  botones: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    alignSelf: "flex-end",
  },
});

export default GastoItem;
