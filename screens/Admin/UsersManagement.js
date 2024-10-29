import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, FlatList, View, Image, TouchableOpacity, Modal, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, SafeAreaView, Platform, Alert } from 'react-native';

import TextInputApp from '../../components/TextInputApp';
import TextInputAppSecondary from '../../components/TextInputAppSecondary';
import ButtonApp from '../../components/ButtonApp';
import ButtonAppSecondary from '../../components/ButtonAppSecondary';
import Ionicons from 'react-native-vector-icons/Ionicons';


import {useAuth} from '../../context/AuthContext';



import rodeoserver from '../../serverconn_conf/ServerAddress'
const ip = rodeoserver.IP
const port = rodeoserver.PORT



const UserManagement = ({navigation}) => {

    const { getUsername, jwtToken } = useAuth();



    const[modalVisible, setModalVisible] = useState(false);
    const[modalPassVisible, setModalPassVisible] = useState(false);
    const[textStylePassword, setTextStylePassword] = useState(styles.inputtext);


 
    const[name, setName] = useState('');
    const[surname, setSurname] = useState('');
    const[alias, setAlias] = useState('');
    const[email, setEmail] = useState('');
    const[password, setPassword] = useState('')
    const[passwordcheck, setPasswordCheck] = useState('')
    const[username, setUserName] = useState('');


    const [data, setData] = useState([]);
    const [dataUser, setDataUser] = useState([]);

    const [loading, setLoading] = useState(true);




    const fetchData = async () => {

  
      const response = await fetch('http://'+ip+':'+port+'/getAllUser', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${jwtToken}`,
        },
    });
  
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
  
          await fetch('http://'+ip+':'+port+'/changeUserData', {
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
         setModalVisible(false)
  
        }
  
        }

        const alertDeleteUser = () =>
          Alert.alert('Información', 'Está a punto de eliminar este usuario. ¿Desea continuar?', [
            {
              text: 'Cancelar'
            },
            {text: 'OK', onPress: () => deleteUser(alias)},
          ]);

        const deleteUser = async (alias) => {

      
    
          //Campos de contraseña coinciden
            setTextStylePassword(styles.inputtext)
    
            await fetch('http://'+ip+':'+port+'/deleteUser', {
              method: 'POST',
              headers: {
                  'Authorization': `Bearer ${jwtToken}`,
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                  alias: alias,
              }),
             });
  
           fetchData();
           setModalVisible(false)
        
          }

        const userInfo = async (alias) => {

      
          const response = await fetch('http://'+ip+':'+port+'/getUserInfo', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${jwtToken}`,
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


        <Modal animationType="slide" transparent={true} visible={modalVisible}>

            <SafeAreaView style={styles.container}>


            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>

                    <View style={styles.modalview}>

                        <Text style={styles.username}>@{alias} </Text>

                        <TextInputAppSecondary ph='Nombre' val={name} setVal={setName} style={styles.inputtext}/>
                        <TextInputAppSecondary ph='Apellidos' val={surname} setVal={setSurname} style={styles.inputtext}/>
                        <TextInputAppSecondary ph='Correo electrónico' val={email} setVal={setEmail} inputmod='email' style={styles.inputtext}/>
                        <ButtonAppSecondary title={'Contraseña'} button_style={styles.button} text_style={styles.text} onPress={() => setModalPassVisible(true)}/>  


                        <ButtonAppSecondary title={'Confirmar cambios'} button_style={styles.buttonOk} text_style={styles.text} onPress={() => changeUserData()}/>
                        <ButtonAppSecondary title={'Eliminar usuario'} button_style={styles.button} text_style={styles.text} onPress={() => alertDeleteUser()}/>

                        <ButtonApp title={'Volver'} onPress={() => setModalVisible(false)}/>

                    </View>

                    </TouchableWithoutFeedback>
                </KeyboardAvoidingView>

                </SafeAreaView>

    
        </Modal>


      {loading && <Text style={styles.loading}>Cargando...</Text>}

      {data &&
      
        <FlatList 
        data={data} 
        renderItem={({item}) => 
          <TouchableOpacity style={styles.listWrapper} onPress={() => userInfo(item[0])}>
            <Ionicons name={'person'} size={'200'} style={styles.row} />
            <Text style={styles.row}>{item}</Text>
          </TouchableOpacity> 
        } 
        />
      }

        </SafeAreaView>
    );
};
export default UserManagement;


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
    //flex: 1,
    marginBottom: 20,
    marginTop:20,
    fontSize: 20,
    paddingHorizontal: 20,
    verticalAlign: 'middle'
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


  buttonOk: {
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    backgroundColor: '#5ba4fc',
    height: 50,
    width: '80%',
    borderRadius: 10,
    marginTop: 60
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