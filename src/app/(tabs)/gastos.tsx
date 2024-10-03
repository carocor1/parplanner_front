import { Button, StyleSheet } from 'react-native';
import { Text, View } from '@/src/components/Themed';
import { router } from 'expo-router';

//ESTA ES LA PANTALLA DEL CALENDARIO
export default function GastosScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>GASTOS</Text>
      <Button
        title="Registrar gasto"
        onPress={() => router.push('../registrargasto')}
      />
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