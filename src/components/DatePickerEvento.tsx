import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

type DatePickerEventoProps = {
  label?: string; // El texto del label (opcional)
  onDateChange?: (date: Date) => void; // Callback que recibe la fecha seleccionada
  minimumDate: Date; // Límite de fecha mínima
  selectedDate?: Date | null;
};

const DatePickerEvento: React.FC<DatePickerEventoProps> = ({
  label,
  onDateChange,
  minimumDate,
  selectedDate,
}) => {
  const [currentDate, setCurrentDate] = useState<Date | null>(null); // Inicializa sin fecha seleccionada
  const [showPicker, setShowPicker] = useState(false); // Controla la visibilidad del picker

  // Formateador para la fecha seleccionada
  const formatDate = (date: Date): string => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`; // Devuelve el formato dd/MM/yyyy
  };

  useEffect(() => {
    if (selectedDate) {
      setCurrentDate(selectedDate); // Actualiza la fecha inicial si se recibe
    }
  }, [selectedDate]);

  // Maneja el cambio en la fecha seleccionada
  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowPicker(false); // Oculta el picker
    if (event.type === "set" && selectedDate) {
      setCurrentDate(selectedDate); // Actualiza la fecha seleccionada
      if (onDateChange) {
        onDateChange(selectedDate); // Notifica al componente padre
      }
    }
  };

  // Abre el DateTimePicker
  const showDateTimePicker = () => {
    setShowPicker(true);
  };

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}

      <TouchableOpacity style={styles.dropdown} onPress={showDateTimePicker}>
        <Text
          style={[styles.selectedTextStyle, !currentDate && { color: "#666" }]}
        >
          {currentDate ? formatDate(currentDate) : "Fecha"}{" "}
          {/* Muestra "Fecha" por defecto */}
        </Text>
      </TouchableOpacity>

      {showPicker && (
        <DateTimePicker
          mode="date"
          display="spinner"
          value={currentDate || new Date()} // Usa la fecha actual si no hay selección previa
          onChange={handleDateChange}
          minimumDate={minimumDate} // Límite inferior para las fechas seleccionables
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
  label: {
    color: "black",
    fontSize: 15,
    fontWeight: "bold",
    alignSelf: "flex-start",
    marginBottom: 5,
    marginLeft: "7%",
  },
  selectedTextStyle: {
    color: "black",
    fontSize: 14,
  },
});

export default DatePickerEvento;
