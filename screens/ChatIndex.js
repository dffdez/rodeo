import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { FlatList, StyleSheet, Text, TextInput, View, Button, TouchableOpacity, SafeAreaView, Platform, Modal, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard} from 'react-native';


import Logo from '../assets/adaptive-icon.png';
import ButtonAppSecondary from '../components/ButtonAppSecondary';

import Ionicons from 'react-native-vector-icons/Ionicons';

import {useAuth} from '../context/AuthContext';

const ADDRESS = require('../serverconn_conf/ServerAddress')
const ip = ADDRESS.IP
const port = ADDRESS.PORT



const ChatIndex = ({navigation}) => {

  const { getUsername, jwtToken} = useAuth();



  const [data, setData] = useState([]);
  const [doneChat, setDoneChat] = useState([]);
  const[modalVisible, setModalVisible] = useState(false);

  const[selectedChat, setSelectChat] = useState('');

  const[allChats, setallChats] = useState(true);
  const[pendingChats, setpendingChats] = useState(false);
  const[storedChats, setstoredChats] = useState(false);


  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    const response = await fetch('https://'+ip+'/getAllChats', {
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


  const selectUserChat = async (alias) => {
    setSelectChat(alias);
    setModalVisible(true);
  }

  

  const getStoredChat = async () => {

    const response = await fetch('https://'+ip+'/getStoredChat', {
      method: 'GET',
      headers: {
                'Authorization': `Bearer ${jwtToken}`,
      },
  });

    const data = await response.json();
    setData(data);

    setLoading(false);

  }


  const getPendingChat = async () => {

    const response = await fetch('https://'+ip+'/getPendingChats', {
      method: 'GET',
      headers: {
                'Authorization': `Bearer ${jwtToken}`,
      },
  });

    const data = await response.json();
    setData(data);
    console.log(data)

    setLoading(false);

  }

  const setStoreChat = async () => {
    setLoading(true);

    await fetch('https://'+ip+'/setStoredChat', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${jwtToken}`,
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({
          alias: selectedChat,
      }),
  });

    setLoading(false);
    handleVisible();
    setModalVisible(false);

  }


  const setPendingChat = async () => {
    setLoading(true);

    await fetch('https://'+ip+'/setPendingChat', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${jwtToken}`,
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({
          alias: selectedChat,
      }),
  });

    setLoading(false);
    handleVisible();
    setModalVisible(false);

  }

  const deleteChat = async () => {
    setLoading(true);

    await fetch('https://'+ip+'/deleteChat', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${jwtToken}`,
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({
          alias: selectedChat,
      }),
  });

    setLoading(false);
    handleVisible();
    setModalVisible(false);

  }

  const handleVisible = () => {
    if (allChats == true) {
      fetchData()
    } else if (pendingChats == true) {
      getPendingChat()
    } else if (storedChats == true) {
      getStoredChat()
    }
  }

  const showScreen = async (screen) => {

    if (screen == 'allChats') {
      fetchData()
      setallChats(true)   
      setpendingChats(false)
      setstoredChats(false) 

    } else if (screen == 'pendingChats') {
      getPendingChat()
      setallChats(false)   
      setpendingChats(true)
      setstoredChats(false)      
      
    } else if (screen == 'storedChats') {
      getStoredChat()
      setallChats(false)   
      setpendingChats(false)
      setstoredChats(true) 

    }
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

          <TouchableOpacity style={styles.rowIndex} onPress={() => showScreen('allChats')} >
            <Text style={styles.rowDone}>Todos</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.rowIndex} onPress={() => showScreen('pendingChats')} >
            <Text style={styles.rowDone}>Pendientes</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.rowIndex} onPress={() => showScreen('storedChats')} >
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