import React, { useEffect, useState } from "react";
import { Calendar } from "react-native-calendars";
import { StyleSheet, View } from "react-native";
import Colors from "@/src/constants/Colors";

interface CalendarioPlanningProps {
  fechasAsignadasCreador: string[];
  fechasAsignadasParticipe: string[];
}

const CalendarioPlanning: React.FC<CalendarioPlanningProps> = ({
  fechasAsignadasCreador,
  fechasAsignadasParticipe,
}) => {
  const [markedDates, setMarkedDates] = useState<{ [key: string]: any }>({});

  useEffect(() => {
    const marcarFechas = () => {
      const fechasMarcadas: { [key: string]: any } = {};

      fechasAsignadasCreador.forEach((fecha) => {
        fechasMarcadas[fecha] = {
          selected: true,
          selectedColor: Colors.naranja.naranjaClaro,
          selectedTextColor: "black",
        };
      });

      fechasAsignadasParticipe.forEach((fecha) => {
        fechasMarcadas[fecha] = {
          selected: true,
          selectedColor: Colors.lila.lilaClaro,
          selectedTextColor: "black",
        };
      });

      setMarkedDates(fechasMarcadas);
    };

    marcarFechas();
  }, [fechasAsignadasCreador, fechasAsignadasParticipe]);

  const hoy = new Date();
  const fechaActual = hoy.toISOString().split("T")[0]; // La fecha actual para restringir el calendario

  return (
    <View style={styles.container}>
      <Calendar
        markedDates={markedDates} // Fechas marcadas en el calendario
        markingType={"multi-dot"} // Permitir múltiples marcas
        locale={"es"} // Establecer el idioma a español
        minDate={fechaActual} // Restringir para que no se puedan seleccionar fechas anteriores a hoy
        disableMonthChange={true} // Deshabilitar la navegación hacia meses anteriores
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
});

export default CalendarioPlanning;

