import { View, Text, StyleSheet, ScrollView } from "react-native";
import React, { useState, useEffect } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import SaveButton from "../../../../components/SaveButton";
import CancelButton from "../../../../components/CancelButton";
import { actualizarGasto, getGastoById } from "@/src/services/gastoService";
import { getCategorias } from "@/src/services/categoriasService";
import CustomTextInput from "@/src/components/TextInput";
import CustomDropdown from "@/src/components/CustomDropdown";
import Colors from "@/src/constants/Colors";
import { Gasto } from "@/src/interfaces/GastoInterface";
import ParticionesCuadrados from "@/src/components/ParticionesCuadrados";
import { getProgenitorIdFromToken } from "@/src/utils/storage";
import ProponerParticionScreen from "../particionModal";
import CustomButton from "@/src/components/CustomButton";
import LoadingIndicator from "@/src/components/LoadingIndicator";

const EditarGastoScreen = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [titulo, setTitulo] = useState<string>("");
  const [monto, setMonto] = useState<number>(1000);
  const [descripcion, setDescripcion] = useState<string>("");
  const [errors, setErrors] = useState<string>("");
  const [categorias, setCategorias] = useState<
    Array<{ id: number; nombre: string }>
  >([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] =
    useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [isFocus, setIsFocus] = useState(false);
  const [gasto, setGasto] = useState<Gasto | null>(null);
  const [usuarioLogueado, setUsuarioLogueado] = useState<number | null>(null);
  const openModal = () => setModalVisible(true);
  const [modalVisible, setModalVisible] = useState(false);

  const closeModal = async () => {
    setModalVisible(false);
    try {
      const fetchedGasto = await getGastoById(Number(id));
      setGasto(fetchedGasto);
    } catch (error) {
      console.error("Error al obtener el gasto:", error);
    }
  };

  useEffect(() => {
    const fetchGasto = async () => {
      setLoading(true);
      try {
        const fetchedGasto = await getGastoById(Number(id));
        const usuarioLogueadoId = await getProgenitorIdFromToken();
        setUsuarioLogueado(usuarioLogueadoId);
        setGasto(fetchedGasto);
        if (fetchedGasto) {
          setTitulo(fetchedGasto.titulo);
          setMonto(fetchedGasto.monto);
          setDescripcion(fetchedGasto.descripcion);
          setCategoriaSeleccionada(fetchedGasto.categoria.nombre);
        } else {
          console.error("Gasto no encontrado");
        }
      } catch (error) {
        console.error("Error al obtener el gasto:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchCategorias = async () => {
      try {
        const categorias = await getCategorias();
        setCategorias(categorias);
      } catch (error) {
        console.error("Error al obtener categorías:", error);
      }
    };

    fetchCategorias();
    fetchGasto();
  }, [id]);

  const validateInput = () => {
    const validationRules = [
      { condition: !titulo, message: "El nombre es requerido" },
      { condition: !monto, message: "El monto es requerido" },
      { condition: isNaN(monto), message: "El monto debería ser un número" },
      { condition: monto <= 0, message: "El monto debería ser positivo" },
      {
        condition: !categoriaSeleccionada,
        message: "No se seleccionó una categoría",
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

  const editarGasto = async () => {
    if (!validateInput()) {
      return;
    }
    try {
      await actualizarGasto(
        Number(id),
        titulo,
        monto,
        descripcion,
        categoriaSeleccionada
      );
      router.back();
    } catch (error) {
      console.error("Error al actualizar el gasto", error);
      setErrors("Hubo un error al actualizar el gasto. Intenta de nuevo.");
    }
  };

  const noActualizarGasto = () => {
    router.back();
  };

  if (loading) {
    return <LoadingIndicator />;
  }
  if (!gasto || !usuarioLogueado) {
    return null;
  }
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
          primaryColor={Colors.azul.azulMuyOscuro}
          icon="pencil"
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
          primaryColor={Colors.azul.azulMuyOscuro}
        />

        <CustomTextInput
          label="Descripción del gasto"
          placeholder="Escriba la descripción del gasto"
          value={descripcion}
          onChangeText={(descripcion) => {
            setDescripcion(descripcion);
          }}
          keyboardType="default"
          primaryColor={Colors.azul.azulMuyOscuro}
          icon="pencil"
        />

        <CustomTextInput
          label="Monto del gasto"
          placeholder="Escriba el monto del gasto"
          value={monto ? monto.toString() : ""}
          onChangeText={(monto) => {
            setMonto(Number(monto));
          }}
          keyboardType="numeric"
          primaryColor={Colors.azul.azulMuyOscuro}
          icon="pencil"
        />

        <ParticionesCuadrados
          usuarioCreador={gasto.usuario_creador}
          usuarioParticipe={gasto.usuario_participe}
          usuarioId={usuarioLogueado}
          monto={monto}
          particionUsuarioCreador={gasto.particion_usuario_creador}
          particionUsuarioParticipe={gasto.particion_usuario_participe}
        ></ParticionesCuadrados>

        <CustomButton
          onPress={openModal}
          title="PROPONER NUEVA PARTICIÓN"
          backgroundColor={Colors.azul.azulMuyOscuro}
          textColor="white"
        />

        <ProponerParticionScreen
          visible={modalVisible}
          onClose={closeModal}
          gasto={gasto}
          idUsuarioLogueado={usuarioLogueado}
        />

        <Text style={styles.error}>{errors}</Text>

        <View style={styles.buttonContainer}>
          <CancelButton texto="Cancelar" onPress={noActualizarGasto} />
          <SaveButton texto="Actualizar" onPress={editarGasto} />
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
    paddingVertical: 20,
  },
  error: {
    color: "red",
    textAlign: "center",
    marginBottom: 5,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",

    alignItems: "center",
  },
});

export default EditarGastoScreen;
