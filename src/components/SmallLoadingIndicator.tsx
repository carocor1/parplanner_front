import React from "react";
import { Text, StyleSheet, View, ActivityIndicator } from "react-native";

interface SmallLoadingIndicatorProps {
  text: string;
  color: string;
  textColor: string;
  backColor: string;
}

const SmallLoadingIndicator: React.FC<SmallLoadingIndicatorProps> = ({
  text,
  color,
  textColor,
  backColor,
}) => {
  const styles = StyleSheet.create({
    loadingContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      marginTop: 10,
      backgroundColor: backColor,
    },
    loadingText: {
      color: textColor,
      fontWeight: "bold",
      marginTop: 8,
    },
  });

  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="small" color={color} />
      <Text style={styles.loadingText}>{text}</Text>
    </View>
  );
};

export default SmallLoadingIndicator;
