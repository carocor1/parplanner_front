import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import TipoPlanningSelector from "@/src/components/TipoPlanningCuadrado";
import { getTipoPlanning } from "@/src/services/tipoPlanningService";
import { TipoPlanning } from "@/src/interfaces/TipoPlanning";
import { useRouter, useLocalSearchParams } from "expo-router";
import DatePickerEvento from "@/src/components/DatePickerEvento";
import Colors from "@/src/constants/Colors";
import { ALERT_TYPE, Toast } from "react-native-alert-notification";
import {
  rechazarPlanning,
  registrarPlanning,
  obtenerPrevisualizacionPlanning,
} from "@/src/services/planningService";
import LoadingIndicator from "@/src/components/LoadingIndicator";
import CustomButton from "@/src/components/CustomButton";
import CalendarioPlanning from "@/src/components/CalendarioPlanningDef";

const CreacionPlanningScreen = () => {
  const [tipoPlannings, setTipoPlannings] = useState<TipoPlanning[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPlanning, setSelectedPlanning] = useState<number | null>(null);
  const [fechaInicio, setFechaInicio] = useState<Date | null>(null);
  const [fechasAsignadasCreador, setFechasAsignadasCreador] = useState<
    string[]
  >([]);
  const [fechasAsignadasParticipe, setFechasAsignadasParticipe] = useState<
    string[]
  >([]);
  const [modalVisible, setModalVisible] = useState(false);
  const router = useRouter();
  const searchParams = useLocalSearchParams();
  const planningId = searchParams.planningId;
  const { planningRechazandoId } = useLocalSearchParams();

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
      router.back();
    }
  }, [planningId]);

  const registrarPlanPersonalizado = () => {
    router.push("/(tabs)/calendarios/CreacionTipoPlanningPersonalizadoScreen");
  };

  const validateInput = () => {
    const validationRules = [
      { condition: !fechaInicio, message: "La fecha de inicio es requerida" },
      {
        condition: !selectedPlanning,
        message: "El tipo de Planning es requerido",
      },
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

  const obtenerFechas = async () => {
    if (!validateInput()) {
      return;
    }
    try {
      setIsLoading(true);

      const response = await obtenerPrevisualizacionPlanning(
        fechaInicio!,
        selectedPlanning!
      );
      setFechasAsignadasCreador(response.fechasAsignadasCreador);
      setFechasAsignadasParticipe(response.fechasAsignadasParticipe);
      setModalVisible(true);
    } catch (error) {
      console.error("Error al obtener las fechas asignadas:", error);
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: "Error",
        textBody:
          "Hubo un problema al obtener las fechas asignadas. Por favor, inténtalo de nuevo.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const registrarPlanningHandler = async () => {
    if (!validateInput()) {
      return;
    }

    try {
      if (planningRechazandoId) {
        const planningIdParseado = parseInt(planningRechazandoId as string, 10);
        await rechazarPlanning(
          planningIdParseado,
          fechaInicio!,
          selectedPlanning!
        );
      } else {
        await registrarPlanning(fechaInicio!, selectedPlanning!);
      }
      Toast.show({
        type: ALERT_TYPE.SUCCESS,
        title: "Éxito",
        textBody: "Tu planificación se guardó correctamente.",
      });
      setModalVisible(false);
      router.back();
    } catch (error) {
      console.error("Error al registrar el Planning:", error);
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: "Error",
        textBody:
          "Hubo un problema al guardar la planificación. Por favor, inténtalo de nuevo.",
      });
    }
  };

  if (isLoading) {
    return <LoadingIndicator />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.containerTexto}>
        <Text style={styles.texto}>
          INGRESÁ LA FECHA DE INICIO DE TU PLANNING
        </Text>
      </View>

      <View>
        <DatePickerEvento
          onDateChange={(date) => setFechaInicio(date)}
          minimumDate={new Date()}
        />
      </View>

      <View style={styles.containerTexto}>
        <Text style={styles.texto}>SELECCIONÁ UN TIPO DE PLANIFICACIÓN</Text>
      </View>

      <TipoPlanningSelector
        tipoPlannings={tipoPlannings}
        onSelection={(planning) => {
          if (planning.id === -1) {
            registrarPlanPersonalizado();
          } else {
            setSelectedPlanning(planning.id);
          }
        }}
      />

      <CustomButton
        title="VER PREVISUALIZACIÓN"
        onPress={obtenerFechas}
        backgroundColor={Colors.rosa.rosaPetitte}
        textColor={Colors.rosa.rosaOscuro}
      />

      {/* Modal para CalendarioPlanning */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPressOut={() => setModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <CalendarioPlanning
              fechasAsignadasCreador={fechasAsignadasCreador}
              fechasAsignadasParticipe={fechasAsignadasParticipe}
            />
            <View style={styles.modalButtons}>
              <CustomButton
                title="CONFIRMAR"
                onPress={registrarPlanningHandler}
                backgroundColor={Colors.verde.verdeClaro}
                textColor={Colors.verde.verdeMuyOscuro}
              />
              <CustomButton
                title="REGRESAR"
                onPress={() => setModalVisible(false)}
                backgroundColor={Colors.gris.normal}
                textColor="white"
              />
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "white",
  },
  containerTexto: {
    backgroundColor: Colors.marron.marronClaro,
    padding: 10,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    width: "100%",
  },
  texto: {
    color: Colors.marron.marronNormal,
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    height: "52%",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginTop: 40,
    width: "100%",
    marginLeft: -30,
  },
});

export default CreacionPlanningScreen;
