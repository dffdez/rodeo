import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { FlatList, StyleSheet, Text, TextInput, View, Platform, TouchableOpacity, Modal, SafeAreaView, Image, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard} from 'react-native';
import { ColorPicker } from 'react-native-color-picker';
import Slider from '@react-native-community/slider';

import TextInputApp from '../components/TextInputApp';
import ButtonApp from '../components/ButtonApp';
import ButtonAppSecondary from '../components/ButtonAppSecondary';
import Stoplight from '../components/Stoplight';


import rodeoserver from '../serverconn_conf/ServerAddress'
const ip = rodeoserver.IP
const port = rodeoserver.PORT



const TrackingAdmin = ({navigation}) => {


  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const[modalVisible, setModalVisible] = useState(false);
  const[modalEditVisible, setModalEditVisible] = useState(false);


  const[symbol, setSymbol] = useState('');
  const[name, setName] = useState('');
  const[acselector, setSelector] = useState('Acción');
  const[voselector, setVisible] = useState('Oculto');



  const changeSelector = () => {
    if (acselector == 'Acción'){
      setSelector('Crypto')
    }
    else{
      setSelector('Acción')
    }
  }

  const changeVisible = () => {
    if (voselector == 'Visible'){
      setVisible('Oculto')
    }
    else{
      setVisible('Visible')
    }

  }


  const fetchData = async () => {
    const response = await fetch('http://'+ip+':'+port+'/getStocks')

    const data = await response.json();
    setData(data);
    setLoading(false);

  }

  useEffect(() => {
    fetchData();
  }, []);


  const newStock = async () => {

    if (symbol!=''){

        await fetch('http://'+ip+':'+port+'/newStock', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({
              symbol: symbol,
              type: acselector,
          }),
      });

      fetchData();

      setSymbol('')
      setModalVisible(false)

    }
  }

  const editStock = (symbol, name) => {

    setSymbol(symbol)
    setName(name)
    setModalEditVisible(true)

  }

  const dismissStock = () => {
    setSymbol('')
    setName('')
    setModalVisible(false)
  }

  const dismissEditStock = () => {
    setSymbol('')
    setName('')
    setModalEditVisible(false)
  }


  const deleteStock = async (symbol) => {

    await fetch('http://'+ip+':'+port+'/deleteStock', {
          method: 'POST',
          headers: {
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




  
      return(
    <SafeAreaView style={styles.container}>



      <Modal animationType="slide" transparent={true} visible={modalVisible}>

      <SafeAreaView style={styles.modalcontainer}> 

        
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} >
              <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                  <View style={styles.modalview}>

       <TextInput value={symbol} style={styles.inputTitle} onChangeText={setSymbol} placeholder="Acción/Crypto" />
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

                      <Text style={styles.editSymbol}>{symbol}</Text>
                      <Text style={styles.editName}>{name}</Text>

                      <ButtonAppSecondary button_style={styles.button} text_style={styles.buttonText} title={voselector} onPress={() => changeVisible()}/>


                      <ButtonAppSecondary button_style={styles.buttonAD} text_style={styles.buttonText} title={'Eliminar'} onPress={() => deleteStock(symbol) }/>
                      <ButtonAppSecondary button_style={styles.buttonAD} text_style={styles.buttonText} title={'Volver'} onPress={() => dismissEditStock() }/>


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
            <TouchableOpacity style={styles.listWrapper} onPress={() => navigation.navigate('TrackConf', {simbolo: item[0], nombre: item[1]})} onLongPress={() => editStock(item[0], item[1])}> 
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


        <ButtonApp title={'Añadir a seguimiento'} onPress={() => setModalVisible(true)}/>


        
      </SafeAreaView>
  
      );
  };
  export default TrackingAdmin;


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

    favrow: {
      backgroundColor: '#fff',
      //flex: 1,
      marginBottom: 20,
      marginTop:20,
      //fontSize: 15,
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

    },


  
   });