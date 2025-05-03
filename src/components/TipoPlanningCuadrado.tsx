import React, { useState } from "react";
import { Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { TipoPlanning } from "@/src/interfaces/TipoPlanning";
import Colors from "../constants/Colors";

type TipoPlanningCuadradoProps = {
  tipoPlanning: TipoPlanning;
  isSelected: boolean;
  onSelection: (selected: TipoPlanning) => void;
};

const planningImages: { [key: string]: any } = {
  "2-5-2-5": require("../assets/images/2-5-2-5.png"),
  "4-3-4-3": require("../assets/images/4-3-4-3.png"),
  "5-2-2-5": require("../assets/images/5-2-2-5.png"),
  "Plan Personalizado": require("../assets/images/personalizado.png"),
};

const TipoPlanningCuadrado: React.FC<TipoPlanningCuadradoProps> = ({
  tipoPlanning,
  isSelected,
  onSelection,
}) => {
  const planningImage =
    planningImages[tipoPlanning.nombre] || planningImages["Plan Personalizado"];

  return (
    <TouchableOpacity
      style={[styles.card, isSelected && styles.selectedCard]}
      onPress={() => onSelection(tipoPlanning)}
    >
      {planningImage && (
        <Image
          source={planningImage}
          style={styles.image}
          resizeMode="contain"
        />
      )}
      <Text style={styles.cardText}>{tipoPlanning.nombre}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexBasis: "46%",
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
    margin: "2%",
    backgroundColor: "white",
    borderRadius: 10,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 2,
    borderColor: "transparent",
  },
  selectedCard: {
    borderColor: Colors.azul.celeste,
  },
  cardText: {
    fontSize: 16,
    color: Colors.gris.oscuro,
    fontWeight: "bold",
    textAlign: "center",
  },
  image: {
    width: "80%", // Ajusta el tamaño de la imagen dentro del cuadrado
    height: "80%",
    marginBottom: -10,
  },
});

export default TipoPlanningCuadrado;
