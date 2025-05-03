import { StyleSheet, View, TextInput, ScrollView } from "react-native";
import React, { useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import Calendario from "@/src/components/ComponenteCalendario";
import Colors from "@/src/constants/Colors";
import { ALERT_TYPE, Toast } from "react-native-alert-notification";
import { registrarTipoPlanning } from "@/src/services/tipoPlanningService";
import CustomButton from "@/src/components/CustomButton";
const CreacionTipoPlanningPersonalizadoScreen = () => {
  const [nombre, setNombre] = useState("");
  const [fechasCreador, setFechasCreador] = useState<string[]>([]);
  const [fechasParticipante, setFechasParticipante] = useState<string[]>([]);
  const searchParams = useLocalSearchParams();
  const fechaInicio = useLocalSearchParams() as {
    fechaInicio?: string;
  };
  const router = useRouter();

  const validateInput = () => {
    const validationRules = [
      { condition: !nombre, message: "El título es requerido" },
      {
        condition: fechasCreador.length === 0,
        message: "El creador no ha seleccionado ninguna fecha.",
      },
      {
        condition: fechasParticipante.length === 0,
        message: "El participante no ha seleccionado ninguna fecha.",
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

  // Función para calcular el vector intercalado
  const calcularVectorIntercalado = (
    fechasCreador: string[],
    fechasParticipante: string[]
  ): number[] => {
    let resultado: number[] = [];

    const calcularDiasConsecutivos = (fechas: string[]): number[] => {
      if (fechas.length === 0) return [];

      const fechasOrdenadas = fechas.sort(
        (a, b) => new Date(a).getTime() - new Date(b).getTime()
      );
      let grupos: number[] = [];
      let contador = 1;
      for (let i = 1; i < fechasOrdenadas.length; i++) {
        const fechaActual = new Date(fechasOrdenadas[i]);
        const fechaAnterior = new Date(fechasOrdenadas[i - 1]);
        const diferenciaDias =
          (fechaActual.getTime() - fechaAnterior.getTime()) /
          (1000 * 60 * 60 * 24);

        if (diferenciaDias === 1) {
          contador++;
        } else {
          grupos.push(contador);
          contador = 1;
        }
      }
      grupos.push(contador);
      return grupos;
    };

    const gruposCreador = calcularDiasConsecutivos(fechasCreador);
    const gruposParticipante = calcularDiasConsecutivos(fechasParticipante);

    const maxLength = Math.max(gruposCreador.length, gruposParticipante.length);
    for (let i = 0; i < maxLength; i++) {
      if (i < gruposCreador.length) resultado.push(gruposCreador[i]);
      if (i < gruposParticipante.length) resultado.push(gruposParticipante[i]);
    }
    return resultado;
  };

  const evaluarVector = (vector: number[]): number[] => {
    const contador = vector.length;
    if (contador < 2) {
      return [];
    }

    let suma = vector.reduce((acc, num) => acc + num, 0);

    if (suma < 14) {
      let nuevovector = [...vector];
      let contador2 = 0;

      while (suma < 14 && suma + vector[contador2] <= 14) {
        nuevovector.push(vector[contador2]);
        suma += vector[contador2];
        contador2 = (contador2 + 1) % vector.length;
      }

      if (suma === 14) {
        return nuevovector;
      } else {
        return [];
      }
    } else if (suma === 14) {
      return vector;
    } else {
      return [];
    }
  };

  const crearTipoPlanning = async () => {
    if (!validateInput()) {
      return;
    }
    const vectorIntercalado = calcularVectorIntercalado(
      fechasCreador,
      fechasParticipante
    );
    const evaluacion = evaluarVector(vectorIntercalado);
    if (evaluacion.length === 0) {
      Toast.show({
        type: ALERT_TYPE.WARNING,
        title: "Error",
        textBody: "La distribución no es equitativa",
      });
      return;
    } else {
      try {
        const response = await registrarTipoPlanning(nombre, evaluacion);
        if (response.id) {
          Toast.show({
            type: ALERT_TYPE.SUCCESS,
            title: "Éxito",
            textBody: "Tu tipo de planning se guardó correctamente.",
          });
          router.push({
            pathname: "/(tabs)/calendarios/CreacionPlanningScreen",
            params: {
              planningId: response.id,
              planningRechazandoId: searchParams.planningRechazado,
              fechaInicio: fechaInicio?.fechaInicio,
              nombreTipoPlan: response.nombre,
              planningExpiradoId: searchParams.planningExpiradoId,
            },
          });
        }
        setNombre("");
        setFechasCreador([]);
        setFechasParticipante([]);
      } catch (error) {
        Toast.show({
          type: ALERT_TYPE.DANGER,
          title: "Error",
          textBody:
            "Hubo un problema al guardar la planificación. Por favor, inténtalo de nuevo.",
        });
      }
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View>
        <View style={styles.inputContainer}>
          <TextInput
            style={[styles.input]}
            placeholder="Nombre"
            value={nombre}
            onChangeText={setNombre}
          />
        </View>

        <View style={styles.calendarioContainer}>
          <Calendario
            onSelectDatesCreator={(fechas) => setFechasCreador(fechas)}
            onSelectDatesParticipant={(fechas) => setFechasParticipante(fechas)}
          />
        </View>

        <CustomButton
          onPress={crearTipoPlanning}
          title="REGISTRAR TIPO DE PLANNING"
          backgroundColor={Colors.marron.marronClaro}
          textColor={Colors.marron.marronNormal}
        ></CustomButton>
      </View>
    </ScrollView>
  );
};

export default CreacionTipoPlanningPersonalizadoScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "white",
  },
  inputContainer: {
    marginBottom: 15,
    width: "100%",
  },
  calendarioContainer: {
    flex: 1,
    width: "100%",
    marginBottom: 20,
  },
  input: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
  },
});
