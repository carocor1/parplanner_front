import React, { useState } from "react";
import { Calendar } from "react-native-calendars";
import { StyleSheet, View, TouchableOpacity, Text } from "react-native";
import Colors from "@/src/constants/Colors"; // Asegúrate de importar tus colores correctamente

interface CalendarioProps {
  onSelectDatesCreator: (dates: string[]) => void;
  onSelectDatesParticipant: (dates: string[]) => void;
}

const Calendario: React.FC<CalendarioProps> = ({ onSelectDatesCreator, onSelectDatesParticipant }) => {
  const [fechasCreador, setFechasCreador] = useState<{ [key: string]: any }>({});
  const [fechasParticipante, setFechasParticipante] = useState<{ [key: string]: any }>({});
  const [modo, setModo] = useState<"creador" | "participante">("creador"); 


  // Obtener la fecha de hoy
  const hoy = new Date();
  const diaActual = hoy.getDate();
  const hoyFormatted = hoy.toISOString().split("T")[0];

  // Si es el día 15 o más, usar el próximo mes como inicial
  const mesInicial =
    diaActual >= 15
      ? new Date(hoy.getFullYear(), hoy.getMonth() + 1, 1) // Primer día del siguiente mes
      : hoy; // Si es antes del día 15, usar el mes actual

  const mesInicialFormatted = mesInicial.toISOString().split("T")[0];

  // Manejar fechas del creador
  const manejarPresionDiaCreador = (day: { dateString: string }) => {
    setFechasCreador((prevFechas) => {
      const nuevasFechas = { ...prevFechas };
      if (nuevasFechas[day.dateString]) {
        delete nuevasFechas[day.dateString]; // Deseleccionar
      } else {
        nuevasFechas[day.dateString] = {
          selected: true,
          selectedColor: Colors.naranja.naranjaClaro, // Color naranja para el creador
          selectedTextColor: "white",
        };
      }
      onSelectDatesCreator(Object.keys(nuevasFechas)); // Notificar al componente padre
      return nuevasFechas;
    });
  };

  // Manejar fechas del participante
  const manejarPresionDiaParticipante = (day: { dateString: string }) => {
    setFechasParticipante((prevFechas) => {
      const nuevasFechas = { ...prevFechas };
      if (nuevasFechas[day.dateString]) {
        delete nuevasFechas[day.dateString]; // Deseleccionar
      } else {
        nuevasFechas[day.dateString] = {
          selected: true,
          selectedColor: Colors.lila.lilaClaro, // Color lila para el participante
          selectedTextColor: "white",
        };
      }
      onSelectDatesParticipant(Object.keys(nuevasFechas)); // Notificar al componente padre
      return nuevasFechas;
    });
  };

  // Seleccionar la función de manejo según el modo
  const manejarPresionDia =
    modo === "creador" ? manejarPresionDiaCreador : manejarPresionDiaParticipante;

  return (
    <View style={styles.calendarContainer}>
      <Calendar
        onDayPress={manejarPresionDia} // Lógica dinámica según modo
        markedDates={{ ...fechasCreador, ...fechasParticipante }} // Combina las selecciones
        markingType={"multi-dot"} // Permite múltiples marcas por día
        minDate={hoyFormatted} // Restringe fechas anteriores a hoy
        initialDate={mesInicialFormatted} // Fecha inicial dinámica
      />
    
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[
            styles.rectanguloCreador,
            modo === "creador" && { backgroundColor: Colors.naranja.naranjaClaro },
          ]}
          onPress={() => setModo("creador")}
        >
          <Text
            style={[
              styles.textoCreador,
              modo === "creador" && { color: Colors.naranja.naranjaOscuro },
            ]}
          >
            VOS
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.rectanguloParticipe,
            modo === "participante" && { backgroundColor: Colors.lila.lilaClaro },
          ]}
          onPress={() => setModo("participante")}
        >
          <Text
            style={[
              styles.textoParticipe,
              modo === "participante" && { color: Colors.lila.lilaNormal },
            ]}
          >
            OTRO PROGENITOR
          </Text>
        </TouchableOpacity>
      </View>

     
      
    </View>
  );
};

const styles = StyleSheet.create({
  calendarContainer: {
    width: "100%",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 15,
  },
  rectanguloCreador: {
    backgroundColor: Colors.naranja.naranjaClaro,
    padding: 5,
    borderRadius: 10,
  },
  textoCreador: {
    color: Colors.naranja.naranjaOscuro,
    fontWeight: "bold",
  },
  rectanguloParticipe: {
    backgroundColor: Colors.lila.lilaClaro,
    padding: 5,
    borderRadius: 10,
    justifyContent:"center"
  },
  textoParticipe: {
    color: Colors.lila.lilaNormal,
    fontWeight: "bold",
  },
});

export default Calendario;
