import { View, Text, StyleSheet, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import SaveButton from "../../../components/SaveButton";
import CancelButton from "../../../components/CancelButton";
import { getCategorias } from "@/src/services/categoriasService";
import { registrarGasto } from "@/src/services/gastoService";
import CustomTextInput from "@/src/components/TextInput";
import Colors from "@/src/constants/Colors";
import CustomDropdown from "@/src/components/CustomDropdown";
import InputSpinner from "react-native-input-spinner";

const RegistrarGastoScreen = () => {
  const [titulo, setTitulo] = useState<string>("");
  const [monto, setMonto] = useState<number>();
  const [descripcion, setDescripcion] = useState<string>("");
  const [particion1Seleccionada, setParticion1Seleccionada] =
    useState<number>(50);
  const [particion2Seleccionada, setParticion2Seleccionada] =
    useState<number>(50);
  const [errors, setErrors] = useState<string>("");
  const router = useRouter();
  const [isFocus, setIsFocus] = useState(false);

  const [categorias, setCategorias] = useState<
    Array<{ id: number; nombre: string }>
  >([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] =
    useState<string>("");

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const categorias = await getCategorias();
        setCategorias(categorias);
      } catch (error) {
        console.error("Error al obtener categorías:", error);
      }
    };
    fetchCategorias();
  }, []);

  const validateInput = () => {
    const validationRules = [
      { condition: !titulo, message: "El titulo es requerido" },
      { condition: !monto, message: "El monto es requerido" },
      {
        condition: !categoriaSeleccionada,
        message: "No se seleccionó una categoría",
      },
      {
        condition: !particion1Seleccionada,
        message: "No se indicó la partición",
      },
      {
        condition: !particion2Seleccionada,
        message: "No se indicó la partición",
      },
    ];

    for (const rule of validationRules) {
      if (rule.condition) {
        setErrors(rule.message);
        return false;
      }
    }

    setErrors("");
    return true;
  };

  const crearGasto = async () => {
    if (!validateInput()) {
      return;
    }

    try {
      if (monto) {
        await registrarGasto(
          titulo,
          monto,
          new Date(),
          particion1Seleccionada,
          particion2Seleccionada,
          categoriaSeleccionada,
          descripcion
        );
        setTitulo("");
        setMonto(0);
        setDescripcion("");
        setCategoriaSeleccionada("");
        setParticion1Seleccionada(50);
        setParticion2Seleccionada(50);
        router.back();
      }
    } catch (error) {
      console.error("Error al crear gasto:", error);
      setErrors("Ocurrió un error al guardar el gasto.");
    }
  };

  const noGuardarGasto = () => {
    router.back();
  };

  const handleParticionChange = (value: number) => {
    setParticion1Seleccionada(value);
    setParticion2Seleccionada(100 - value);
  };

  const handleParticion2Change = (num: number) => {
    setParticion2Seleccionada(num);
    setParticion1Seleccionada(100 - num);
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <CustomTextInput
          label="Titulo del gasto"
          placeholder="Escribe el titulo del gasto"
          value={titulo}
          onChangeText={(titulo) => {
            setTitulo(titulo);
          }}
          keyboardType="default"
          primaryColor={Colors.azul.azulOscuro}
        />

        <CustomDropdown
          label="Categoría del gasto"
          data={categorias.map((categoria) => ({
            label: categoria.nombre,
            value: categoria.nombre,
          }))}
          value={categoriaSeleccionada}
          onChange={setCategoriaSeleccionada}
          isFocus={isFocus}
          setIsFocus={setIsFocus}
          primaryColor={Colors.azul.azulOscuro}
        />

        <CustomTextInput
          label="Descripción del gasto"
          placeholder="Escriba la descripción del gasto"
          value={descripcion}
          onChangeText={(descripcion) => {
            setDescripcion(descripcion);
          }}
          keyboardType="default"
          primaryColor={Colors.azul.azulOscuro}
        />

        <CustomTextInput
          label="Monto del gasto"
          placeholder="Escriba el monto del gasto"
          value={monto ? monto.toString() : ""}
          onChangeText={(monto) => {
            setMonto(Number(monto));
          }}
          keyboardType="numeric"
          primaryColor={Colors.azul.azulOscuro}
        />

        <View style={styles.particionesContenedor}>
          <Text style={styles.particionesLabel}>Particiones</Text>
          <Text style={styles.particionesLabelSubtitulo}>
            Ingresá el porcentaje del monto que pagará cada uno de los
            progenitores
          </Text>

          {/* Particiones individuales */}
          <View style={styles.particiones}>
            <View style={styles.grupoParticionIndividual}>
              <Text style={styles.labelParticion}>Vos %: </Text>
              <InputSpinner
                max={100}
                min={0}
                step={10}
                skin="round"
                style={styles.spinner}
                value={particion1Seleccionada}
                onChange={(num: number) => handleParticionChange(num)}
                color="#cccccc"
              />
              <Text style={styles.pagarLabel}>Pagarás: </Text>
              <Text style={styles.pagarValue}>
                ${(particion1Seleccionada * (monto || 0)) / 100}
              </Text>
            </View>

            <View style={styles.grupoParticionIndividual}>
              <Text style={styles.labelParticion}>Otro progenitor %: </Text>
              <InputSpinner
                max={100}
                min={0}
                step={10}
                skin="round"
                value={particion2Seleccionada}
                onChange={(num: number) => handleParticion2Change(num)}
                color="#cccccc"
                style={styles.spinner}
              />
              <Text style={styles.pagarLabel}>Pagará: </Text>
              <Text style={styles.pagarValue}>
                ${(particion2Seleccionada * (monto || 0)) / 100}
              </Text>
            </View>
          </View>
        </View>
        <Text style={styles.error}>{errors}</Text>

        <View style={styles.buttonContainer}>
          <CancelButton texto="Cancelar" onPress={noGuardarGasto} />
          <SaveButton texto="Guardar" onPress={crearGasto} />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
    backgroundColor: Colors.gris.fondo,
  },
  particionesLabel: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 2,
    textAlign: "center",
    color: Colors.azul.azulOscuro,
  },
  particionesLabelSubtitulo: {
    fontSize: 15,
    textAlign: "center",
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  error: {
    color: "red",
    textAlign: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  uploadButton: {
    flexDirection: "row",
    verticalAlign: "middle",
    alignItems: "center",
    backgroundColor: "#3a87e7",
    padding: 10,
    borderRadius: 15,
    marginTop: 13,
    paddingHorizontal: 30,
  },
  uploadButtonText: {
    color: "white",
    marginLeft: 10,
    alignItems: "center",
  },
  uploadSuccessText: {
    color: "#586e26",
    fontSize: 15,
    fontWeight: "heavy",
    textAlign: "center",
  },
  particionesContenedor: {
    marginTop: 10,
    borderWidth: 1.5,
    borderColor: "gray",
    borderRadius: 10,
    backgroundColor: "white",
  },
  particiones: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
  },
  grupoParticionIndividual: {
    paddingTop: 10,
    flexDirection: "column",
    alignItems: "center",
    marginBottom: 5,
  },
  labelParticion: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 5,
    color: Colors.azul.azulOscuro,
  },
  spinner: {
    width: 150,
  },
  pagarLabel: {
    marginTop: 10,
  },
  pagarValue: {
    fontWeight: "bold",
    fontSize: 22,
    color: "#555",
  },
});

export default RegistrarGastoScreen;
