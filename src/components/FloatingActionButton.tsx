import React from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import { FontAwesome } from "@expo/vector-icons";

interface FloatingActionButtonProps {
  onPress: () => void;
  iconSize?: number;
  iconColor?: string;
  backgroundColor?: string;
}

const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  onPress,
  iconSize = 24,
  iconColor = "white",
  backgroundColor = "#778c43",
}) => {
  return (
    <TouchableOpacity
      style={[styles.botonFlotante, { backgroundColor }]}
      onPress={onPress}
    >
      <FontAwesome name="plus" size={iconSize} color={iconColor} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  botonFlotante: {
    position: "absolute",
    width: 60,
    height: 60,
    borderRadius: 30,
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
});

export default FloatingActionButton;
