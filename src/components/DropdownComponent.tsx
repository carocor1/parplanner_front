import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";

interface DropdownComponentProps {
  title: string;
  labels: string[];
  onSelect: (label: string) => void;
  style?: object;
}

const DropdownComponent: React.FC<DropdownComponentProps> = ({
  title,
  labels,
  onSelect,
  style,
}) => {
  const data = labels.map((label, index) => ({
    label: label,
    value: index.toString(),
  }));

  const [value, setValue] = useState<string | null>(null);
  const [isFocus, setIsFocus] = useState(false);

  return (
    <View style={[styles.container, style]}>
      <Dropdown
        style={[styles.dropdown, isFocus && { borderColor: "gray" }]}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        data={data}
        search
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder={title}
        searchPlaceholder="Buscar..."
        value={value}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onChange={(item) => {
          setValue(item.value);
          setIsFocus(false);
          onSelect(item.label);
        }}
      />
    </View>
  );
};

export default DropdownComponent;

const styles = StyleSheet.create({
  container: {
    shadowColor: "black",
    marginBottom: 8,
    paddingHorizontal: 20,
  },
  dropdown: {
    height: 43,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: "#ffffff",
    padding: 10,
  },
  placeholderStyle: {
    fontSize: 14,
    color: "gray",
  },
  selectedTextStyle: {
    fontSize: 14,
    color: "black",
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 14,
    borderRadius: 10,
  },
});
