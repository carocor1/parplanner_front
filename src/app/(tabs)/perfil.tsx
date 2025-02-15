import { Usuario } from "@/src/interfaces/UsuarioInterface";
import { cerrarSesion } from "@/src/services/authService";
import { actualizarUsuario, obtenerUsuario } from "@/src/services/userService";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { State, City } from "country-state-city";
import BasicAvatar from "@/src/dataDisplay/avatarPicker";
import Colors from "@/src/constants/Colors";
import CustomTextInput from "@/src/components/TextInput";

const dataSexo = [
  { label: "Masculino", value: "Masculino" },
  { label: "Femenino", value: "Femenino" },
  { label: "Otro", value: "Otro" },
];

const PerfilScreen = () => {
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

  const fetchProgenitor = async () => {
    try {
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

  const renderLabel = (label: string, isFocus: boolean) => {
    if (sexo || isFocus) {
      return (
        <Text style={[styles.label, isFocus && { color: "purple" }]}>
          {label}
        </Text>
      );
    }
    return null;
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

  const actualizarDatos = async () => {
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
      }
    } catch (error) {
      console.error("Error al actualizar datos:", error);
    }
  };

  useEffect(() => {
    fetchProgenitor();
    fetchProvincias();
  }, []);

  useEffect(() => {
    if (provincia) {
      fetchCiudades(provincia);
    }
  }, [provincia]);

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
          <View style={styles.container}>
            {renderLabel("Sexo", isFocusSexo)}
            <Dropdown
              style={[
                styles.dropdown,
                isFocusSexo && { borderColor: "purple" },
              ]}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              data={dataSexo}
              maxHeight={300}
              labelField="label"
              valueField="value"
              placeholder={!isFocusSexo ? "Selecciona el sexo" : "..."}
              value={sexo}
              onFocus={() => setIsFocusSexo(true)}
              onBlur={() => setIsFocusSexo(false)}
              onChange={(item) => {
                setSexo(item.value);
                setUsuarioLogueado({ ...usuarioLogueado, sexo: item.value });
                setIsFocusSexo(false);
              }}
            />
          </View>
          <View style={styles.container}>
            {renderLabel("Provincia", isFocusProvincia)}
            <Dropdown
              style={[
                styles.dropdown,
                isFocusProvincia && { borderColor: "purple" },
              ]}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              data={provincias}
              maxHeight={300}
              labelField="label"
              valueField="value"
              placeholder={
                !isFocusProvincia ? "Selecciona la provincia" : "..."
              }
              value={provincia}
              onFocus={() => setIsFocusProvincia(true)}
              onBlur={() => setIsFocusProvincia(false)}
              onChange={(item) => {
                setProvincia(item.value);
                setUsuarioLogueado({
                  ...usuarioLogueado,
                  provincia: item.value,
                });
                setIsFocusProvincia(false);
              }}
            />
          </View>
          <View style={styles.container}>
            {renderLabel("Ciudad", isFocusCiudad)}
            <Dropdown
              style={[
                styles.dropdown,
                isFocusCiudad && { borderColor: "purple" },
              ]}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              data={ciudades}
              maxHeight={300}
              labelField="label"
              valueField="value"
              placeholder={!isFocusCiudad ? "Selecciona la ciudad" : "..."}
              value={ciudad}
              onFocus={() => setIsFocusCiudad(true)}
              onBlur={() => setIsFocusCiudad(false)}
              onChange={(item) => {
                setCiudad(item.value);
                setUsuarioLogueado({ ...usuarioLogueado, ciudad: item.value });
                setIsFocusCiudad(false);
              }}
            />

            <TouchableOpacity
              onPress={actualizarDatos}
              style={styles.buttonActualizar}
            >
              <Text style={styles.buttonTextActualizar}>ACTUALIZAR DATOS</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={logout} style={styles.buttonLogout}>
              <Text style={styles.buttonTextLogout}>CERRAR SESION</Text>
            </TouchableOpacity>
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
  outlineStyle: {
    borderWidth: 1.5,
    borderRadius: 10,
  },
  textInput: {
    marginBottom: 10,
    marginTop: 10,
  },
  container: {
    paddingVertical: 16,
    paddingHorizontal: 2,
  },
  dropdown: {
    height: 50,
    borderColor: "gray",
    borderWidth: 1.5,
    borderRadius: 10,
    paddingHorizontal: 8,
    backgroundColor: "white",
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
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  buttonLogout: {
    padding: 10,
    paddingVertical: 15,
    backgroundColor: Colors.rojo.rojoBrillante,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 25,
  },
  buttonTextLogout: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  buttonActualizar: {
    padding: 10,
    paddingVertical: 15,
    backgroundColor: "#cd8d0d",
    borderRadius: 10,
    alignItems: "center",
    marginTop: 25,
  },
  buttonTextActualizar: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default PerfilScreen;
