import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, TextInput, View, Button, Platform, Image, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard } from 'react-native';

import TextInputApp from '../components/TextInputApp';
import ButtonApp from '../components/ButtonApp';

import {useAuth} from '../context/AuthContext';
import Logo from '../assets/logo_en.png';


const Login = ({navigation}) => {
  
  const { login } = useAuth();
  const[user, setUser] = useState('')
  const[password, setPassword] = useState('')

  const handlerequest = () => {
    if(user!='' && password!=''){
      login(user, password)
    }
  }

    return(

      <View style={styles.container}>


      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      
        <View style={styles.view}>
            
                
        <Image source={Logo} style={styles.logo}/>


        <TextInputApp ph='Usuario' val={user} setVal={setUser}/>
        <TextInputApp ph='Constraseña' val={password} setVal={setPassword} secure={true}/>

      
        <ButtonApp title={'Iniciar sesión'} onPress={() => handlerequest()}/>

        <Text style={styles.text}>¿Aún no te has registrado?</Text>

        <ButtonApp title={'Crea una cuenta'} onPress={() => navigation.navigate('Signup')}/>



      </View>

      </TouchableWithoutFeedback>
            </KeyboardAvoidingView>

            
            </View>


    );
};
export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  view: {
    //flex: 1,
    backgroundColor: '#fff',
    //alignItems: 'center',
    //justifyContent: 'center',
  },
  text: {
    marginTop: 40,
    alignSelf: 'center',

  },
  logo: {
    marginTop: 30,
    width: '90%',
    height: '40%',
  }

 });