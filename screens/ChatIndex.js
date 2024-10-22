import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { FlatList, StyleSheet, Text, TextInput, View, Button, TouchableOpacity, SafeAreaView, Platform, Modal, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard} from 'react-native';


import Logo from '../assets/adaptive-icon.png';
import ButtonAppSecondary from '../components/ButtonAppSecondary';

import Ionicons from 'react-native-vector-icons/Ionicons';


const ADDRESS = require('../serverconn_conf/ServerAddress')
const ip = ADDRESS.IP
const port = ADDRESS.PORT



const ChatIndex = ({navigation}) => {

  const [data, setData] = useState([]);
  const [doneChat, setDoneChat] = useState([]);
  const[modalVisible, setModalVisible] = useState(false);

  const[selectedChat, setSelectChat] = useState('');



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


  const selectUserChat = async (alias) => {
    setSelectChat(alias);
    setModalVisible(true);
  }

  

  const getStoredChat = async () => {

    const response = await fetch('http://'+ip+':'+port+'/getStoredChat');

    const data = await response.json();
    setData(data);

    setLoading(false);

  }


  const getPendingChat = async () => {

    const response = await fetch('http://'+ip+':'+port+'/getPendingChats');

    const data = await response.json();
    setData(data);
    console.log(data)

    setLoading(false);

  }

  const setStoreChat = async () => {
    setLoading(true);

    await fetch('http://'+ip+':'+port+'/setStoredChat', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({
          alias: selectedChat,
      }),
  });

    setLoading(false);
    fetchData();
    setModalVisible(false);

  }


  const setPendingChat = async () => {
    setLoading(true);

    await fetch('http://'+ip+':'+port+'/setPendingChat', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({
          alias: selectedChat,
      }),
  });

    setLoading(false);
    fetchData();
    setModalVisible(false);

  }

  const deleteChat = async (alias) => {
    setLoading(true);

    await fetch('http://'+ip+':'+port+'/deleteChat', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({
          alias: alias,
      }),
  });

    setLoading(false);
    fetchData();
    setModalVisible(false);


  }



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
          
            <ButtonAppSecondary button_style={styles.button} text_style={styles.buttonText} title={'Marcar como respondido'} onPress={() => setStoreChat()}/>
            <ButtonAppSecondary button_style={styles.button} text_style={styles.buttonText} title={'Marcar como pendiente'} onPress={() => setPendingChat()}/>
            <ButtonAppSecondary button_style={styles.button} text_style={styles.buttonText} title={'Eliminar'} onPress={() => deleteChat()}/>
            <ButtonAppSecondary button_style={styles.button} text_style={styles.buttonText} title={'Volver'} onPress={() => setModalVisible(false) }/>

        </View>


      </SafeAreaView>
      </Modal>


      {loading && <Text style={styles.loading}>Cargando...</Text>}

      {data &&

      <View>
        <TouchableOpacity style={styles.listWrapperDone}>

          <TouchableOpacity style={styles.rowIndex} onPress={() => fetchData()} >
            <Text style={styles.rowDone}>Todos</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.rowIndex} onPress={() => getPendingChat()} >
            <Text style={styles.rowDone}>Pendientes</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.rowIndex} onPress={() => getStoredChat()} >
            <Text style={styles.rowDone}>Archivados</Text>
          </TouchableOpacity>

        </TouchableOpacity> 

        <FlatList 
        style={{height: '50%'}}
        data={data} 
        renderItem={({item}) => 
          <TouchableOpacity style={styles.listWrapper} onPress={() => navigation.navigate('ChatAdmin', {alias: item[0]})} onLongPress={() => selectUserChat(item[0])}>
            <Ionicons name={'person'} size={'200'} style={styles.row} />
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
      //flex: 1,
      marginBottom: 20,
      marginTop:20,
      fontSize: 20,
      paddingHorizontal: 20,
      verticalAlign: 'middle'
    },

    rowDone: {
      backgroundColor: '#fff',
      //flex: 1,
      marginBottom: 20,
      marginTop:20,
      paddingHorizontal: 10,
      fontSize: 15,
      fontWeight: 'bold',
    },

    rowIndex: {
      backgroundColor: '#fff',
      flex: 1,
      marginBottom: 5,
      marginTop:5,
      paddingHorizontal: 10,
      fontSize: 15,
      fontWeight: 'bold',
      alignItems: 'center'
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