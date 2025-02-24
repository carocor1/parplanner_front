import { Usuario } from "@/src/interfaces/UsuarioInterface";
import { cerrarSesion } from "@/src/services/authService";
import { actualizarUsuario, obtenerUsuario } from "@/src/services/userService";
import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import BasicAvatar from "@/src/dataDisplay/avatarPicker";
import Colors from "@/src/constants/Colors";
import CustomTextInput from "@/src/components/TextInput";
import CustomButton from "@/src/components/CustomButton";
import CustomDropdown from "@/src/components/CustomDropdown";
import LoadingIndicator from "@/src/components/LoadingIndicator";
import { City, State } from "country-state-city";
import { Ionicons } from "@expo/vector-icons";

const dataSexo = [
  { label: "Masculino", value: "Masculino" },
  { label: "Femenino", value: "Femenino" },
  { label: "Otro", value: "Otro" },
];

const PerfilScreen = () => {
  const router = useRouter();
  const [usuarioLogueado, setUsuarioLogueado] = useState<Usuario | null>(null);
  const [sexo, setSexo] = useState<string | null>(null);
  const [provincia, setProvincia] = useState<string | null>(null);
  const [ciudad, setCiudad] = useState<string | null>(null);
  const [nombre, setNombre] = useState<string>("");
  const [apellido, setApellido] = useState<string>("");
  const [nro_telefono, setNroTelefono] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [documento, setDocumento] = useState<number>();
  const [cbu, setCbu] = useState<string>("");
  const [isFocusSexo, setIsFocusSexo] = useState(false);
  const [isFocusProvincia, setIsFocusProvincia] = useState(false);
  const [isFocusCiudad, setIsFocusCiudad] = useState(false);
  const [provincias, setProvincias] = useState<any[]>([]);
  const [ciudades, setCiudades] = useState<any[]>([]);
  const [image, setImage] = useState<string | null>(null);
  const [resetAvatar, setResetAvatar] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [errors, setErrors] = useState<string>("");

  const fetchProgenitor = async () => {
    try {
      setLoading(true);
      const usuario = await obtenerUsuario();
      setUsuarioLogueado(usuario);
      setNombre(usuario.nombre);
      setApellido(usuario.apellido);
      setEmail(usuario.email);
      setDocumento(usuario.documento);
      setCbu(usuario.cbu);
      setSexo(usuario.sexo);
      setProvincia(usuario.provincia);
      setCiudad(usuario.ciudad);
      setNroTelefono(usuario.nro_telefono);
    } catch (error) {
      console.error("Error al obtener el usuario:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProvincias = () => {
    const provinciasArg = State.getStatesOfCountry("AR").map((state) => ({
      label: state.name,
      value: state.name,
    }));
    setProvincias(provinciasArg);
  };

  const fetchCiudades = (provincia: string) => {
    const selectedState = State.getStatesOfCountry("AR").find(
      (state) => state.name === provincia
    );
    if (selectedState) {
      const ciudadesFiltradas = City.getCitiesOfState(
        "AR",
        selectedState.isoCode
      ).map((city) => ({
        label: city.name,
        value: city.name,
      }));
      setCiudades(ciudadesFiltradas);
    }
  };

  const logout = async () => {
    try {
      await cerrarSesion();
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  const handleImageSelected = (uri: string) => {
    setImage(uri);
  };

  const validateInput = () => {
    const validationRules = [
      { condition: !nombre, message: "El nombre es requerido" },
      { condition: !apellido, message: "El apellido es requerido" },
      { condition: !email, message: "El email es requerido" },
      { condition: !documento, message: "El documento es requerido" },
      { condition: !cbu, message: "El CBU es requerido" },
      {
        condition: !nro_telefono,
        message: "El número de teléfono es requerido",
      },
      { condition: !sexo, message: "El sexo es requerido" },
      { condition: !provincia, message: "La provincia es requerida" },
      { condition: !ciudad, message: "La ciudad es requerida" },
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

  const actualizarDatos = async () => {
    if (!validateInput()) {
      return;
    }
    try {
      if (provincia && ciudad && documento && sexo && cbu) {
        await actualizarUsuario(
          nombre,
          apellido,
          email,
          nro_telefono,
          provincia,
          ciudad,
          documento,
          sexo,
          cbu
        );
        await fetchProgenitor();
      }
    } catch (error) {
      console.error("Error al actualizar datos:", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchProgenitor();
    }, [])
  );

  useEffect(() => {
    fetchProvincias();
  }, []);

  useEffect(() => {
    if (provincia) {
      fetchCiudades(provincia);
    }
  }, [provincia]);

  if (loading) {
    return <LoadingIndicator />;
  }

  if (usuarioLogueado) {
    return (
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container_principal}>
          <BasicAvatar
            onImageSelected={handleImageSelected}
            reset={resetAvatar}
          />
          <Text style={styles.title}>
            {usuarioLogueado.nombre} {usuarioLogueado.apellido}
          </Text>

          <CustomTextInput
            label="Nombre"
            placeholder="Escribe tu nombre"
            value={nombre}
            onChangeText={(nombre) => {
              setNombre(nombre);
              setUsuarioLogueado({ ...usuarioLogueado, nombre });
            }}
            primaryColor="purple"
            icon="pencil"
          />
          <CustomTextInput
            label="Apellido"
            placeholder="Escribe tu apellido"
            value={apellido}
            onChangeText={(apellido) => {
              setApellido(apellido);
              setUsuarioLogueado({ ...usuarioLogueado, apellido });
            }}
            primaryColor="purple"
            icon="pencil"
          />
          <CustomTextInput
            label="Email"
            placeholder="Escribe tu email"
            value={email}
            onChangeText={(email) => {
              setEmail(email);
              setUsuarioLogueado({ ...usuarioLogueado, email });
            }}
            keyboardType="email-address"
            primaryColor="purple"
            icon="pencil"
          />
          <CustomTextInput
            label="Documento"
            placeholder="Escribe tu documento"
            value={documento ? documento.toString() : ""}
            onChangeText={(documento) => {
              const docNumber = parseInt(documento, 10);
              setDocumento(docNumber);
              setUsuarioLogueado({ ...usuarioLogueado, documento: docNumber });
            }}
            keyboardType="numeric"
            primaryColor="purple"
            icon="pencil"
          />
          <CustomTextInput
            label="Cbu"
            placeholder="Escribe tu cbu"
            value={cbu}
            onChangeText={(cbu) => {
              setCbu(cbu);
              setUsuarioLogueado({ ...usuarioLogueado, cbu });
            }}
            keyboardType="numeric"
            primaryColor="purple"
            icon="pencil"
          />
          <CustomTextInput
            label="Nro. de teléfono"
            placeholder="Escribe tu número de teléfono"
            value={nro_telefono}
            onChangeText={(nro_telefono) => {
              setNroTelefono(nro_telefono);
              setUsuarioLogueado({ ...usuarioLogueado, nro_telefono });
            }}
            keyboardType="phone-pad"
            primaryColor="purple"
            icon="pencil"
          />
          <CustomDropdown
            label="Sexo"
            data={dataSexo}
            value={sexo || ""}
            onChange={setSexo}
            isFocus={isFocusSexo}
            setIsFocus={setIsFocusSexo}
            primaryColor="purple"
          />
          <CustomDropdown
            label="Provincia"
            data={provincias}
            value={provincia || ""}
            onChange={setProvincia}
            isFocus={isFocusProvincia}
            setIsFocus={setIsFocusProvincia}
            primaryColor="purple"
          />
          <CustomDropdown
            label="Ciudad"
            data={ciudades}
            value={ciudad || ""}
            onChange={setCiudad}
            isFocus={isFocusCiudad}
            setIsFocus={setIsFocusCiudad}
            primaryColor="purple"
          />
          <TouchableOpacity
            style={styles.irAHijo}
            onPress={() => router.push("/(tabs)/perfil/hijo/perfil_hijo")}
          >
            <Text>IR A HIJO</Text>
            <Ionicons name="chevron-forward" size={20} color="black" />
          </TouchableOpacity>
          <View style={{ marginTop: -30 }}>
            <Text style={styles.error}>{errors}</Text>

            <CustomButton
              onPress={actualizarDatos}
              title="ACTUALIZAR DATOS"
              backgroundColor={Colors.amarillo.amarilloNormal}
              textColor="white"
            />

            <CustomButton
              onPress={logout}
              title="CERRAR SESION"
              backgroundColor={Colors.rojo.rojoBrillante}
              textColor="white"
            />
          </View>
        </View>
      </ScrollView>
    );
  }
  return null;
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container_principal: {
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  error: {
    color: "red",
    textAlign: "center",
    marginBottom: 5,
  },
  irAHijo: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "white",
    padding: 15,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: "gray",
  },
});

export default PerfilScreen;
