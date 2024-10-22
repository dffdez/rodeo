import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { FlatList, StyleSheet, Text, Platform, View, TouchableOpacity, Modal, SafeAreaView, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard} from 'react-native';
import { io } from 'socket.io-client'

import TextInputApp from '../components/TextInputApp';
import ButtonAppSecondary from '../components/ButtonAppSecondary';
import StarButton from '../components/StarButton';
import favstar from '../assets/favstar.png';
import nofavstar from '../assets/nofavstar.png';
import Stoplight from '../components/Stoplight';
import StockIcon from '../components/StockIcon';




import {useAuth} from '../context/AuthContext';

import rodeoserver from '../serverconn_conf/ServerAddress'
const ip = rodeoserver.IP
const port = rodeoserver.PORT


const ws = io('ws://'+ip+':'+port+'/stocks')


const TrackingAll = ({navigation}) => {

  const { getUsername } = useAuth();

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewselector, setView] = useState('Mostrar todo');
  const [modalVisible, setModalVisible] = useState(false);

  const[symbol, setSymbol] = useState('');
  const[name, setName] = useState('');

  const [stocks, setStocks] = useState({});
  const [stoplight, setStoplight] = useState({});
  const [datetime, setDatetime] = useState({});
  const [change, setChange] = useState({});
  const [percent, setPercent] = useState({});
  const [imageName, setImageName] = useState('');

  
  const changeView = () => {
    if (viewselector == 'Mostrar todo'){
      setView('Acciones')
      filtro('getStocksFavStocks')
    }
    if (viewselector == 'Acciones'){
      setView('Cryptos')
      filtro('getStocksFavCrypto')

    }
    if (viewselector == 'Cryptos'){
      setView('Mostrar todo')
      filtro('getStocksFav')

      
    }
  }
  
  //Funciones base websockets
  useEffect(() => {

    //Cargar datos
    fetchData();

    ws.on('connect', () => {
      console.log("Conectado")

      ws.emit('join', getUsername())
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

    const response = await fetch('http://'+ip+':'+port+'/getStocksFav', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({
          alias: getUsername(),
      }),
  });
    const data = await response.json();
    setData(data);
    //console.log(data)

    for (const item of data) {
      stocks[item[0][0]] = 0;
    }
    setLoading(false);   

  }


  //Funcion para filtrar por accion/ cripto. En el servidor
  const filtro = async (url) => {
    setLoading(true);   

    const response = await fetch('http://'+ip+':'+port+'/'+url, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({
          alias: getUsername(),
      }),
  });
    const data = await response.json();
    setData(data);
    //console.log(data)

    for (const item of data) {
      stocks[item[0][0]] = 0;
    }
    setLoading(false);   

  }
  

  const infoStock = (symbol, name) => {

    setSymbol(symbol)
    setName(name)
    setImageName(symbol)
    setModalVisible(true)

  }

  // Shows black star if favourite or blank in other case
  const starselector = (fav) => {

    if(fav == true){
      return favstar
    } else {    
      return nofavstar
    }

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

      
        {loading && <Text style={styles.loading}>Cargando...</Text>}

        {data &&

        <FlatList 
        contentContainerStyle={styles.view}
        data={data} 
        //extraData={refreshList}

        renderItem={({item}) => 
          <TouchableOpacity style={styles.listWrapper} onPress={() => infoStock(item[0][0], item[0][1])}> 

            <StarButton style={styles.favrow} symbol={item[0][0]} init={starselector(item[1])}/> 

            <View style={styles.row}>
              <Text style={styles.symbol}>{item[0][0]}</Text>
              <Text style={styles.name}>{item[0][1]}</Text>
            </View>
            <Text style={styles.pricerow}>{stocks[item[0][0]]}</Text>

            <Stoplight style={styles.favrow} state={stoplight[item[0][0]]}/>
          </TouchableOpacity> 
        }
        />

        }


          <View style={styles.listWrapperButton}>

            <ButtonAppSecondary button_style={styles.buttonAD} text_style={styles.buttonText} title={'Favoritos'} onPress={() => navigation.goBack() }/>
            <ButtonAppSecondary button_style={styles.buttonAD} text_style={styles.buttonText} title={viewselector} onPress={() => changeView() }/>

          </View>

        
      </SafeAreaView>
  
      );
  };
  export default TrackingAll;


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