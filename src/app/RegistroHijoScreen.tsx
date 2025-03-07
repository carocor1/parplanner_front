import { useRouter } from "expo-router";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from "react-native";
import CancelButton from "@/src/components/CancelButton";
import DropdownComponent from "@/src/components/dropdown";
import SaveButton from "@/src/components/SaveButton";
import InputComponent from "@/src/components/InputComponent";
import React, { useEffect, useState } from "react";
import { State, City } from "country-state-city";
import DateTimePicker from "@/src/components/DatePicker";
import BasicAvatar from "@/src/dataDisplay/avatarPicker";
import {
  registrarHijo,
  verificarSegundoProgenitorAsociado,
} from "../services/hijoService";
import Colors from "../constants/Colors";
import { ALERT_TYPE, Toast } from "react-native-alert-notification";
import LoadingIndicator from "../components/LoadingIndicator";

const registrarHijoScreen = () => {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [provincias, setProvincias] = useState<string[]>([]);
  const [ciudades, setCiudades] = useState<string[]>([]);
  const [provinciaSeleccionada, setProvinciaSeleccionada] = useState("");
  const [ciudadSeleccionada, setCiudadSeleccionada] = useState("");
  const [fechaNacimiento, setFechaNacimiento] = useState(new Date());
  const [documento, setDocumento] = useState<number>(0);
  const [sexoSeleccionado, setSexo] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const router = useRouter();
  const [resetAvatar, setResetAvatar] = useState(false);
  const [loading, setLoading] = useState(false);

  const sexo = ["Masculino", "Femenino", "Otro"];

  const handleImageSelected = (uri: string) => {
    setImage(uri);
  };

  const ValidateInput = () => {
    let errors = "";
    if (!nombre) {
      errors = "El nombre es requerido";
    }
    if (!apellido) {
      errors = "El apellido es requerido";
    }
    if (!fechaNacimiento) {
      errors = "No se ha seleccionado la fecha de Nacimiento";
    }
    if (fechaNacimiento > new Date()) {
      errors = "La fecha de nacimiento no puede ser mayor a la actual";
    }
    if (!provinciaSeleccionada) {
      errors = "No se ha seleccionado la provincia ";
    }
    if (!ciudadSeleccionada) {
      errors = "No se ha seleccionado la ciudad ";
    }
    if (!documento) {
      errors = "No se ha ingresado el documento";
    }
    if (!sexoSeleccionado) {
      errors = "No se ha seleccionado el sexo";
    }
    if (errors) {
      Toast.show({
        type: ALERT_TYPE.WARNING,
        title: "Error",
        textBody: errors,
      });
      return false;
    }

    return true;
  };

  const registroHijo = async () => {
    if (!ValidateInput()) {
      return;
    }
    try {
      setLoading(true);
      await registrarHijo(
        nombre,
        apellido,
        fechaNacimiento,
        provinciaSeleccionada,
        ciudadSeleccionada,
        documento,
        sexoSeleccionado
      );
      console.log(image);
      setNombre("");
      setApellido("");
      setFechaNacimiento(new Date());
      setProvinciaSeleccionada("");
      setCiudadSeleccionada("");
      setDocumento(0);
      setSexo("");
      setImage(null);
      setResetAvatar(true);
      setTimeout(() => setResetAvatar(false), 500);

      const tieneSegundoProgenitorAsociado =
        await verificarSegundoProgenitorAsociado();
      if (tieneSegundoProgenitorAsociado) {
        setLoading(false);
        router.replace("/(tabs)/gastos/gasto");
      } else {
        setLoading(false);
        router.replace("/VinculacionHijoOIngresoCodigoScreen");
      }
    } catch (error) {
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: "Error",
        textBody: "Error al registrar el hijo. Por favor, inténtalo de nuevo.",
      });
    }
  };

  const noGuardarRegistro = () => {
    router.back();
  };

  useEffect(() => {
    const provinciasArg = State.getStatesOfCountry("AR").map(
      (state) => state.name
    );
    setProvincias(provinciasArg);
  }, []);

  const handleProvinciaSelect = (provincia: string) => {
    setProvinciaSeleccionada(provincia);
    const selectedState = State.getStatesOfCountry("AR").find(
      (state) => state.name === provincia
    );
    if (selectedState) {
      const ciudadesFiltradas = City.getCitiesOfState(
        "AR",
        selectedState.isoCode
      ).map((city) => city.name);
      setCiudades(ciudadesFiltradas);
    }
  };

  if (loading) {
    return <LoadingIndicator></LoadingIndicator>;
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
    >
      <ScrollView keyboardShouldPersistTaps="handled">
        <View style={styles.container}>
          <View style={styles.container2}>
            <Text style={styles.titulo}>¡Registrá a tu hijo!</Text>
            <Text style={styles.subtitulo}>
              Completá con los datos personales de tu hijo para registrarlo.
            </Text>
          </View>

          <View style={styles.avatarContainer}>
            <BasicAvatar
              onImageSelected={handleImageSelected}
              reset={resetAvatar}
            />
            <View style={styles.container_mayor}>
              <InputComponent
                label="Nombre"
                value={nombre}
                setFunction={setNombre}
              />
              <InputComponent
                label="Apellido"
                value={apellido}
                setFunction={setApellido}
              />
              <DateTimePicker
                currentDate={fechaNacimiento}
                onChange={setFechaNacimiento}
                label="Fecha de Nacimiento"
              />

              <View style={styles.row}>
                <View style={styles.dropdownContainer}>
                  <Text style={styles.label}>Provincia</Text>
                  <DropdownComponent
                    title="Seleccionar provincia"
                    labels={provincias}
                    onSelect={handleProvinciaSelect}
                  />
                </View>
                <View style={styles.dropdownContainer}>
                  <Text style={styles.label}>Ciudad</Text>
                  <DropdownComponent
                    title="Seleccionar ciudad"
                    labels={ciudades}
                    onSelect={setCiudadSeleccionada}
                  />
                </View>
              </View>

              <View style={styles.row}>
                <View style={styles.dropdownContainer}>
                  <Text style={styles.label}>Documento</Text>
                  <TextInput
                    value={documento ? documento.toString() : ""}
                    onChangeText={(text) => setDocumento(parseInt(text, 10))}
                    placeholder="12.456.789"
                    style={styles.smallInput}
                    keyboardType="numeric"
                    maxLength={8}
                  />
                </View>
                <View style={styles.dropdownContainer}>
                  <Text style={styles.label}>Sexo</Text>
                  <DropdownComponent
                    title="Seleccionar sexo"
                    labels={sexo}
                    onSelect={setSexo}
                  />
                </View>
              </View>

              <View style={styles.buttonContainer}>
                <CancelButton texto="Cancelar" onPress={noGuardarRegistro} />
                <SaveButton texto="Guardar" onPress={registroHijo} />
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    justifyContent: "center",
    alignContent: "center",
  },
  container2: {
    backgroundColor: Colors.verde.verdeIntermedio,
    borderBottomLeftRadius: 60,
    borderBottomRightRadius: 60,
    overflow: "hidden",
    alignItems: "center",
    height: "0%",
    width: "100%",
    marginBottom: 30,
    flex: 1,
    paddingBottom: 60,
    paddingTop: 30,
  },
  avatarContainer: {
    alignItems: "center",
    marginTop: -80,
    zIndex: 1,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  dropdownContainer: {
    flex: 1,
    marginHorizontal: "0.01%",
    width: "90%",
  },
  smallInput: {
    width: "70%",
    borderWidth: 1,
    borderColor: "gray",
    padding: 10,
    backgroundColor: "white",
    borderRadius: 15,
    marginLeft: "20%",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  label: {
    color: "#000",
    fontSize: 14,
    fontWeight: "bold",
    alignSelf: "flex-start",
    marginBottom: 5,
    marginLeft: "10%",
    marginRight: 10,
  },
  image: {
    width: "50%",
    aspectRatio: 1,
    alignSelf: "center",
    borderRadius: 25,
    overflow: "hidden",
  },
  titulo: {
    marginTop: 10,
    fontSize: 30,
    textAlign: "center",
    color: Colors.negro.negroNormal,
    fontWeight: "bold",
  },
  subtitulo: {
    color: Colors.negro.negroNormal,
    textAlign: "center",
  },
  container_mayor: {
    marginTop: 7,
    flex: 1,
    paddingBottom: 40,
  },
});

export default registrarHijoScreen;
