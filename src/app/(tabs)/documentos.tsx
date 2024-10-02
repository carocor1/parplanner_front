import DocumentoRectangulo from '@/src/components/DocumentosRectangulo';
import { Link } from 'expo-router';
import { StyleSheet, View, Pressable, Dimensions } from 'react-native';

// Obtener el ancho de la pantalla
const { width } = Dimensions.get('window');


export default function DocumentosScreen() {
  return (
    <View style={styles.screenContainer}>
      <Link href="../vacunas" asChild>
        <Pressable >
          <DocumentoRectangulo titulo="Vacunas" contenido="Consultá las dosis de las diferentes vacunas registradas" imagen='vacunas' />
        </Pressable>
      </Link>

      <Link href="../alergias" asChild>
        <Pressable>
          <DocumentoRectangulo titulo="Alergias" contenido="Consultá las diferentes alergias registradas de tu hijo" imagen='alergias' />
        </Pressable>
      </Link>

      <Link href="../historialclinico" asChild>
        <Pressable >
          <DocumentoRectangulo titulo="Historial Clínico" contenido="Consultá los diferentes ingresos a hospitales y enfermedades registradas de tu hijo" imagen='historialclinico' />
        </Pressable>
      </Link>
    
      <Link href="../documento" asChild>
        <Pressable>
          <DocumentoRectangulo titulo="Documentos" contenido="Consultá los diferentes documentos personales registrados de tu hijo" imagen= 'documentos' />
        </Pressable>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    paddingVertical: 20,
    paddingHorizontal: 10,
    backgroundColor: '#F5F5F5',
    justifyContent: 'space-evenly', // Distribuye proporcionalmente los elementos
    alignItems: 'center',
  },
});