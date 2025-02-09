import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, TextInput, View, Platform, TouchableOpacity, Modal, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard } from 'react-native';

import TextInputApp from '../../components/TextInputApp';
import TextInputAppSecondary from '../../components/TextInputAppSecondary';
import ButtonApp from '../../components/ButtonApp';
import ButtonAppSecondary from '../../components/ButtonAppSecondary';

import {useAuth} from '../../context/AuthContext';

import rodeoserver from '../../serverconn_conf/ServerAddress'
const ip = rodeoserver.IP
const port = rodeoserver.PORT


const SignupAdmin = ({navigation}) => {

  const { signup, jwtToken } = useAuth();

  const[alias, setAlias] = useState('')
  const[name, setName] = useState('')
  const[surname, setSurname] = useState('')
  const[email, setEmail] = useState('')
  const[password, setPassword] = useState('')
  const[passwordcheck, setPasswordCheck] = useState('')
  const[modalVisible, setModalVisible] = useState(false);
  const[modalVisibleCorrect, setModalVisibleCorrect] = useState(false);
  

  const[textStyleAlias, setTextStyleAlias] = useState(styles.inputtext);
  const[textStyleName, setTextStyleName] = useState(styles.inputtext);
  const[textStyleSurname, setTextStyleSurname] = useState(styles.inputtext);
  const[textStyleEmail, setTextStyleEmail] = useState(styles.inputtext);
  const[textStylePassword, setTextStylePassword] = useState(styles.inputtext);


  const signupAdmin = async (alias, name, surname, email, password) => {


    try {

        const response = await fetch('https://'+ip+'/signupAdmin', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${jwtToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                alias:alias,
                name: name,
                surname: surname,
                email: email,
                password: password,
            }),
        });

        const data = await response.json();

        if(data['message'] == 'OK') {


            console.log('Signup successful.')
            return true; //If ok

        } else {
            console.error('Signup failed.');
            return false; //If not ok
        }
    } catch (error) {
        console.error('Error during signup:', error);
    }
};


  const handlerequest = async (alias, name, surname, email, password, passwordcheck) => {
    
    //Alias no existe en base de datos
    if(alias!=''){
      setTextStyleAlias(styles.inputtext)

      if(name!=''){
        setTextStyleName(styles.inputtext)

        if(surname!=''){
          setTextStyleSurname(styles.inputtext)

          //Formato de correo valido y no existe en base de datos
          if(email!=''){
            setTextStyleEmail(styles.inputtext)

            //Campos de contraseña coinciden
            if (password!='' && passwordcheck!= '' && password==passwordcheck){
              setTextStylePassword(styles.inputtext)

              //Trim elimina los espacios en blancos al principio y al final
              //Llamada a la funcion de registro y comprobacion
              if(await signupAdmin(alias.trim(), name.trim(), surname.trim(), email.trim(), password.trim())){           
                setModalVisibleCorrect(true)
              }
              else{
                setModalVisible(true)
              }
              
                
            }else{
          setTextStylePassword(styles.inputtextError)
            }
            }else{
              setTextStyleEmail(styles.inputtextError)
            }
          }else{
            setTextStyleSurname(styles.inputtextError)
          }
        }else{
          setTextStyleName(styles.inputtextError)
        }
      }else{
      setTextStyleAlias(styles.inputtextError)
    }

  }


    return(
      <View style={styles.container}>

      <Modal animationType="slide" transparent={true} visible={modalVisible}>
          <View style={styles.modalview}>
            <Text>Error al crear la cuenta </Text>
            <ButtonApp title={'Aceptar'} onPress={() => setModalVisible(false)}/>
          </View>
        </Modal>

        
        <Modal animationType="slide" transparent={true} visible={modalVisibleCorrect}>
          <View style={styles.modalview}>
            <Text>Cuenta creada correctamente</Text>
            <ButtonApp title={'Aceptar'} onPress={() => navigation.goBack()}/>
          </View>
        </Modal>


        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
           <TouchableWithoutFeedback onPress={Keyboard.dismiss}>

             <View style={styles.view}>

        <TextInputAppSecondary ph='Alias' val={alias} setVal={setAlias} style={textStyleAlias}/>
        <TextInputAppSecondary ph='Nombre' val={name} setVal={setName} style={textStyleName}/>
        <TextInputAppSecondary ph='Apellidos' val={surname} setVal={setSurname} style={textStyleSurname}/>
        <TextInputAppSecondary ph='Correo electrónico' val={email} setVal={setEmail} inputmod='email' style={textStyleEmail}/>
        <TextInputAppSecondary ph='Contraseña' val={password} setVal={setPassword} secure={true} style={textStylePassword}/>
        <TextInputAppSecondary ph='Confirmar contraseña' val={passwordcheck} setVal={setPasswordCheck} secure={true} style={textStylePassword}/>

        <ButtonAppSecondary title={'Crear cuenta'} button_style={styles.button} text_style={styles.text} 
        onPress={() => handlerequest(alias, name, surname, email, password, passwordcheck)}/>

        <ButtonAppSecondary title={'Descartar y Volver'} button_style={styles.button2} text_style={styles.text} onPress={() => navigation.goBack()}/>

      </View>

      </TouchableWithoutFeedback>
            </KeyboardAvoidingView>


        </View>
    );
};
export default SignupAdmin;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',

  },

  view: {
    //flex: 1,
    backgroundColor: '#fff',
    //alignItems: 'center',
    justifyContent: 'center',
  },

  modalview: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },

  button: {
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    backgroundColor: '#5ba4fc',
    height: 50,
    width: '80%',
    borderRadius: 10,
    marginTop:40,
  },

  button2: {
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    backgroundColor: '#5ba4fc',
    height: 50,
    width: '80%',
    borderRadius: 10,
    marginTop:20,
    marginBottom:20,

  },

  text: {
    color: 'white'
  },

  inputtext: {
    height: 50,
    width: '80%',
    borderColor: 'grey',
    borderWidth: 1,
    borderRadius: 10,
    marginTop:20,
    paddingLeft: '4%',
    alignSelf: 'center',

  },

  inputtextError: {
    height: 50,
    width: '80%',
    borderColor: 'red',
    borderWidth: 1,
    borderRadius: 10,
    marginTop:20,
    paddingLeft: '4%',
    alignSelf: 'center',

  },

 });