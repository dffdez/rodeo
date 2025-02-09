import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { FlatList, StyleSheet, Text, TextInput, View, Platform, TouchableOpacity, Modal, SafeAreaView, Image, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, Alert} from 'react-native';
import Slider from '@react-native-community/slider';
import { io } from 'socket.io-client'
import * as ImagePicker from 'expo-image-picker';
import Ionicons from 'react-native-vector-icons/Ionicons';


import SetStockIcon from '../components/SetStockIcon';
import StockIcon from '../components/StockIcon';

import TextInputApp from '../components/TextInputApp';
import ButtonApp from '../components/ButtonApp';
import ButtonAppSecondary from '../components/ButtonAppSecondary';
import Stoplight from '../components/Stoplight';

import {useAuth} from '../context/AuthContext';

import rodeoserver from '../serverconn_conf/ServerAddress'
const ip = rodeoserver.IP
const port = rodeoserver.PORT





const TrackingAdminAdd = ({navigation}) => {

  const { authState, jwtToken, ws } = useAuth();
  
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const[modalVisible, setModalVisible] = useState(false);
  const[modalEditVisible, setModalEditVisible] = useState(false);
  const[modalInfoColor, setModalInfoColor] = useState(false);
  


  const[symbol, setSymbol] = useState('');
  const[name, setName] = useState('');
  const[acselector, setSelector] = useState('');
  const[acselectorNombre, setSelectorNombre] = useState('Acción / Crypto');

  const[imageName, setImageName] = useState('');

  const [stocks, setStocks] = useState({});
  const [stoplight, setStoplight] = useState({});
  const [datetime, setDatetime] = useState({});
  const [change, setChange] = useState({});
  const [percent, setPercent] = useState({});

  const [selectedImage, setSelectImage] = useState(null);
  const [isSelectedImage, setIsSelectedImage] = useState(false);

    const[neutral, setNeutral] = useState('');
    const[ent_apx, setEntApx] = useState('');
    const[ent_ent, setEntEnt] = useState('');
    const[sal_tp_apx, setTpApx] = useState('');
    const[sal_tp_sal, setTpSal] = useState('');
    const[sal_sl_apx, setStApx] = useState('');
    const[sal_sl_sal, setStSal] = useState('');


  const changeSelector = () => {
    if (acselectorNombre == 'Acción'){
      setSelectorNombre('Crypto')
      setSelector('C')
    }
    else{
      setSelectorNombre('Acción')
      setSelector('A')
    }
  }

  //{"code":404,"message":"**symbol** or **figi** parameter is missing or invalid. Please provide a valid symbol according to API documentation: https://twelvedata.com/docs#reference-data","status":"error"}

  const verifySymbol = async () => {

    if (symbol != '' && name != '' && isSelectedImage && acselector != ''){


    const response = await fetch('https://'+ip+'/verifySymbol', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${jwtToken}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            symbol: symbol,
        }),
    });

    const data = await response.json();


    if (!data) {
        Alert.alert('Información', 'El símbolo introducido no es válido.')
    } else {
        newStock()
    }

      } else {

        if (!symbol){
            Alert.alert('Información', 'Para añadir un nuevo valor debe incluir un símbolo.')
        } else if (!name){
            Alert.alert('Información', 'Para añadir un nuevo valor debe incluir un nombre.')
        }  else if (!acselector){
          Alert.alert('Información', 'Para añadir un nuevo valor debe seleccionar si es acción o criptomoneda.')
        } else if (!isSelectedImage ){
        Alert.alert('Información', 'Para añadir un nuevo valor debe seleccionar un icono.')
    }

    }

  }


  const newStock = async () => {


        await fetch('https://'+ip+'/newStock', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${jwtToken}`,
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({
              symbol: symbol,
              name: name,
              acselector: acselector,
          }),
      });

      if(isSelectedImage == true){

        setIsSelectedImage(false)

        const formData = new FormData();
        formData.append(
          'image',
          {
            uri: selectedImage,
            name: symbol+'.jpg',
            type: 'image/jpg',
          }
        )
        await fetch('https://'+ip+'/newIconStock', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${jwtToken}`,
          },
          body: formData,
  
      });

    }


      setSymbol('')
      setName('')

      navigation.goBack()
      //fetchData();


    
  }

  const dismissStock = () => {
    setSymbol('')
    setName('')
    setSelector('')
    setSelectImage(null)
    setIsSelectedImage(false)

    navigation.goBack()

  }




  const selectImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({mediaTypes: ImagePicker.MediaTypeOptions.Images });

    if(!result.canceled){
      setSelectImage(result.assets[0].uri)
      console.log("Seleccionado")
      setIsSelectedImage(true)

    } else {
      console.log("No seleccionado")
    }
  }




  
      return(
    <SafeAreaView style={styles.container}>

        {jwtToken && authState.authenticated &&

            <SafeAreaView style={styles.modalcontainer}> 

                    
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} > 
                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                        <View style={styles.modalview}>

                            <SetStockIcon ok={isSelectedImage} onpress={() => selectImage()}/>

                            <TextInput value={symbol} style={styles.inputTitle} onChangeText={setSymbol} placeholder="Símbolo" />
                            <TextInput value={name} style={styles.inputTitle} onChangeText={setName} placeholder="Nombre" />

                            <ButtonAppSecondary button_style={styles.button} text_style={styles.buttonText} title={acselectorNombre} onPress={() => changeSelector()}/>

                            <ButtonApp button_style={styles.buttonAD} text_style={styles.buttonText} title={'Añadir'} onPress={() => verifySymbol()}/>
                            <ButtonApp button_style={styles.buttonAD} text_style={styles.buttonText} title={'Descartar'} onPress={() => dismissStock() }/>


                        </View>
                    </TouchableWithoutFeedback>
                </KeyboardAvoidingView>
            </SafeAreaView>

           }

        
      </SafeAreaView>
  
      );
  };
  export default TrackingAdminAdd
  const styles = StyleSheet.create({

    emptyspace: {
      padding: 10,
    },

    container: {
      flex: 1,
      backgroundColor: '#fff',
    },

    modalcontainer: {
      flex: 1,
      justifyContent: 'center',
      backgroundColor: '#fff',
    },

    loading: {
      //flexGrown: 1,
      alignSelf: 'center',
      justifyContent:'center',      
      backgroundColor: '#fff',

    },

    view: {
    flexGrow: 1,
    backgroundColor: '#fff',
    //alignItems: 'flex-start', ocupa todo el ancho
    //justifyContent: 'center',
    //marginTop: '20%',
    //marginLeft: '10%'
    },

    modalview: {
      flexGrow: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      //justifyContent: 'center',
      //marginTop: '20%',
      //marginLeft: '10%'
      },

    listWrapper: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      //borderBottomWidth: 0.5,
      alignItems: 'center',

    },

    row: {
      backgroundColor: '#fff',
      flex: 1,
      marginBottom: 20,
      marginTop:20,
      fontSize: 15,
      paddingHorizontal: 10,
    },

    pricerow: {
      backgroundColor: '#fff',
      flex: 1,
      //marginBottom: 20,
      //marginTop:20,
      fontSize: 17,
      textAlignVertical: 'center',
    },

    favrow: {
      backgroundColor: '#fff',
      marginBottom: 20,
      marginTop:20,
      paddingHorizontal: 10,
    },

    rowValue: {
      backgroundColor: '#fff',
      flex: 1,
      marginBottom: 20,
      marginTop:20,
      fontSize: 16,
      fontWeight:'bold',
      paddingHorizontal: 10,
    },

    symbol: {
      backgroundColor: '#fff',
      flex: 1,
      fontSize: 18,
      fontWeight:'bold',
      paddingHorizontal: 10,
    },

    name: {
      backgroundColor: '#fff',
      color: 'grey',
      flex: 1,
      fontSize: 15,
      paddingHorizontal: 10,
    },

    inputTitle: {
      fontSize: 20,
      alignItems: 'center',
      justifyContent: 'center',
      height: 50,
      width: '85%',
      borderColor: 'grey',
      borderWidth: 1,
      borderRadius: 10,
      backgroundColor: 'white',
      paddingLeft: '4%',
      paddingRight: '4%',
      marginStart: 5,
      marginTop:20,

    },

    button: {
      alignSelf: 'center',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#fff',
      borderColor: 'grey',
      height: 50,
      width: '80%',
      borderRadius: 10,
      borderWidth: 0.5,
      marginTop:20,
    },

    buttonAD: {
      alignSelf: 'center',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#fff',
      borderColor: 'grey',
      height: 50,
      width: '80%',
      borderRadius: 10,
      borderWidth: 0.5,
      marginTop:20,
    },
  
    buttonText: {
      color: 'black'
    },

    editSymbol: {
      fontSize: 25,
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight:'bold',
      paddingLeft: '4%',
      paddingRight: '4%',

    },

    editName: {
      fontSize: 20,
      alignItems: 'center',
      justifyContent: 'center',
      paddingLeft: '4%',
      paddingRight: '4%',
      marginBottom: 40

    },

    infoStockTitle: {
      fontSize: 18,
      alignItems: 'center',
      justifyContent: 'center',
      paddingLeft: '4%',
      paddingRight: '4%',
      color: 'black',
      marginTop: 10,
      marginBottom: 2
    },

    infoStock: {
      fontSize: 18,
      alignItems: 'center',
      justifyContent: 'center',
      paddingLeft: '4%',
      paddingRight: '4%',
      color: 'grey',
      marginBottom: 10,
      //marginTop: 10
    },

    infoStockBottom: {
      fontSize: 18,
      alignItems: 'center',
      justifyContent: 'center',
      paddingLeft: '4%',
      paddingRight: '4%',
      color: 'grey',
      marginBottom: 10,
      marginBottom: 40,

    },

    listInfoWrapper: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      //borderBottomWidth: 0.5,
      //borderTopWidth: 0.5,
      //alignItems: 'center',

    },

    infoRow: {
      backgroundColor: '#fff',
      flex: 1,
      marginBottom: 20,
      marginTop:20,
      fontSize: 15,
      alignItems: 'flex-end',
      //paddingHorizontal: 10,
    },

    infoColorTitle: {
      fontSize: 18,
      alignItems: 'center',
      justifyContent: 'center',
      paddingLeft: '4%',
      paddingRight: '4%',
      color: 'black',
      marginTop: 10,
      marginBottom: 2,
      flex: 2
    },


  
   });