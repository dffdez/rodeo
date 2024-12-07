import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { FlatList, StyleSheet, Text, TextInput, View, Platform, TouchableOpacity, Modal, SafeAreaView, Image, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, Alert} from 'react-native';
import Slider from '@react-native-community/slider';
import { io } from 'socket.io-client'
import * as ImagePicker from 'expo-image-picker';

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





const TrackingAdmin = ({navigation}) => {

  const { authState, jwtToken, ws } = useAuth();
  
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const[modalVisible, setModalVisible] = useState(false);
  const[modalEditVisible, setModalEditVisible] = useState(false);


  const[symbol, setSymbol] = useState('');
  const[name, setName] = useState('');
  const[acselector, setSelector] = useState('Acción / Crypto');
  const[imageName, setImageName] = useState('');

  const [stocks, setStocks] = useState({});
  const [stoplight, setStoplight] = useState({});
  const [datetime, setDatetime] = useState({});
  const [change, setChange] = useState({});
  const [percent, setPercent] = useState({});

  const [selectedImage, setSelectImage] = useState(null);
  const [isSelectedImage, setIsSelectedImage] = useState(false);


  const changeSelector = () => {
    if (acselector == 'A'){
      setSelector('C')
    }
    else{
      setSelector('A')
    }
  }


  //Funciones base websockets
  useEffect(() => {

    //Cargar datos
    fetchData();


    ws.on('message', (data) => {

      //Actualización de los precios

      //Copy of stocks
      const updatedStocks = {...stocks}
      const updatedStoplight = {...stoplight}
      const updatedDatetime = {...datetime}
      const updatedChange = {...change}
      const updatedPercent = {...percent}

      //Updated changes on copy
      for (const key in stocks) {
        updatedStocks[key] = data[key]['price']                          // Cambiar 'AAPL' por key para obtener datos de peticion
        updatedStoplight[key] = data[key]['state']                          // Cambiar 'AAPL' por key para obtener datos de peticion
        updatedDatetime[key] = data[key]['datetime']                          // Cambiar 'AAPL' por key para obtener datos de peticion
        updatedChange[key] = data[key]['change']                          // Cambiar 'AAPL' por key para obtener datos de peticion
        updatedPercent[key] = data[key]['percent_change']                          // Cambiar 'AAPL' por key para obtener datos de peticion

      }
      //Set changes
      setStocks(updatedStocks)
      setStoplight(updatedStoplight)
      setDatetime(updatedDatetime)
      setChange(updatedChange)
      setPercent(updatedPercent)

    });

   
  }, []);


  const fetchData = async () => {
    const response = await fetch('https://'+ip+'/getStocks', {
      method: 'GET',
      headers: {
                'Authorization': `Bearer ${jwtToken}`,
      },
  });

    const data = await response.json();
    setData(data);

    for (const item of data) {
      stocks[item[0]] = 0;
    }
    setLoading(false);

  }

  useEffect(() => {
    fetchData();
  }, []);


  const newStock = async () => {

    if (symbol != '' && name != '' && isSelectedImage){

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

      setModalVisible(false)
      fetchData();


    } else {
      Alert.alert('Información', 'Para añadir un nuevo valor debe incluir símbolo, nombre y seleccionar un icono.')

    }
  }

  const editStock = (symbol, name) => {

    setSymbol(symbol)
    setName(name)
    setImageName(symbol)
    setModalEditVisible(true)

  }

  const dismissStock = () => {
    setModalVisible(false)

    setSymbol('')
    setName('')
    setSelectImage(null)
    setIsSelectedImage(false)

  }

  const dismissEditStock = () => {
    setModalEditVisible(false)
    setSymbol('')
    setName('')
    setImageName('')
    
  }


  const deleteStock = async (symbol) => {

    await fetch('https://'+ip+'/deleteStock', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${jwtToken}`,
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({
              symbol: symbol,
          }),
      });

    fetchData();

    setSymbol('')
    setModalEditVisible(false)

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



      <Modal animationType="slide" transparent={true} visible={modalVisible}>

      <SafeAreaView style={styles.modalcontainer}> 

        
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} > 
              <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                  <View style={styles.modalview}>

                      <SetStockIcon ok={isSelectedImage} onpress={() => selectImage()}/>

                      <TextInput value={symbol} style={styles.inputTitle} onChangeText={setSymbol} placeholder="Símbolo" />
                      <TextInput value={name} style={styles.inputTitle} onChangeText={setName} placeholder="Nombre" />

                      <ButtonAppSecondary button_style={styles.button} text_style={styles.buttonText} title={acselector} onPress={() => changeSelector()}/>

                      <ButtonAppSecondary button_style={styles.buttonAD} text_style={styles.buttonText} title={'Añadir'} onPress={() => newStock()}/>
                      <ButtonAppSecondary button_style={styles.buttonAD} text_style={styles.buttonText} title={'Descartar'} onPress={() => dismissStock() }/>


                  </View>
              </TouchableWithoutFeedback>
          </KeyboardAvoidingView>

      </SafeAreaView>
      </Modal>


              <Modal animationType="slide" transparent={true} visible={modalEditVisible}>

          <SafeAreaView style={styles.modalcontainer}> 

        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={styles.modalview}>
                        
                        <StockIcon name={imageName}/>
                        <Text style={styles.editSymbol}>{symbol}</Text>
                        <Text style={styles.editName}>{name}</Text>
                        
                        <Text style={styles.infoStockTitle}>Fecha de cambio</Text>
                        <Text style={styles.infoStock}>{datetime[symbol]}</Text>

                        <Text style={styles.infoStockTitle}>Cambio 1min</Text>
                        <Text style={styles.infoStock}>{change[symbol]}</Text>

                        <Text style={styles.infoStockTitle}>%Cambio 1min</Text>
                        <Text style={styles.infoStockBottom}>{percent[symbol]}</Text>

                        <ButtonAppSecondary button_style={styles.buttonAD} text_style={styles.buttonText} title={'Eliminar'} onPress={() => deleteStock(symbol) }/>
                        <ButtonAppSecondary button_style={styles.buttonAD} text_style={styles.buttonText} title={'Volver'} onPress={() => dismissEditStock() }/>

                    </View>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>

        </SafeAreaView>
        </Modal>



        {loading && <Text style={styles.loading}>Cargando...</Text>}

        {data && jwtToken && authState.authenticated &&


          <FlatList 
          contentContainerStyle={styles.view}
          data={data} 
          //extraData={refreshList}

          renderItem={({item}) => 
            <TouchableOpacity style={styles.listWrapper} onPress={() => navigation.navigate('TrackConf', {simbolo: item[0], nombre: item[1]})} onLongPress={() => editStock(item[0], item[1])}> 
              <View style={styles.row}>
                <Text style={styles.symbol}>{item[0]}</Text>
                <Text style={styles.name}>{item[1]}</Text>
              </View>
              <Text style={styles.pricerow}>{stocks[item[0]]}</Text>

            <Stoplight style={styles.favrow} state={stoplight[item[0]]}/> 



            </TouchableOpacity> 
          }
          />

        }


        <ButtonApp title={'Añadir a seguimiento'} onPress={() => setModalVisible(true)}/>

        <View style={styles.emptyspace} />



        
      </SafeAreaView>
  
      );
  };
  export default TrackingAdmin;


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


  
   });