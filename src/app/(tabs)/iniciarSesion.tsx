import { StyleSheet } from 'react-native';
import { Text, View } from '@/src/components/Themed';

//ESTA ES LA PANTALLA DEL CALENDARIO
export default function IniciarSesionScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenida señora zoy</Text>
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
    fontSize: 30,
    fontWeight: 'bold',
    color: '#778c43'
  },
});