import React, { useState, useEffect, useCallback } from 'react';
import { StatusBar } from 'expo-status-bar';
import { FlatList, StyleSheet, Text, Platform, View, Image, TouchableOpacity, Modal, SafeAreaView, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard} from 'react-native';
import { io } from 'socket.io-client'
import { useFocusEffect } from '@react-navigation/native';

import StarButton from '../components/StarButton';
import favstar from '../assets/favstar.png';
import nofavstar from '../assets/nofavstar.png';
import ButtonAppSecondary from '../components/ButtonAppSecondary';
import Stoplight from '../components/Stoplight';

import {useAuth} from '../context/AuthContext';

import StockIcon from '../components/StockIcon';


import rodeoserver from '../serverconn_conf/ServerAddress'
const ip = rodeoserver.IP
const port = rodeoserver.PORT

//Poner esto aquí inicia la conexión al entrar en la app
/* const ws = io('ws://'+ip+':'+port+'/stocks')
 */

const Tracking = ({navigation}) => {

  const { authState, jwtToken, ws } = useAuth();

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewselector, setView] = useState('Mostrar todo');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalInfoColor, setModalInfoColor] = useState(false);

  const [stocks, setStocks] = useState({});
  const [stoplight, setStoplight] = useState({});
  const [datetime, setDatetime] = useState({});
  const [change, setChange] = useState({});
  const [percent, setPercent] = useState({});
  const [imageName, setImageName] = useState('');

  const[symbol, setSymbol] = useState('');
  const[name, setName] = useState('');

  const [color, setColor] = useState([]);

  const[neutral, setNeutral] = useState('');
  const[ent_apx, setEntApx] = useState('');
  const[ent_ent, setEntEnt] = useState('');
  const[sal_tp_apx, setTpApx] = useState('');
  const[sal_tp_sal, setTpSal] = useState('');
  const[sal_sl_apx, setStApx] = useState('');
  const[sal_sl_sal, setStSal] = useState('');




  // Refresh when screen focus
  useFocusEffect(useCallback(() => {fetchData();}, []));


  //Funciones base websockets
  useEffect(() => {

    //Cargar datos
    //fetchData();

    ws.on('connect', () => {
      console.log("Conectado")

      ws.emit('join', authState.username)
    });

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

    ws.on('close', () => {
      console.log("Nuevo mensaje")

      //console.log(data.data)
    });

    ws.on('error', (data) => {
      console.log("Nuevo mensaje")

      //console.log(data.data)
    });


  }, []);


  const fetchData = async () => {

    const response = await fetch('https://'+ip+'/getFavourites', {
      method: 'POST',
      headers: {
          'Authorization': `Bearer ${jwtToken}`,
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({
          alias: authState.username,
      }),
  });

    const data = await response.json();
    setData(data);

    for (const item of data) {
      stocks[item[0]] = 0;
    }
    //console.log(stocks)

    setLoading(false);
    
  }

  const infoStock = (symbol, name) => {
    setSymbol(symbol)
    setName(name)
    setImageName(symbol)
    setModalVisible(true)
  }


  const infoColor= () => {
    getSemaforo()
    setModalInfoColor(true)
  }

  const getSemaforo = async () => {

    const response = await fetch('https://'+ip+'/getStoplight', {
      method: 'GET',
      headers: {
          'Authorization': `Bearer ${jwtToken}`,
      },
  });

    const data = await response.json();
    setColor(data);
    setLoading(false);   
    
    setNeutral(color[0])
    setEntApx(color[1])
    setEntEnt(color[2])
    setTpApx(color[3])
    setTpSal(color[4])
    setStApx(color[5])
    setStSal(color[6])

  }


      return(

    <SafeAreaView style={styles.container}>

        <Modal animationType="slide" transparent={true} visible={modalVisible}>

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

                        <ButtonAppSecondary button_style={styles.buttonAD} text_style={styles.buttonText} title={'Volver'} onPress={() => setModalVisible(false) }/>

                    </View>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>

        </SafeAreaView>
        </Modal>


        <Modal animationType="slide" transparent={true} visible={modalInfoColor}>

          <SafeAreaView style={styles.modalcontainer}> 

        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={styles.modalview}>

                      <View style={styles.listWrapper}>
                        <Text style={styles.infoStockTitle}>Neutro</Text>
                        <Stoplight style={styles.favrow} state={neutral}/> 
                      </View><View style={styles.listWrapper}>
                        <Text style={styles.infoStockTitle}>Entrada aproximación</Text>
                        <Stoplight style={styles.favrow} state={ent_apx}/> 
                      </View><View style={styles.listWrapper}>
                        <Text style={styles.infoStockTitle}>Entrada</Text>
                        <Stoplight style={styles.favrow} state={ent_ent}/> 
                      </View><View style={styles.listWrapper}>
                        <Text style={styles.infoStockTitle}>Salida 'take profit' aproximación</Text>
                        <Stoplight style={styles.favrow} state={sal_tp_apx}/> 
                      </View><View style={styles.listWrapper}>
                        <Text style={styles.infoStockTitle}>Salida 'take profit'</Text>
                        <Stoplight style={styles.favrow} state={sal_tp_sal}/> 
                      </View><View style={styles.listWrapper}>
                        <Text style={styles.infoStockTitle}>Salida 'stop loss' aproximación</Text>
                        <Stoplight style={styles.favrow} state={sal_sl_apx}/>
                      </View><View style={styles.listWrapper}> 
                        <Text style={styles.infoStockTitle}>Salida 'stop loss'</Text>
                        <Stoplight style={styles.favrow} state={sal_sl_sal}/> 
                      </View>


                      <ButtonAppSecondary button_style={styles.buttonAD} text_style={styles.buttonText} title={'Volver'} onPress={() => setModalInfoColor(false) }/>

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
          <TouchableOpacity style={styles.listWrapper} onPress={() => infoStock(item[0], item[1])}> 
          
            <StarButton style={styles.favrow} symbol={item[0]} init={favstar}/> 

            <View style={styles.row}>
              <Text style={styles.symbol}>{item[0]}</Text>
              <Text style={styles.name}>{item[1]}</Text>
            </View>
            <Text style={styles.pricerow}>{stocks[item[0]]}</Text>

            <Stoplight style={styles.favrow} state={stoplight[item[0]]} onpress={() => infoColor(true)}/> 
          </TouchableOpacity> 
        }
        />

        }


          <View style={styles.listWrapperButton}>

            <ButtonAppSecondary button_style={styles.buttonAD} text_style={styles.buttonText} title={'Mostrar todo'} onPress={() => navigation.navigate('TrackingAll')}/>

          </View>

        
      </SafeAreaView>
 

      );
  };
  export default Tracking;


  const styles = StyleSheet.create({
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
      //borderTopWidth: 0.5,
      alignItems: 'center',

    },

    row: {
      backgroundColor: '#fff',
      flex: 1,
      marginBottom: 20,
      marginTop:20,
      fontSize: 15,
      //paddingHorizontal: 10,
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

    listWrapperButton: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      //borderBottomWidth: 0.5,
      justifyContent: 'center',

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
      marginTop:10,
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
      color: 'grey',
      marginBottom: 30

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

    starIcon: {
      alignSelf: 'center',
      justifyContent: 'center',
      width: 40,
      height: 40,
    },
  
   });