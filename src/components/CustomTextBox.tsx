import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface CustomTextBoxProps {
  text: string;
  backgroundColor: string;
  textColor: string;
}

const CustomTextBox: React.FC<CustomTextBoxProps> = ({
  text,
  backgroundColor,
  textColor,
}) => {
  return (
    <View style={[styles.container, { backgroundColor }]}>
      <Text style={[styles.text, { color: textColor }]}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    width: "100%",
  },
  text: {
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
  },
});

export default CustomTextBox;
