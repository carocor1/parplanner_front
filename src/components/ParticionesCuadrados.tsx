import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Colors from "@/src/constants/Colors";
import { Usuario } from "../interfaces/UsuarioInterface";

interface ParticionesProps {
  usuarioCreador: Usuario;
  usuarioParticipe: Usuario;
  particionUsuarioCreador: number;
  particionUsuarioParticipe: number;
  monto: number;
  usuarioId: number;
}

const ParticionesCuadrados: React.FC<ParticionesProps> = ({
  usuarioCreador,
  usuarioParticipe,
  particionUsuarioCreador,
  particionUsuarioParticipe,
  monto,
  usuarioId,
}) => {
  return (
    <View style={styles.contenedorParticiones}>
      <View
        style={[
          styles.particionIndividual,
          usuarioCreador.id === Number(usuarioId) &&
            styles.particionUsuarioLogueado,
        ]}
      >
        <Text style={styles.tituloParticion}>Partición de</Text>
        <Text style={styles.tituloParticion}>{usuarioCreador.nombre}:</Text>
        <Text style={styles.particionValue}>{particionUsuarioCreador}%</Text>
        <View style={styles.lineaDivisoria}></View>
        <Text style={styles.corresponde}>Corresponde:</Text>
        <Text style={styles.particionValue}>
          ${(particionUsuarioCreador * monto) / 100}
        </Text>
      </View>

      <View
        style={[
          styles.particionIndividual,
          usuarioParticipe.id === Number(usuarioId) &&
            styles.particionUsuarioLogueado,
        ]}
      >
        <Text style={styles.tituloParticion}>Partición de</Text>
        <Text style={styles.tituloParticion}>{usuarioParticipe.nombre}:</Text>
        <Text style={styles.particionValue}>{particionUsuarioParticipe}%</Text>
        <View style={styles.lineaDivisoria}></View>
        <Text style={styles.corresponde}>Corresponde:</Text>
        <Text style={styles.particionValue}>
          ${(particionUsuarioParticipe * monto) / 100}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  contenedorParticiones: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 10,
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
  lineaDivisoria: {
    borderBottomColor: "#ddd",
    borderBottomWidth: 1,
    width: "100%",
    marginVertical: 5,
  },
});

export default ParticionesCuadrados;
