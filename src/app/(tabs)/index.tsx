import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import ComponenteCalendario from '@/src/components/ComponenteCalendario';

export default function CalendarioScreen() {
  const [fechasSeleccionadas, setFechasSeleccionadas] = useState<string[]>([]);

  const manejarFechasSeleccionadas = (fechas: string[]) => {
    setFechasSeleccionadas(fechas);
  };

  return (
    <View style={styles.calendarioContainer}>

      <ComponenteCalendario onSelectDates={manejarFechasSeleccionadas}/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  fechaTexto: {
    fontSize: 16,
    marginTop: 10,
    color: 'gray',
  },
  calendarioContainer: {
    width: "100%", // Asegura que ocupe todo el ancho posible
    justifyContent: 'center',
    alignItems: 'center',
  },
});
