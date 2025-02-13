import { Usuario } from "@/src/interfaces/UsuarioInterface";
import { cerrarSesion } from "@/src/services/authService";
import { obtenerUsuario } from "@/src/services/userService";
import React, { useEffect } from "react";
import { View, Text, Button } from "react-native";

const PerfilScreen = () => {
  const [usuarioLogueado, setUsuarioLogueado] = React.useState<Usuario | null>(
    null
  );

  const fetchProgenitor = async () => {
    try {
      const usuario = await obtenerUsuario();
      setUsuarioLogueado(usuario);
    } catch (error) {
      console.error("Error al obtener el usuario:", error);
    }
  };

  const logout = async () => {
    try {
      await cerrarSesion();
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  useEffect(() => {
    fetchProgenitor();
  }, []);

  if (usuarioLogueado) {
    return (
      <View>
        <Text>Este es el perfil de {usuarioLogueado.nombre}</Text>
        <Text>{usuarioLogueado.email}</Text>
        <Button
          title="CERRAR SESION (te lleva a inicio Sesion)"
          onPress={logout}
        ></Button>
      </View>
    );
  }
};
export default PerfilScreen;
