import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface EstadoRectanguloProps {
  estado: string;
  backgroundColor: string;
  textColor: string;
}

const EstadoRectangulo: React.FC<EstadoRectanguloProps> = ({
  estado,
  backgroundColor,
  textColor,
}) => {
  return (
    <View style={[styles.rectangulo, { backgroundColor }]}>
      <Text style={[styles.texto, { color: textColor }]}>
        {estado.toUpperCase()}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  rectangulo: {
    padding: 7,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  texto: {
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default EstadoRectangulo;
