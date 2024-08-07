import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { FlatList, StyleSheet, Text, Platform, View, Image, TouchableOpacity, Modal, SafeAreaView, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard} from 'react-native';

import StarButton from '../components/StarButton';
import favstar from '../assets/favstar.png';
import nofavstar from '../assets/nofavstar.png';
import ButtonAppSecondary from '../components/ButtonAppSecondary';
import Stoplight from '../components/Stoplight';

import {useAuth} from '../context/AuthContext';



import rodeoserver from '../serverconn_conf/ServerAddress'
const ip = rodeoserver.IP
const port = rodeoserver.PORT



const Tracking = ({navigation}) => {

  const { getUsername } = useAuth();

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewselector, setView] = useState('Mostrar todo');
  const [modalVisible, setModalVisible] = useState(false);


  const[symbol, setSymbol] = useState('');
  const[name, setName] = useState('');

  
  const changeView = () => {
    if (viewselector == 'Mostrar todo'){
      setView('Acciones')
    }
    if (viewselector == 'Acciones'){
      setView('Cryptos')
    }
    if (viewselector == 'Cryptos'){
      setView('Mostrar todo')
    }
  }


  const fetchData = async () => {

    const response = await fetch('http://'+ip+':'+port+'/getFavourites', {
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
    setLoading(false);
    
  }

  useEffect(() => {
    fetchData();
  }, []);


  const infoStock = (symbol, name) => {

    setSymbol(symbol)
    setName(name)
    setModalVisible(true)

  }


      return(
    <SafeAreaView style={styles.container}>

        <Modal animationType="slide" transparent={true} visible={modalVisible}>

          <SafeAreaView style={styles.modalcontainer}> 

        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={styles.modalview}>

                        <Text style={styles.editSymbol}>{symbol}</Text>
                        <Text style={styles.editName}>{name}</Text>

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
          <TouchableOpacity style={styles.listWrapper} onPress={() => infoStock(item[0], item[1])}> 
          
            <StarButton style={styles.favrow} symbol={item[0]} init={favstar}/> 

            <View style={styles.row}>
              <Text style={styles.symbol}>{item[0]}</Text>
              <Text style={styles.name}>{item[1]}</Text>
            </View>
            <Text style={styles.row}>Precio</Text>

            <Stoplight style={styles.favrow}/> 
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

    },

    row: {
      backgroundColor: '#fff',
      flex: 1,
      marginBottom: 20,
      marginTop:20,
      fontSize: 15,
      //paddingHorizontal: 10,
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

    starIcon: {
      alignSelf: 'center',
      justifyContent: 'center',
      width: 40,
      height: 40,
    },
  
   });