import { useRouter } from "expo-router";
import { StyleSheet, View, Text, ScrollView } from "react-native";
import CancelButton from "@/src/components/CancelButton";
import DropdownComponent from "@/src/components/DropdownComponent";
import SaveButton from "@/src/components/SaveButton";
import InputComponent from "@/src/components/InputComponent";
import React, { useEffect, useState } from "react";
import { State, City } from "country-state-city";
import DateTimePicker from "@/src/components/DatePicker";
import {
  registroProgenitor,
  verificarHijoAsociado,
} from "../services/userService";
import { verificarSegundoProgenitorAsociado } from "../services/hijoService";
import Colors from "../constants/Colors";
import { ALERT_TYPE, Toast } from "react-native-alert-notification";
import LoadingIndicator from "../components/LoadingIndicator";

const registrarProgenitorScreen = () => {
  const [nroTelefono, setNroTelefono] = useState("");
  const [Cbu, setCbu] = useState("");
  const [provincias, setProvincias] = useState<string[]>([]);
  const [ciudades, setCiudades] = useState<string[]>([]);
  const [provinciaSeleccionada, setProvinciaSeleccionada] = useState("");
  const [ciudadSeleccionada, setCiudadSeleccionada] = useState("");
  const [fechaNacimiento, setFechaNacimiento] = useState(new Date());
  const [documento, setDocumento] = useState<number>(0);
  const [sexoSeleccionado, setSexo] = useState("");
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const sexo = ["Masculino", "Femenino", "Otro"];

  const ValidateInput = () => {
    let errors = "";
    if (!nroTelefono) {
      errors = "El celular es requerido";
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
      errors = "No se ha seleccionado la ciudad";
    }
    if (!documento) {
      errors = "No se ha ingresado el documento";
    }
    if (!sexoSeleccionado) {
      errors = "No se ha seleccionado el sexo";
    }
    if (!Cbu) {
      errors = "No se ha ingresado el CBU";
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

  const registrarProgenitor = async () => {
    if (!ValidateInput()) {
      return;
    }
    try {
      setLoading(true);
      await registroProgenitor(
        nroTelefono,
        fechaNacimiento,
        provinciaSeleccionada,
        ciudadSeleccionada,
        documento,
        sexoSeleccionado,
        Cbu
      );
      setFechaNacimiento(new Date());
      setProvinciaSeleccionada("");
      setCiudadSeleccionada("");
      setDocumento(0);
      setCbu("");
      setSexo("");
      setNroTelefono("");

      const tieneHijoAsociado = await verificarHijoAsociado();
      if (!tieneHijoAsociado) {
        setLoading(false);
        router.replace("/RegistroHijoOIngresoCodigoScreen");
      } else {
        const segundoProgenitorAsociado =
          await verificarSegundoProgenitorAsociado();
        if (segundoProgenitorAsociado) {
          setLoading(false);
          router.replace("/(tabs)/gastos/gasto");
        } else {
          setLoading(false);
          router.replace("/VinculacionHijoOIngresoCodigoScreen");
        }
      }
    } catch (error) {
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: "Error",
        textBody: "Error al registrar usuario. Por favor, inténtalo de nuevo.",
      });
    }
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
    <ScrollView keyboardShouldPersistTaps="handled">
      <View style={styles.container}>
        <View style={styles.container2}>
          <Text style={styles.titulo}>¡Finalizá tu registro!</Text>
          <Text style={styles.subtitulo}>
            Completá con tus datos personales para registrarte.
          </Text>
        </View>
        <View style={styles.container_mayor}>
          <InputComponent
            label="Número de teléfono"
            value={nroTelefono}
            setFunction={setNroTelefono}
            keyboardType="phone-pad"
          />
          <InputComponent
            label="CBU"
            value={Cbu}
            setFunction={setCbu}
            keyboardType="numeric"
          />
          <InputComponent
            label="Nro. de documento"
            value={documento ? documento.toString() : ""}
            setFunction={(text) => setDocumento(parseInt(text, 10))}
            keyboardType="numeric"
            maxLength={8}
          />
          <DateTimePicker
            currentDate={fechaNacimiento}
            onChange={setFechaNacimiento}
            label="Fecha de Nacimiento"
          />

          <Text style={styles.label}>Provincia</Text>
          <DropdownComponent
            title="Seleccionar provincia"
            labels={provincias}
            onSelect={handleProvinciaSelect}
          />
          <Text style={styles.label}>Ciudad</Text>
          <DropdownComponent
            title="Seleccionar ciudad"
            labels={ciudades}
            onSelect={setCiudadSeleccionada}
          />

          <Text style={styles.label}>Sexo</Text>
          <DropdownComponent
            title="Seleccionar sexo"
            labels={sexo}
            onSelect={setSexo}
          />

          <View style={styles.buttonContainer}>
            <CancelButton
              texto="Cancelar"
              onPress={() => router.push("/InicioSesionScreen")}
            />
            <SaveButton texto="Guardar" onPress={registrarProgenitor} />
          </View>
        </View>
      </View>
    </ScrollView>
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
    alignItems: "center",
    height: "16%",
    width: "100%",
    padding: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  label: {
    color: "black",
    fontSize: 14,
    fontWeight: "bold",
    alignSelf: "flex-start",
    marginBottom: 3,
    marginLeft: "7%",
    marginTop: 10,
  },
  titulo: {
    marginTop: 20,
    fontSize: 30,
    textAlign: "center",
    color: Colors.negro.negroNormal,
    fontWeight: "bold",
  },
  subtitulo: {
    color: Colors.negro.negroNormal,
    fontSize: 14,
    textAlign: "center",
  },
  container_mayor: {
    marginTop: 20,
    paddingBottom: 40,
    backgroundColor: "white",
    flex: 1,
  },
});

export default registrarProgenitorScreen;
