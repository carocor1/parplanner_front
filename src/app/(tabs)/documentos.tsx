import { StyleSheet } from 'react-native';
import { Text, View } from '@/src/components/Themed';

//ESTA ES LA RUTA DE LOS DOCUMENTOS
export default function DocumentosScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>PANTALLA DE CARO - CALENDARIOS</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
