import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, TextInput, View, Image, Platform, Modal, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, SafeAreaView } from 'react-native';

import TextInputApp from '../components/TextInputApp';
import TextInputAppSecondary from '../components/TextInputAppSecondary';
import ButtonApp from '../components/ButtonApp';
import ButtonAppSecondary from '../components/ButtonAppSecondary';
import Logo from '../assets/logo_h.png';


import {useAuth} from '../context/AuthContext';


const ADDRESS = require('../serverconn_conf/ServerAddress')
const ip = ADDRESS.IP
const port = ADDRESS.PORT



const Profile = ({navigation}) => {

    const { logout, getUsername, jwtToken } = useAuth();
    

    const[modalVisible, setModalVisible] = useState(false);
    const[modalPassVisible, setModalPassVisible] = useState(false);
    const[modalDataVisible, setModalDataVisible] = useState(false);
    const[textStylePassword, setTextStylePassword] = useState(styles.inputtext);


    const[usermessage, setUserMessage] = useState('');
    const[username, setUserName] = useState('');
    const[name, setName] = useState('');
    const[surname, setSurname] = useState('');
    const[alias, setAlias] = useState('');
    const[email, setEmail] = useState('');
    const[password, setPassword] = useState('')
    const[passwordcheck, setPasswordCheck] = useState('')

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);



    const disconnect = () => {
        setUserMessage('Está a punto de cerrar sesión. ¿Desea continuar?')
        setModalVisible(true)
    }

    const handlerequest = () => {
      logout()
      setModalVisible(false)

    }


    const fetchData = async () => {

      const response = await fetch('https://'+ip+'/getUserInfo', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${jwtToken}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            alias: getUsername(),
        }),
    });
  
      const data = await response.json();
      setData(data);
      setLoading(false);

      setAlias(data[0])
      setName(data[2])
      setSurname(data[3])
      setUserName(data[2]+' '+data[3])
      setEmail(data[4])
  
    }
  
    useEffect(() => {
      fetchData();
    }, []);


    const changePassword = async () => {
      
      //Campos de contraseña coinciden
      if (password!='' && passwordcheck!= '' && password==passwordcheck){
        setTextStylePassword(styles.inputtext)

        await fetch('https://'+ip+'/changePassword', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${jwtToken}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            alias: alias,
            password: password,
        }),
       });

       fetchData();
       setModalPassVisible(false)

      }else{
        setTextStylePassword(styles.inputtextError)
        }

      }

      const changeUserData = async () => {
      
        //Campos de contraseña coinciden
        if (name!='' && surname!= '' && email!= ''){
          setTextStylePassword(styles.inputtext)
  
          await fetch('https://'+ip+'/changeUserData', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${jwtToken}`,
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({
              alias: alias,
              name: name,
              surname: surname,
              email: email,
          }),
         });


         fetchData();
         setModalDataVisible(false)
  
        }
  
        }

      



    return(
      <SafeAreaView style={styles.container}>

        <Modal animationType="slide" transparent={true} visible={modalVisible}>

        <SafeAreaView style={styles.container}>

            <View style={styles.modalview}>
              <Text>{usermessage}</Text>
              <ButtonApp title={'Cerrar sesión'} onPress={() => handlerequest()}/>
              <ButtonApp title={'Volver'} onPress={() => setModalVisible(false)}/>
            </View>

            </SafeAreaView>

        </Modal>



        <Modal animationType="slide" transparent={true} visible={modalPassVisible}>

        <SafeAreaView style={styles.container}>


        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>

                  <View style={styles.modalview}>

                    <TextInputAppSecondary ph='Contraseña' val={password} setVal={setPassword} secure={true} style={textStylePassword}/>
                    <TextInputAppSecondary ph='Confirmar contraseña' val={passwordcheck} setVal={setPasswordCheck} secure={true} style={textStylePassword}/>
                    <ButtonAppSecondary title={'Confirmar cambios'} button_style={styles.button} text_style={styles.text} onPress={() => changePassword()}/>
                    <ButtonApp title={'Volver'} onPress={() => setModalPassVisible(false)}/>

                  </View>

                  </TouchableWithoutFeedback>
            </KeyboardAvoidingView>

            </SafeAreaView>

    
        </Modal>


        <Modal animationType="slide" transparent={true} visible={modalDataVisible}>

        <SafeAreaView style={styles.container}>

        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>

                  <View style={styles.modalview}>

                    <TextInputAppSecondary ph='Nombre' val={name} setVal={setName} style={styles.inputtext}/>
                    <TextInputAppSecondary ph='Apellidos' val={surname} setVal={setSurname} style={styles.inputtext}/>
                    <TextInputAppSecondary ph='Correo electrónico' val={email} setVal={setEmail} inputmod='email' style={styles.inputtext}/>

                    <ButtonAppSecondary title={'Confirmar cambios'} button_style={styles.button} text_style={styles.text} onPress={() => changeUserData()}/>
                    <ButtonApp title={'Volver'} onPress={() => setModalDataVisible(false)}/>

                  </View>

                  </TouchableWithoutFeedback>
            </KeyboardAvoidingView>

            </SafeAreaView>

    
        </Modal>




        {loading && jwtToken && <Text style={styles.loading}>Cargando...</Text>}

        {data &&

          <View style={styles.view}>

          <Image source={Logo} style={styles.logo}/>
            
          <Text style={styles.username}>{username} </Text>
          <Text>·</Text>
          <Text style={styles.alias}>@{alias}</Text>


          <ButtonAppSecondary title={'Datos de usuario'} button_style={styles.button} text_style={styles.text} onPress={() => setModalDataVisible(true)}/>
          <ButtonAppSecondary title={'Contraseña'} button_style={styles.button} text_style={styles.text} onPress={() => setModalPassVisible(true)}/>

          <ButtonAppSecondary title={'Cerrar sesión'} button_style={styles.button} text_style={styles.text} onPress={() => disconnect()}/>

          </View>

        }


        </SafeAreaView>
    );
};
export default Profile;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',

  },

  view: {
    //flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },

  logo: {
    width: '90%',
    height: '40%',
  },

  loading: {
    //flexGrown: 1,
    alignSelf: 'center',
    justifyContent:'center',      
    backgroundColor: '#fff',

  },

  modalview: {
    flexGrown: 1,
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
    marginTop:20,
  },

  text: {
    color: 'white'
  },

  username: {
    fontSize: 25,
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight:'bold',
    paddingLeft: '4%',
    paddingRight: '4%',
  },

  alias: {
    fontSize: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: '4%',
    paddingRight: '4%',
  },

  email: {
    fontSize: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: '4%',
    paddingRight: '4%',
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

  }

 });