import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text, Modal, TouchableOpacity } from "react-native";
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
import CustomTextBox from "@/src/components/CustomTextBox";
import TipoPlanningCuadrado from "@/src/components/TipoPlanningCuadrado";

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
  const tipoPlanningId = searchParams.planningId;
  const fechaInicioParams = searchParams.fechaInicio;
  const nombreTipoPlan = searchParams.nombreTipoPlan;
  const { planningRechazandoId } = useLocalSearchParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getTipoPlanning();
        setTipoPlannings(data);
      } catch (error) {
        console.error("Error al recuperar los tipos de planificación:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    console.log("PARAMETROS: ", searchParams);
    if (tipoPlanningId !== undefined && tipoPlanningId !== null) {
      const parsedId = parseInt(tipoPlanningId as string, 10);
      setSelectedPlanning(parsedId);
      const personalizado: Partial<TipoPlanning> = {
        id: parsedId,
        nombre: nombreTipoPlan as string,
      };
      setTipoPlannings((prev) => {
        if (!prev.some((planning) => planning.id === parsedId)) {
          return [...prev, personalizado as TipoPlanning];
        }
        return prev;
      });
    } else {
      console.log("tipoPlannings", tipoPlannings);
      const personalizado: Partial<TipoPlanning> = {
        id: -1,
        nombre: "Plan Personalizado",
      };
      setTipoPlannings((prev) => {
        if (!prev.some((planning) => planning.id === -1)) {
          return [...prev, personalizado as TipoPlanning];
        }
        return prev;
      });
    }

    if (fechaInicioParams !== undefined && fechaInicioParams !== null) {
      setFechaInicio(new Date(fechaInicioParams as string));
    }
  }, [tipoPlanningId, fechaInicioParams, tipoPlannings]);

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
        console.log(
          "Planning rechazado:",
          planningIdParseado,
          fechaInicio,
          selectedPlanning
        );
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
      router.push("/calendarios/PlanningScreen");
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
      <CustomTextBox
        text="INGRESÁ LA FECHA DE INICIO DE TU PLANNING"
        backgroundColor={Colors.marron.marronClaro}
        textColor={Colors.marron.marronNormal}
      ></CustomTextBox>

      <View>
        <DatePickerEvento
          onDateChange={(date) => setFechaInicio(date)}
          minimumDate={new Date()}
          selectedDate={fechaInicio}
        />
      </View>

      <CustomTextBox
        text="SELECCIONÁ UN TIPO DE PLANIFICACIÓN"
        backgroundColor={Colors.marron.marronClaro}
        textColor={Colors.marron.marronNormal}
      ></CustomTextBox>

      <View style={styles.planningContainer}>
        {tipoPlannings.map((tipoPlanning) => (
          <TipoPlanningCuadrado
            key={tipoPlanning.id}
            tipoPlanning={tipoPlanning}
            isSelected={selectedPlanning === tipoPlanning.id}
            onSelection={(selectedPlanning) => {
              if (selectedPlanning.id === -1) {
                console.log("------------------------------------------");
                console.log("PANTALLA DE CREACION PLANNING");
                console.log("Planning rechazado:", planningRechazandoId);
                console.log("fechaInicioString:", fechaInicio?.toISOString());
                console.log("------------------------------------------");
                router.push({
                  pathname:
                    "/(tabs)/calendarios/CreacionTipoPlanningPersonalizadoScreen",
                  params: {
                    planningRechazado: planningRechazandoId,
                    fechaInicio: fechaInicio?.toISOString(),
                  },
                });
              } else {
                setSelectedPlanning(selectedPlanning.id);
              }
            }}
          />
        ))}
      </View>

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
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    width: "100%",
    marginLeft: -30,
  },
  planningContainer: {
    flexDirection: "row",
    flexWrap: "wrap", // Permite que los cuadrados se distribuyan en varias filas
    justifyContent: "space-between", // Espaciado uniforme entre los cuadrados
    padding: 10,
  },
});

export default CreacionPlanningScreen;
