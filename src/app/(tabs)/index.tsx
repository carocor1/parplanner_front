import { StyleSheet } from 'react-native';
import { Text, View } from '@/src/components/Themed';

//ESTA ES LA PANTALLA DEL CALENDARIO
export default function CalendarioScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>PANTALLa DEL CALENDARIO</Text>
 
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