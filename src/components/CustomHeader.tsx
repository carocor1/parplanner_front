import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface CustomHeaderProps {
  title: string;
  backgroundColor: string;
  textColor: string;
}

const CustomHeader: React.FC<CustomHeaderProps> = ({
  title,
  backgroundColor,
  textColor,
}) => {
  return (
    <View style={[styles.headerContainer, { backgroundColor }]}>
      <Text style={[styles.headerText, { color: textColor }]}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    borderBottomLeftRadius: 60,
    borderBottomRightRadius: 60,
    alignItems: "center",
    height: "10%",
    justifyContent: "center",
  },
  headerText: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default CustomHeader;
