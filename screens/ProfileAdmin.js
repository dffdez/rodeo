import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, FlatList, View, Image, TouchableOpacity, Modal, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, SafeAreaView, Platform } from 'react-native';

import TextInputApp from '../components/TextInputApp';
import TextInputAppSecondary from '../components/TextInputAppSecondary';
import ButtonApp from '../components/ButtonApp';
import ButtonAppSecondary from '../components/ButtonAppSecondary';
import Logo from '../assets/logo_h.png';


import {useAuth} from '../context/AuthContext';



import rodeoserver from '../serverconn_conf/ServerAddress'
const ip = rodeoserver.IP
const port = rodeoserver.PORT



const ProfileAdmin = ({navigation}) => {

    const { logout, getUsername } = useAuth();

    const[modalVisible, setModalVisible] = useState(false);
 
    const[usermessage, setUserMessage] = useState('');
    const[username, setUserName] = useState('');
    const[name, setName] = useState('');
    const[surname, setSurname] = useState('');
    const[alias, setAlias] = useState('');
    const[email, setEmail] = useState('');
    const[password, setPassword] = useState('')
    const[passwordcheck, setPasswordCheck] = useState('')

    const [data, setData] = useState([]);
    const [dataUser, setDataUser] = useState([]);

    const [loading, setLoading] = useState(true);




    const fetchData = async () => {

      const response = await fetch('http://'+ip+':'+port+'/getAllUser')
  
      const data = await response.json();
      setData(data);
      setLoading(false);
  
    }
  
    useEffect(() => {
      fetchData();
    }, []);


    const changePassword = async () => {
      
      //Campos de contraseña coinciden
      if (password!='' && passwordcheck!= '' && password==passwordcheck){
        setTextStylePassword(styles.inputtext)

        await fetch('http://'+ip+':'+port+'/changePassword', {
        method: 'POST',
        headers: {
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
  
          await fetch('http://'+ip+':'+port+'/changeUserData', {
            method: 'POST',
            headers: {
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


        const userInfo = async (alias) => {

          const response = await fetch('http://'+ip+':'+port+'/getUserInfo', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            alias: alias,
        }),
        });
      
          const dataUser = await response.json();
          setDataUser(dataUser);
          setLoading(false);

          setAlias(dataUser[0])
          setName(dataUser[2])
          setSurname(dataUser[3])
          setUserName(dataUser[2]+' '+dataUser[3])
          setEmail(dataUser[4])
      
          setModalVisible(true)
    
          }
      



    return(
      <SafeAreaView style={styles.container}>



        <Modal animationType="slide" transparent={true} visible={modalVisible}>

        <SafeAreaView style={styles.container}>


        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>

                  <View style={styles.modalview}>

                    <Text style={styles.username}>@{alias} </Text>

                    <TextInputAppSecondary ph='Nombre' val={name} setVal={setName} style={styles.inputtext}/>
                    <TextInputAppSecondary ph='Apellidos' val={surname} setVal={setSurname} style={styles.inputtext}/>
                    <TextInputAppSecondary ph='Correo electrónico' val={email} setVal={setEmail} inputmod='email' style={styles.inputtext}/>
                    <TextInputAppSecondary ph='Contraseña' val={password} setVal={setPassword} secure={true} style={styles.inputtext}/>
                    <TextInputAppSecondary ph='Confirmar contraseña' val={passwordcheck} setVal={setPasswordCheck} secure={true} style={styles.inputtext}/>
                    
                    <ButtonAppSecondary title={'Confirmar cambios'} button_style={styles.button} text_style={styles.text} onPress={() => changePassword()}/>
                    <ButtonApp title={'Volver'} onPress={() => setModalVisible(false)}/>

                  </View>

                  </TouchableWithoutFeedback>
            </KeyboardAvoidingView>

            </SafeAreaView>

    
        </Modal>



      <ButtonAppSecondary title={'Gestión de usuarios'} button_style={styles.button} text_style={styles.text} onPress={() => navigation.navigate('UserManagement')}/>

      <ButtonAppSecondary title={'Configuración de semáforo'} button_style={styles.button} text_style={styles.text} onPress={() => navigation.navigate('Stoplighconfig')}/>

      <ButtonAppSecondary title={'Perfil'} button_style={styles.button} text_style={styles.text} onPress={() => navigation.navigate('Profile')}/>
        


        </SafeAreaView>
    );
};
export default ProfileAdmin;


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

  listWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderBottomWidth: 0.5,
  },

  row: {
    backgroundColor: '#fff',
    flex: 1,
    marginBottom: 20,
    marginTop:20,
    fontSize: 15,
    paddingHorizontal: 10,
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