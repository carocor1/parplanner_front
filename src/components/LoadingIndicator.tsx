import React from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import Colors from "@/src/constants/Colors";

const LoadingIndicator: React.FC = () => {
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color={Colors.lila.lilaNormal} />
      <Text style={styles.loadingText}>Cargando...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.gris.fondo,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 18,
    color: Colors.lila.lilaNormal,
  },
});

export default LoadingIndicator;
