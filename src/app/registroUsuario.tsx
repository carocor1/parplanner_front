import { StyleSheet, TextInput, Button, Pressable, TouchableOpacity} from 'react-native';
import { Text, View } from '@/src/components/Themed';
import React, { useState, useEffect } from 'react';
import { Link, useRouter } from 'expo-router';
import { Colors } from 'react-native/Libraries/NewAppScreen';

import InputComponentInicioSesion from '@/src/components/InputIniciosesion';
import SaveButton from '@/src/components/SaveButton';

//ESTA ES LA PANTALLA DEL CALENDARIO


const registrarUsuarioPantalla = () =>{
  const [user, SetUser]= useState('');
  const [password, SetPassword]= useState('');
  const [errors, setErrors] = useState('');
  const [email, setEmail]=useState('');
  const [hidePassword, setHidePassword] = useState(true);
  const router=useRouter()
  
  
  const validarInput = () => {
    setErrors('');
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!user) {
      setErrors('No se ha ingresado el usuario');
      return false;
    }
    if (!password) {
      setErrors('No se ha ingresado la contraseña');
      return false;
    }
    if (!email){
      setErrors("No se ha ingresado el email")
    }
    if (!emailRegex.test(email)) {
      setErrors('El email ingresado no es válido');
      return false;
    }

    return true;
  };
  

  const registrarse = () => {
    if (!validarInput()) {
      return;
    }
    console.log({user,password,email})
    setEmail('')
    SetUser('')
    SetPassword('')
   
    

    router.push('/iniciarSesion'); 
    

  };

  

  

  return (
    <View style={styles.container}>
      
      <Text style={styles.text}>Registrate</Text>
      
      <InputComponentInicioSesion label="Email" value={email} setFunction={setEmail} iconName="envelope" iconType="font-awesome" />
   
      <InputComponentInicioSesion label="Usuario" value={user} setFunction={SetUser} iconName="user" iconType="font-awesome" />
      <InputComponentInicioSesion label="Contraseña" value={password} setFunction={SetPassword} iconName="eye" iconType="font-awesome" secureTextEntry />
  

      <Text style={styles.error}>{errors}</Text>

      <View style={styles.buttonContainer}>
        <SaveButton texto="Crear Cuenta" onPress={registrarse}/>
      </View>

    


      
    </View>
  );

}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: "#a9bb7c", 
    flex:1, 
    justifyContent: "center", 
    alignContent:"center", 
    paddingTop: 50, 
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
    borderColor: 'transparent',
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
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#a9bb7c"
  },
  forgotPasswordText: {
    color: '#FFFFFF', // Color azul para el texto clickeable
    textAlign:"left",
    marginTop: 10,
    textDecorationLine: 'underline',
    fontWeight:"bold" // Subrayar el texto para indicar que es clickeable
  },
  text:{
    fontFamily: 'sans-serif', 
    fontSize: 36, 
    color:"white", 
    fontWeight:"bold", 
    textAlign:"center", 
    marginBottom: 90, // Añadir margen inferior
    marginTop: -30,
    
  }
});

export default registrarUsuarioPantalla;