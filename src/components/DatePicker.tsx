import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import {
  Button,
  Platform,
  View,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Text } from "./Themed";

interface DateTimePickerProps {
  onChange: (date: Date) => void;
  currentDate: Date;
  label: string;
}

export default function DateTimePicker(props: DateTimePickerProps) {
  if (Platform.OS === "android") {
    return <AndroidDateTimePicker {...props} />;
  }
  return null;
}

export const AndroidDateTimePicker = ({
  onChange,
  currentDate,
  label,
}: DateTimePickerProps) => {
  const showDateTimePicker = () => {
    DateTimePickerAndroid.open({
      value: currentDate,
      onChange: (_, date?: Date) => onChange(date || new Date()),
      mode: "date",
    });
  };

  const opciones = ["Seleccionar Fecha"];
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}

      <TouchableOpacity style={styles.dropdown} onPress={showDateTimePicker}>
        <Text style={styles.selectedTextStyle}>
          {currentDate.toLocaleDateString()}
        </Text>
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    borderRadius: 15,
    paddingHorizontal: 20,
  },

  dropdown: {
    height: 43,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 8,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    marginBottom: 3,
  },
  label: {
    color: "#000",
    fontSize: 14,
    fontWeight: "bold",
    alignSelf: "flex-start",
    marginBottom: 5,
    marginLeft: 8,
  },
  selectedTextStyle: {
    color: "black",
    fontSize: 14,
  },
});
