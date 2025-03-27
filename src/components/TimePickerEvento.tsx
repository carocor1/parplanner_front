import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

type TimePickerEventoProps = {
  placeholder?: string; // Texto predeterminado que funciona como placeholder
  onTimeChange?: (time: string) => void; // Callback que recibe la hora seleccionada
};

const TimePickerEvento: React.FC<TimePickerEventoProps> = ({ placeholder = "Seleccionar hora", onTimeChange }) => {
  const [currentTime, setCurrentTime] = useState<string | null>(null); // Estado inicial sin hora seleccionada
  const [showPicker, setShowPicker] = useState(false); // Controla la visibilidad del picker

  // Formateador para la hora seleccionada (hh:mm)
  const formatTime = (date: Date): string => {
    const hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${hours}:${minutes}`;
  };

  // Maneja el cambio en la hora seleccionada
  const handleTimeChange = (event: any, selectedTime?: Date) => {
    setShowPicker(false); // Oculta el picker
    if (event.type === "set" && selectedTime) {
      const formattedTime = formatTime(selectedTime); // Formatea la hora seleccionada
      setCurrentTime(formattedTime); // Actualiza el estado con la hora
      if (onTimeChange) {
        onTimeChange(formattedTime); // Notifica al componente padre
      }
    }
  };

  // Abre el TimePicker
  const showTimePicker = () => {
    setShowPicker(true);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.dropdown} onPress={showTimePicker}>
        <Text style={[styles.selectedTextStyle, !currentTime && { color: "#666" }]}>
          {currentTime || placeholder} {/* Muestra el `placeholder` o la hora seleccionada */}
        </Text>
      </TouchableOpacity>

      {showPicker && (
        <DateTimePicker
          mode="time"
          display="spinner"
          value={new Date()} // Valor inicial: la hora actual
          onChange={handleTimeChange}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginBottom: 20,
  },
  dropdown: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    backgroundColor: "white",
    borderRadius: 10,
  },
  selectedTextStyle: {
    color: "black",
    fontSize: 14,
  },
});

export default TimePickerEvento;
