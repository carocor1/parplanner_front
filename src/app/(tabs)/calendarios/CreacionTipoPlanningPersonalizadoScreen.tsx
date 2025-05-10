import {
  StyleSheet,
  View,
  TextInput,
  ScrollView,
  Text,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import Colors from "@/src/constants/Colors";
import { ALERT_TYPE, Toast } from "react-native-alert-notification";
import { registrarTipoPlanning } from "@/src/services/tipoPlanningService";
import CustomButton from "@/src/components/CustomButton";

const CreacionTipoPlanningPersonalizadoScreen = () => {
  const searchParams = useLocalSearchParams();
  const router = useRouter();
  const nombreCreador = "VOS";
  const nombreParticipante = "O";
  const [nombre, setNombre] = useState("");
  const [dias, setDias] = useState<(string | null)[]>(
    Array(14).fill("creador")
  );

  const validateInput = () => {
    const validationRules = [
      { condition: !nombre, message: "El título es requerido" },
      {
        condition: dias.some((dia) => dia === null),
        message: "Todos los días deben estar asignados a un progenitor.",
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

  const toggleDia = (index: number, progenitor: string) => {
    setDias((prev) => {
      const newDias = [...prev];
      newDias[index] = progenitor;
      return newDias;
    });
  };

  const calcularPorcentaje = (progenitor: string): number => {
    const totalDias = dias.length;
    const diasAsignados = dias.filter((dia) => dia === progenitor).length;
    return Math.round((diasAsignados / totalDias) * 100);
  };

  const crearTipoPlanning = async () => {
    if (!validateInput()) {
      return;
    }

    const vector: number[] = [];
    let contador = 1;

    for (let i = 1; i < dias.length; i++) {
      if (dias[i] === dias[i - 1]) {
        contador++;
      } else {
        vector.push(contador);
        contador = 1;
      }
    }
    vector.push(contador);
    console.log(vector);

    try {
      const response = await registrarTipoPlanning(nombre, vector);
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
            fechaInicio: searchParams.fechaInicio,
            nombreTipoPlan: response.nombre,
            planningExpiradoId: searchParams.planningExpiradoId,
          },
        });
      }
      setNombre("");
      setDias(Array(14).fill("creador"));
    } catch (error) {
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: "Error",
        textBody:
          "Hubo un problema al guardar la planificación. Por favor, inténtalo de nuevo.",
      });
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <View style={styles.inputContainer}>
          <TextInput
            style={[styles.input]}
            placeholder="Título del tipo de planning"
            value={nombre}
            onChangeText={setNombre}
          />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.titleText}>
            INGRESÁ LA DISTRIBUCIÓN DE LOS DÍAS DEL TIPO DE PLANNING
          </Text>
          <Text style={styles.centeredText}>
            Para ello, seleccioná los días que te gustaría que tu hijo pase con
            el otro progenitor.
          </Text>
          <Text style={styles.italicText}>
            Por ejemplo, si quieres que tu hijo pase 7 días consecutivos contigo
            y luego 7 días con el otro progenitor, seleccioná los últimos 7
            círculos.
          </Text>
        </View>
        <View style={styles.circulosContainer}>
          {dias.map((dia, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.circulo,
                dia === "creador" && styles.circuloCreador,
                dia === "participante" && styles.circuloParticipante,
              ]}
              onPress={() => {
                const nuevoProgenitor =
                  dia === "creador" ? "participante" : "creador";
                toggleDia(index, nuevoProgenitor);
              }}
            >
              <Text style={styles.circuloTexto}>
                {dia === "creador"
                  ? nombreCreador.charAt(0).toUpperCase()
                  : nombreParticipante.charAt(0).toUpperCase()}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.legendContainer}>
          <View style={styles.legendItem}>
            <View style={[styles.legendCircle, styles.circuloCreador]} />
            <View>
              <Text style={styles.legendText}>Vos</Text>
              <Text style={styles.percentageText}>
                {calcularPorcentaje("creador")}%
              </Text>
            </View>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendCircle, styles.circuloParticipante]} />
            <View>
              <Text style={styles.legendText}>Otro Progenitor</Text>
              <Text style={styles.percentageText}>
                {calcularPorcentaje("participante")}%
              </Text>
            </View>
          </View>
        </View>

        <CustomButton
          onPress={crearTipoPlanning}
          title="REGISTRAR TIPO DE PLANNING"
          backgroundColor={Colors.azul.azulOscuro}
          textColor={"white"}
        ></CustomButton>
      </View>
    </ScrollView>
  );
};

export default CreacionTipoPlanningPersonalizadoScreen;

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "space-between",
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "white",
  },
  inputContainer: {
    marginTop: 20,
    marginBottom: 15,
    width: "100%",
  },
  input: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
  },
  circulosContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  circulo: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  circuloCreador: {
    backgroundColor: Colors.marron.marronClaro,
  },
  circuloParticipante: {
    backgroundColor: Colors.lila.lilaClaro,
  },
  circuloTexto: {
    color: "white",
    fontWeight: "bold",
  },
  textContainer: {
    marginTop: 50,
    marginBottom: 20,
    alignItems: "center",
  },
  titleText: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  centeredText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 10,
  },
  italicText: {
    fontSize: 14,
    fontStyle: "italic",
    textAlign: "center",
    marginTop: 10,
    marginBottom: 10,
  },
  legendContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginBottom: 60,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  legendCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 5,
  },
  legendText: {
    fontSize: 14,
    color: Colors.gris.oscuro,
  },
  percentageText: {
    fontSize: 12,
    color: Colors.gris.oscuro,
    textAlign: "center",
    marginTop: 2,
  },
});
