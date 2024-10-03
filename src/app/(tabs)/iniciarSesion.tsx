import { StyleSheet, TextInput, Button} from 'react-native';
import { Text, View } from '@/src/components/Themed';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { createIconSetFromFontello } from '@expo/vector-icons';

//ESTA ES LA PANTALLA DEL CALENDARIO


const IniciarSesion = () =>{
  const [user, SetUser]= useState('');
  const [password, SetPassword]= useState('');
  const [errors, setErrors] = useState('');
  const router=useRouter()
  
  
  const validarInput = () => {
    setErrors('');
    if (!user) {
      setErrors('te falta el user boludito');
      return false;
    }
    if (!password) {
      setErrors('te falta la contraseña retardado');
      return false;
    }

    return true;
  };

  const onLogin = () => {
    if (!validarInput()) {
      return;
    }
    router.push('/documentos');

    
  };

  

  return (
    <View style={styles.container}>
      

      <Text style={styles.label}>email</Text>
      <TextInput
        value={user}
        onChangeText={SetUser}
        placeholder="ejemplo@gmail.com"
        style={styles.input}
      />

      <Text style={styles.label}>password ($)</Text>
      <TextInput
        value={password}
        onChangeText={SetPassword}
        placeholder="*****************"
        style={styles.input}
      />
      <Text style={styles.error}>{errors}</Text>
      <Button onPress={onLogin} title="Iniciar sesión" />

    </View>
  );

}

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  image: {
    width: '50%',
    aspectRatio: 1,
    alignSelf: 'center',
  },
  textButton: {
    alignSelf: 'center',
    fontWeight: 'bold',
    color: Colors.light.tint,
    marginVertical: 10,
  },
  label: {
    color: 'gray',
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    padding: 10,
    marginTop: 5,
    marginBottom: 20,
    backgroundColor: 'white',
    borderRadius: 5,
  },
  error: {
    color: 'red',
    textAlign: 'center',
  },
});

export default IniciarSesion;