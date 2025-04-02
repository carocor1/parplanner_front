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
import { pagarGastos } from "../services/gastoService";
import { openBrowserAsync } from "expo-web-browser";
import { ALERT_TYPE, Toast } from "react-native-alert-notification";
import ProponerParticionScreen from "../app/(tabs)/gastos/ParticionModal";
import CustomEstadoRectangulo from "./CustomEstadoRectangulo";

interface GastoItemProps {
  gasto: Gasto;
  usuarioLogueadoId: number;
  onRecargar: () => void;
}

const GastoItem: React.FC<GastoItemProps> = ({
  gasto,
  usuarioLogueadoId,
  onRecargar,
}) => {
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
      console.log(error);
    }
  };

  const pagar = async () => {
    try {
      const gastos: Gasto[] = [gasto];
      const response = await pagarGastos(gastos);
      if (response.url) {
        openBrowserAsync(response.url);
      }
    } catch (error) {
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: "Error",
        textBody: "Error al pagar el gasto. Por favor, inténtalo de nuevo.",
      });
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
        onRecargar();
      }
    } catch (error) {
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: "Error",
        textBody: "Error al aceptar partición. Por favor, inténtalo de nuevo.",
      });
    }
  };

  const rechazarSolicitudParticion = async () => {
    try {
      setModalVisible(true);
    } catch (error) {
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: "Error",
        textBody: "Error al rechazar partición. Por favor, inténtalo de nuevo.",
      });
    }
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    onRecargar();
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

              {esCreador && (esPendiente || esEnNegociacion) && (
                <TouchableOpacity
                  style={styles.botonAbrir}
                  onPress={() =>
                    router.push({
                      pathname: `../gastos/edit/${gasto.id}`,
                      params: {
                        usuarioId: usuarioLogueadoId,
                      },
                    })
                  }
                >
                  <Text style={styles.textoBoton}>Editar</Text>
                </TouchableOpacity>
              )}

              {!esCreador && esPendiente && (
                <TouchableOpacity style={styles.botonPagar} onPress={pagar}>
                  <Text style={styles.textoPagar}>Pagar</Text>
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
              style={
                esEnNegociacion
                  ? styles.seccionDerechaEnNegociacion
                  : styles.seccionDerecha
              }
            >
              <CustomEstadoRectangulo
                estado={gasto.estado.nombre}
                backgroundColor={
                  esPendiente
                    ? Colors.naranja.naranjaClaro
                    : esPagado
                    ? Colors.azul.azulClaro
                    : Colors.rojo.rojoClaro
                }
                textColor={
                  esPendiente
                    ? Colors.naranja.naranjaOscuro
                    : esPagado
                    ? Colors.azul.azulOscuro
                    : Colors.rojo.rojoOscuro
                }
              />
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
                      style={[
                        styles.botonNegociacion,
                        { backgroundColor: "green" },
                      ]}
                      onPress={() => aprobarSolicitudParticion()}
                    >
                      <MaterialIcons name="check" size={24} color="white" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.botonNegociacion,
                        { backgroundColor: "red" },
                      ]}
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
    color: Colors.negro.negroOscuro,
    fontWeight: "bold",
    marginBottom: 2,
  },
  textoNaranja: {
    color: Colors.naranja.naranjaOscuro,
    fontWeight: "bold",
    marginBottom: 2,
  },
  titulo: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 2,
  },
  textoVerde: {
    color: Colors.verde.verdeOscuro,
    fontSize: 23,
    fontWeight: "bold",
    marginBottom: 10,
  },
  textoRojo: {
    color: Colors.rojo.rojoNegociando,
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
    lineHeight: 19.5,
  },
  subtituloEnNegociacionLadoDerecho: {
    marginTop: 3,
    textAlign: "center",
    fontSize: 12,
    fontStyle: "italic",
    color: Colors.negro.negroNormal,
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
  botonPagar: {
    backgroundColor: Colors.azul.mercadolibre,
    borderWidth: 2,
    borderColor: Colors.azul.mercadolibre,
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
  textoPagar: {
    color: "white",
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
});

export default GastoItem;
