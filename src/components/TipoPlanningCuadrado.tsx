import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { TipoPlanning } from "@/src/interfaces/TipoPlanning";

type TipoPlanningSelectorProps = {
  tipoPlannings: TipoPlanning[];
  onSelection: (selected: TipoPlanning) => void;
};

const TipoPlanningSelector: React.FC<TipoPlanningSelectorProps> = ({
  tipoPlannings,
  onSelection,
}) => {
  return (
    <FlatList
      data={tipoPlannings}
      keyExtractor={(item) => item.id.toString()}
      numColumns={2}
      renderItem={({ item }) => (
        <TouchableOpacity style={styles.card} onPress={() => onSelection(item)}>
          <Icon
            name="calendar-month"
            size={60}
            color={item.id === -1 ? "#000" : "#4a90e2"}
          />
          <Text style={styles.cardText}>{item.nombre}</Text>
        </TouchableOpacity>
      )}
    />
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    margin: 10,
    backgroundColor: "#ffffff",
    borderRadius: 10,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardText: {
    marginTop: 10,
    fontSize: 16,
    color: "#333",
    textAlign: "center",
  },
});

export default TipoPlanningSelector;
