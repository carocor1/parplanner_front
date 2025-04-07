import React, { useState } from "react";
import { Text, StyleSheet, TouchableOpacity, FlatList } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { TipoPlanning } from "@/src/interfaces/TipoPlanning";
import Colors from "../constants/Colors";

type TipoPlanningSelectorProps = {
  tipoPlannings: TipoPlanning[];
  onSelection: (selected: TipoPlanning) => void;
};

const TipoPlanningSelector: React.FC<TipoPlanningSelectorProps> = ({
  tipoPlannings,
  onSelection,
}) => {
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const handleSelection = (item: TipoPlanning) => {
    setSelectedId(item.id);
    onSelection(item);
  };

  return (
    <FlatList
      data={tipoPlannings}
      keyExtractor={(item) => item.id.toString()}
      numColumns={2}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={[styles.card, selectedId === item.id && styles.selectedCard]}
          onPress={() => handleSelection(item)}
        >
          <Icon name="calendar-month" size={60} color={Colors.azul.celeste} />
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
    marginTop: 10,
    fontSize: 16,
    color: Colors.negro.negroNormal,
    textAlign: "center",
  },
});

export default TipoPlanningSelector;
