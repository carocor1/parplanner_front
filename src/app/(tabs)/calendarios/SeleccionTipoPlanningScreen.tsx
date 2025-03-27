import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import TipoPlanningSelector from "@/src/components/TipoPlanningCuadrado";
import { getTipoPlanning } from "@/src/services/tipoPlanningService";
import { TipoPlanning } from "@/src/interfaces/TipoPlanning";
import { useRouter, useLocalSearchParams } from "expo-router";
import DatePickerEvento from "@/src/components/DatePickerEvento";
import Colors from "@/src/constants/Colors";
import { ALERT_TYPE, Toast } from "react-native-alert-notification";
import { registrarPlanning } from "@/src/services/planningService";




const SeleccionTipoPlanningScreen = () => {
  const [tipoPlannings, setTipoPlannings] = useState<TipoPlanning[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPlanning, setSelectedPlanning] = useState<number | null>(null);
  const [fechaInicio, setFechaInicio] = useState<Date | null>(null);
  const router = useRouter();
  const searchParams = useLocalSearchParams(); // Capturar parámetros de la URL
  const planningId = searchParams.planningId; 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getTipoPlanning();
        const personalizado: Partial<TipoPlanning> = {
          id: -1,
          nombre: "Diseñar Plan Personalizado",
        };
        setTipoPlannings([...data, personalizado as TipoPlanning]);
      } catch (error) {
        console.error("Error al recuperar los tipos de planificación:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {

    if (planningId !== undefined && planningId !== null) {

      setSelectedPlanning(parseInt(planningId as string, 10)); 
      setFechaInicio(null);

      router.push("/(tabs)/calendarios/CalendarioScreen");
    };
    
    
  }, [planningId]);

  const registrarPlanPersonalizado = () => {
    router.push("/(tabs)/calendarios/CreacionTipoPlanningPersonalizadoScreen");
  };

  const validateInput = () => {
    const validationRules = [
      { condition: !fechaInicio, message: "La fecha de inicio es requerida" },
      { condition: !selectedPlanning, message: "El tipo de Planning es requerido" },
    ];

    for (const rule of validationRules) {
      if (rule.condition) {
        Toast.show({
          type: ALERT_TYPE.WARNING,
          title: "Error",
          textBody: rule.message,
        });
        return false;
      }
    }
    return true;
  };

  const registrarPlanningHandler = async () => {
    if (!validateInput()) {
      return;
    }

    try {
    

      await registrarPlanning(fechaInicio!, selectedPlanning!);
     
      Toast.show({
        type: ALERT_TYPE.SUCCESS,
        title: "Éxito",
        textBody: "Tu planificación se guardó correctamente.",
      });

      router.back();
    } catch (error) {
      console.error("Error al registrar el Planning:", error);
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: "Error",
        textBody: "Hubo un problema al guardar la planificación. Por favor, inténtalo de nuevo.",
      });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.containerTexto}>
        <Text style={styles.texto}> INGRESÁ LA FECHA DE INICIO DE TU PLANNING</Text>
      </View>

      <View style={styles.inputContainer}>
        <DatePickerEvento onDateChange={(date) => setFechaInicio(date)} minimumDate={new Date()} />
      </View>

      <View style={styles.containerTexto}>
        <Text style={styles.texto}> SELECCIONÁ UN TIPO DE PLANIFICACIÓN</Text>
      </View>

      {isLoading ? (
        <Text style={styles.loading}>Cargando datos...</Text>
      ) : (
        <TipoPlanningSelector
          tipoPlannings={tipoPlannings}
          onSelection={(planning) => {
            if (planning.id === -1) {
              registrarPlanPersonalizado();
            } else {
              setSelectedPlanning(planning.id);
              console.log("Planning existente seleccionado:", planning.id);
            }
          }}
        />
      )}
      <TouchableOpacity style={styles.button} onPress={registrarPlanningHandler}>
        <Text style={styles.buttonText}>GUARDAR PLANNING</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
  },
  loading: {
    fontSize: 16,
    color: "gray",
    textAlign: "center",
  },
  selected: {
    marginTop: 20,
    fontSize: 16,
    color: "#4a90e2",
    textAlign: "center",
  },
  inputContainer: {
    marginTop: 0,
    marginBottom:0, 
    width: "100%",
    justifyContent: "center", 
  },
  containerTexto: {
    backgroundColor: Colors.marron.marronClaro,
    padding: 10,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 0,
    marginBottom:10, 
    width: "100%", 
  },
  texto: {
    color: Colors.marron.marronNormal,
    fontWeight: "bold",
    fontSize:16, 
    textAlign:"center"
  },
  button: {
      backgroundColor: Colors.rosa.rosaPetitte,
      padding: 10,
      borderRadius: 10,
      justifyContent: "center",
      alignItems: "center",
      marginTop: 10,
    },
    buttonText: {
      color: Colors.rosa.rosaOscuro,
      fontWeight: "bold",
      fontSize:20
    },
  
});

export default SeleccionTipoPlanningScreen;
