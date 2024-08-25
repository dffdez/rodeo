import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { FlatList, StyleSheet, Text, TextInput, View, Button, TouchableOpacity, SafeAreaView, Platform, Modal, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard} from 'react-native';


import Logo from '../assets/adaptive-icon.png';
import ButtonAppSecondary from '../components/ButtonAppSecondary';



const ADDRESS = require('../serverconn_conf/ServerAddress')
const ip = ADDRESS.IP
const port = ADDRESS.PORT



const ChatIndex = ({navigation}) => {

  const [data, setData] = useState([]);
  const [doneChat, setDoneChat] = useState([]);
  const[modalVisible, setModalVisible] = useState(false);


  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    const response = await fetch('http://'+ip+':'+port+'/getAllChats');
    const data = await response.json();
    setData(data);
    setLoading(false);

  }

  useEffect(() => {
    fetchData();
  }, []);



      return(
    <SafeAreaView style={styles.container}>

      <Modal animationType="slide" transparent={true} visible={modalVisible} >

      <SafeAreaView style={{
      height: '50%',
      marginTop: 'auto',
      justifyContent: 'center',
      backgroundColor: '#fff',
      borderColor: 'grey',
      borderTopWidth: 2,
      borderStartWidth: 2,
      borderEndWidth:2,
      borderTopLeftRadius: 40,
      borderTopRightRadius: 40,
    }}>

       

      
                  <View>


                      <ButtonAppSecondary button_style={styles.button} text_style={styles.buttonText} title={'Marcar como respondido'} onPress={() => fetchData()}/>
                      <ButtonAppSecondary button_style={styles.button} text_style={styles.buttonText} title={'Eliminar'} onPress={() => fetchData()}/>
                      <ButtonAppSecondary button_style={styles.button} text_style={styles.buttonText} title={'Volver'} onPress={() => setModalVisible(false) }/>


                  </View>


      </SafeAreaView>
      </Modal>


      {loading && <Text style={styles.loading}>Cargando...</Text>}

      {data &&

      <View>
        <TouchableOpacity style={styles.listWrapperDone} onPress={() => navigation.navigate('ChatAdmin', {alias: item[0]})} onLongPress={() => setModalVisible(true)}>
          <Text style={styles.rowDone}>Archivados</Text>
        </TouchableOpacity> 

        <FlatList 
        style={{height: '50%'}}
        data={data} 
        renderItem={({item}) => 
          <TouchableOpacity style={styles.listWrapper} onPress={() => navigation.navigate('ChatAdmin', {alias: item[0]})} onLongPress={() => setModalVisible(true)}>
            <Text style={styles.row}>{item}</Text>
          </TouchableOpacity> 
        } 
        />
        


      </View>
        
      }

        </SafeAreaView>
  
      );
  };
  export default ChatIndex;


  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
    },

    view: {
    flexGrow: 1,
    backgroundColor: '#fff',
    alignItems: 'flex-start',
    //justifyContent: 'center',
    //marginTop: '20%',
    //marginLeft: '10%'
    },

    listWrapper: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      borderBottomWidth: 0.5,
    },
    
    listWrapperDone: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      borderBottomWidth: 1,
    },

    row: {
      backgroundColor: '#fff',
      flex: 1,
      marginBottom: 20,
      marginTop:20,
      fontSize: 15,
      paddingHorizontal: 10,
    },

    rowDone: {
      backgroundColor: '#fff',
      flex: 1,
      marginBottom: 20,
      marginTop:20,
      paddingHorizontal: 10,
      fontSize: 15,
      fontWeight: 'bold',
    },

    loading: {
      //flexGrown: 1,
      alignSelf: 'center',
      justifyContent:'center',      
      backgroundColor: '#fff',

    },

    requestinfo: {
      //flexGrown: 1,
      alignSelf: 'flex-start',
      justifyContent:'center',     
      marginStart: '2%', 
      backgroundColor: '#fff',
      fontSize: 20,
      fontWeight: 'bold'
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
  
    buttonText: {
      color: 'black'
    },
  
   });