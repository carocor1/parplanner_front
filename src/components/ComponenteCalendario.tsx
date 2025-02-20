import React, { useState } from 'react';
import { Calendar } from 'react-native-calendars';
import { StyleSheet, View } from 'react-native';

interface CalendarioProps {
  onSelectDates: (dates: string[]) => void;
}

const Calendario: React.FC<CalendarioProps> = ({ onSelectDates }) => {
  const [fechasSeleccionadas, setFechasSeleccionadas] = useState<{ [key: string]: any }>({});

  const manejarPresionDia = (day: { dateString: string }) => {
    setFechasSeleccionadas((prevFechas) => {
      const nuevasFechas = { ...prevFechas };

      if (nuevasFechas[day.dateString]) {
        // Si la fecha ya está seleccionada, la eliminamos
        delete nuevasFechas[day.dateString];
      } else {
        // Si no está seleccionada, la agregamos
        nuevasFechas[day.dateString] = {
          selected: true,
          selectedColor: 'pink',
          selectedTextColor: 'white',
        };
      }

      // Llamamos al callback con las fechas seleccionadas
      onSelectDates(Object.keys(nuevasFechas));

      return nuevasFechas;
    });
  };

  const hoy = new Date();
  const hoyFormatted = hoy.toISOString().split('T')[0];
  

  return (
    <View style={styles.calendarContainer}>
      <Calendar
        onDayPress={manejarPresionDia}
        markedDates={fechasSeleccionadas}
        markingType={'multi-dot'}
        minDate={hoyFormatted} // Restringe la selección a partir de la fecha actual
        initialDate={hoyFormatted} // Muestra la fecha de hoy al cargar
      />
    </View>
  );
};

const styles = StyleSheet.create({
  calendarContainer: {
    width: '100%',
  },
});

export default Calendario;


