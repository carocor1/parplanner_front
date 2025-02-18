import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { Gasto } from "../interfaces/GastoInterface";
import Colors from "../constants/Colors";
import {
  aprobarParticion,
  obtenerPropuestasParticion,
} from "../services/propuestaParticionService";
import { PropuestaParticion } from "../interfaces/PropuestasParticionInterface";
import { MaterialIcons } from "@expo/vector-icons";
import ProponerParticionScreen from "../app/(tabs)/gastos/particionModal";

interface GastoItemProps {
  gasto: Gasto;
  usuarioLogueadoId: number;
}

const GastoItem: React.FC<GastoItemProps> = ({ gasto, usuarioLogueadoId }) => {
  const [ultimaPropuesta, setUltimaPropuesta] =
    useState<PropuestaParticion | null>(null);

  const [ultimaParticionEsLogueado, setUltimaParticionEsLogueado] =
    useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const esCreador = gasto.usuario_creador.id === usuarioLogueadoId;
  const esPendiente = gasto.estado.nombre === "Pendiente";
  const esPagado = gasto.estado.nombre === "Pagado";
  const esEnNegociacion = gasto.estado.nombre === "Negociando";

  const fetchUltimaPropuesta = async () => {
    try {
      const propuesta = await obtenerPropuestasParticion(gasto.id);
      if (propuesta) {
        setUltimaPropuesta(propuesta);
        setUltimaParticionEsLogueado(
          propuesta.usuario_creador.id === usuarioLogueadoId
        );
      }
    } catch (error) {
      console.error(
        "Error al obtener la última propuesta de partición:",
        error
      );
    }
  };

  useEffect(() => {
    fetchUltimaPropuesta();
  }, [gasto.id]);

  const calcularResponsabilidadParticipante = (): string => {
    if (ultimaPropuesta) {
      return (
        gasto.monto *
        (ultimaPropuesta.particion_usuario_participe_gasto / 100)
      ).toFixed(2);
    } else {
      return "";
    }
  };

  const aprobarSolicitudParticion = async () => {
    try {
      if (ultimaPropuesta) {
        await aprobarParticion(ultimaPropuesta.id);
      }
    } catch (error) {
      console.error("Error al aceptar partición", error);
    }
  };

  const rechazarSolicitudParticion = async () => {
    try {
      setModalVisible(true);

      if (ultimaPropuesta) {
        setModalVisible(true);
      }
    } catch (error) {
      console.error("Error al rechazar partición", error);
    }
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    fetchUltimaPropuesta();
  };

  const calcularMensajeDeuda = (): string => {
    if (esPendiente)
      if (esCreador) {
        return "te debe";
      } else {
        return "Debés";
      }
    else if (esPagado) {
      if (esCreador) {
        return "te pagó";
      } else {
        return "Pagaste";
      }
    } else if (esEnNegociacion) {
      if (ultimaParticionEsLogueado) {
        if (esCreador) {
          return `Propusiste pagar el ${
            ultimaPropuesta?.particion_usuario_creador_gasto
          }%. ${
            gasto.usuario_participe.nombre
          } te debería $${calcularResponsabilidadParticipante()}`;
        } else {
          return `Propusiste pagar el ${
            ultimaPropuesta?.particion_usuario_participe_gasto
          }%. Deberías $${calcularResponsabilidadParticipante()}`;
        }
      } else {
        if (esCreador) {
          return `${gasto.usuario_participe.nombre} te propone pagar el ${
            ultimaPropuesta?.particion_usuario_participe_gasto
          }%. Te debería $${calcularResponsabilidadParticipante()}`;
        } else {
          return `${gasto.usuario_creador.nombre} te propone que pagues el ${
            ultimaPropuesta?.particion_usuario_participe_gasto
          }%. Le deberías $${calcularResponsabilidadParticipante()}`;
        }
      }
    }
    return "";
  };

  const mensajeDeuda = calcularMensajeDeuda();

  const fechaFormateada = new Date(gasto.fecha).toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  if (ultimaPropuesta) {
    return (
      <View style={styles.gastoContainer}>
        <View style={styles.estiloAlineacion}>
          {/* Sección de 60% del contenedor */}
          <View style={esEnNegociacion ? { flex: 0.5 } : { flex: 0.6 }}>
            <Text style={styles.titulo}>{gasto.titulo}</Text>
            <Text style={{ marginBottom: 2 }}>{fechaFormateada}</Text>
            <Text style={esCreador ? styles.textoNegro : styles.textoNaranja}>
              {gasto.usuario_creador.nombre} {gasto.usuario_creador.apellido}
              {esCreador && " (Vos)"}
            </Text>

            {(esPendiente || esPagado) && (
              <Text style={{ marginBottom: 2 }}>
                Partición ({ultimaPropuesta.particion_usuario_creador_gasto}/
                {ultimaPropuesta.particion_usuario_participe_gasto})
              </Text>
            )}
            <Text style={{ marginBottom: 2 }}>Total: ${gasto.monto}</Text>
            <View style={styles.botones}>
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

              {/* Mostrar botón Editar solo si el usuario logueado es el creador */}
              {esCreador && (esPendiente || esEnNegociacion) && (
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
            </View>
          </View>

          <View
            style={
              esEnNegociacion
                ? styles.seccionDerechaEnNegociacion
                : styles.seccionDerecha
            }
          >
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

            {!esEnNegociacion && (
              <>
                <Text style={{ marginBottom: 1 }}>
                  {mensajeDeuda.includes("te debe") ||
                  mensajeDeuda.includes("pagó") ? (
                    <Text>{gasto.usuario_participe.nombre} </Text>
                  ) : null}
                  {mensajeDeuda}
                </Text>
                <Text
                  style={esPendiente ? styles.textoRojo : styles.textoVerde}
                >
                  ${calcularResponsabilidadParticipante()}
                </Text>
              </>
            )}

            {/* Mensaje de negociación */}
            {esEnNegociacion && (
              <>
                <Text style={styles.textoEnNegociacionLadoDerecho}>
                  {mensajeDeuda}
                </Text>
                {ultimaParticionEsLogueado ? (
                  <Text style={styles.subtituloEnNegociacionLadoDerecho}>
                    Esperando aceptación de la propuesta...
                  </Text>
                ) : (
                  <View style={styles.botonesNegociacion}>
                    <TouchableOpacity
                      style={[styles.botonNegociacion, styles.botonAceptar]}
                      onPress={() => aprobarSolicitudParticion()}
                    >
                      <MaterialIcons name="check" size={24} color="white" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.botonNegociacion, styles.botonRechazar]}
                      onPress={() => rechazarSolicitudParticion()}
                    >
                      <MaterialIcons name="close" size={24} color="white" />
                    </TouchableOpacity>
                  </View>
                )}
              </>
            )}
          </View>
        </View>

        {/* Modal para proponer partición */}
        <ProponerParticionScreen
          visible={modalVisible}
          onClose={handleCloseModal}
          gasto={gasto}
          idUsuarioLogueado={usuarioLogueadoId}
          propuestaParticion={ultimaPropuesta}
        />
      </View>
    );
  }
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
  seccionDerechaEnNegociacion: {
    justifyContent: "center",
    alignItems: "center",
    flex: 0.5,
  },
  estiloAlineacion: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  textoNegro: {
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
  textoEnNegociacionLadoDerecho: {
    textAlign: "center",
    lineHeight: 19.5, // Ajusta el interlineado aquí
  },
  subtituloEnNegociacionLadoDerecho: {
    marginTop: 3,
    textAlign: "center",
    fontSize: 12,
    fontStyle: "italic",
    color: Colors.negro.negroNormal,
  },
  textoEnNegociacion: {
    color: Colors.rojo.rojoOscuro,
    fontWeight: "bold",
    textAlign: "center",
  },
  rectanguloPagada: {
    backgroundColor: Colors.azul.azulClaro,
    paddingHorizontal: 14,
    padding: 5,
    borderRadius: 10,
  },
  rectanguloEnNegociacion: {
    backgroundColor: Colors.rojo.rojoClaro,
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
    justifyContent: "flex-start",
    alignSelf: "flex-start",
    marginTop: -6,
  },
  botonesNegociacion: {
    marginTop: 5,
    flexDirection: "row",
    justifyContent: "space-between",
    width: 100,
  },
  botonNegociacion: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  botonAceptar: {
    backgroundColor: "green",
  },
  botonRechazar: {
    backgroundColor: "red",
  },
});

export default GastoItem;
