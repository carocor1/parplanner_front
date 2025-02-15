import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import SaveButton from "../../../components/SaveButton";
import CancelButton from "../../../components/CancelButton";
import InputSpinner from "react-native-input-spinner";
import * as ImagePicker from "expo-image-picker";
import { MaterialIcons } from "@expo/vector-icons";
import { getCategorias } from "@/src/services/categoriasService";
import { registrarGasto } from "@/src/services/gastoService";
import CustomTextInput from "@/src/components/TextInput";
import Colors from "@/src/constants/Colors";
import { Dropdown } from "react-native-element-dropdown";

const RegistrarGastoScreen = () => {
  const [titulo, setTitulo] = useState<string>("");
  const [monto, setMonto] = useState<number>();
  const [descripcion, setDescripcion] = useState<string>("");
  const [particion1Seleccionada, setParticion1Seleccionada] =
    useState<number>(50);
  const [particion2Seleccionada, setParticion2Seleccionada] =
    useState<number>(50);
  const [errors, setErrors] = useState<string>("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
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

  const renderLabel = () => {
    if (categoriaSeleccionada || isFocus) {
      return (
        <Text style={[styles.label, isFocus && { color: "#5f80ad" }]}>
          Categoria del gasto
        </Text>
      );
    }
    return null;
  };

  const validateInput = () => {
    setErrors("");
    if (!titulo) {
      setErrors("El titulo es requerido");
      return false;
    }
    if (!monto) {
      setErrors("El monto es requerido");
      return false;
    }
    if (isNaN(monto)) {
      setErrors("El monto debería ser un número");
      return false;
    }
    if (!categoriaSeleccionada) {
      setErrors("No se seleccionó una categoría");
      return false;
    }
    if (!particion1Seleccionada) {
      setErrors("No se indicó la partición");
      return false;
    }
    if (!particion2Seleccionada) {
      setErrors("No se indicó la partición");
      return false;
    }
    if (!selectedImage) {
      setErrors("Se requiere adjuntar un comprobante de compra");
      return false;
    }
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
        setSelectedImage(null);
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

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Se requiere permiso para acceder a la galería");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
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

        <View style={{ paddingBottom: 15 }}>
          {renderLabel()}
          <Dropdown
            style={[styles.dropdown, isFocus && { borderColor: "#5f80ad" }]}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            data={categorias.map((categoria) => ({
              label: categoria.nombre,
              value: categoria.nombre,
            }))}
            maxHeight={300}
            labelField="label"
            onFocus={() => setIsFocus(true)}
            onBlur={() => setIsFocus(false)}
            valueField="value"
            placeholder="Categoría del gasto"
            value={categoriaSeleccionada}
            onChange={(item) => setCategoriaSeleccionada(item.value)}
          />
        </View>

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
          icon=""
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

        <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
          <MaterialIcons name="attach-file" size={24} color="white" />
          <Text style={styles.uploadButtonText}>
            Adjuntar comprobante de Compra
          </Text>
        </TouchableOpacity>

        {selectedImage && (
          <Text style={styles.uploadSuccessText}>
            Comprobante adjuntado con éxito!
          </Text>
        )}

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
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
  particionesLabel: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 2,
    textAlign: "center",
  },
  particionesLabelSubtitulo: {
    fontSize: 15,
    textAlign: "center",
    marginBottom: 10,
    paddingHorizontal: 10,
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
  spinner: {
    width: 150,
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
  pagarLabel: {
    marginTop: 10,
  },
  pagarValue: {
    fontWeight: "bold",
    fontSize: 22,
    color: "#555",
  },
  dropdown: {
    height: 50,
    borderColor: "gray",
    borderWidth: 1.5,
    borderRadius: 10,
    paddingHorizontal: 8,
    backgroundColor: "white",
    marginTop: 20,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  label: {
    position: "absolute",
    backgroundColor: "#f5f5f5",
    left: 10,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 12,
  },
  particionesContenedor: {
    marginTop: 10,
    borderWidth: 1.5,
    borderColor: "gray",
    borderRadius: 10,
    backgroundColor: "white",
  },
});

export default RegistrarGastoScreen;
