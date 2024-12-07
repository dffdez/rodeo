import React, { useState, useEffect, useCallback } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, TextInput, View, FlatList, SafeAreaView, Platform} from 'react-native';
import { io } from 'socket.io-client'
import { useFocusEffect } from '@react-navigation/native';



import ChatBubble from '../components/ChatBubble';
import ChatTextInput from '../components/ChatTextInput';

import {useAuth} from '../context/AuthContext';


const ADDRESS = require('../serverconn_conf/ServerAddress')
const ip = ADDRESS.IP
const port = ADDRESS.PORT

//Poner esto aquí inicia la conexión al entrar en la app
/* const ws = io('ws://'+ip+':'+port+'/chat') */



const ChatAdmin = ({route, navigation}) => {

  const { authState, jwtToken, wsChat} = useAuth();

  const {alias} = route.params;

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const[message, setMessage] = useState('')


  useFocusEffect(
    useCallback(() => {
        // Cuando pantalla activa
        wsChat.emit('join', alias)  

        // Cuando abandona pantalla
        return () => {
          wsChat.emit('leave', alias)  
          // Aquí puedes ejecutar cualquier código que necesites al abandonar la pantalla
        };
    }, [])
);

  //Funciones base websockets
  useEffect(() => {


    //Cargar mensajes antiguos
    fetchData();

    /* wsChat.on('connect', () => {
      wsChat.emit('join', alias)
    }); */

    wsChat.on('message', (data) => {
      console.log('admin', data)
      fetchData();
    });




  }, []);

  
  const fetchData = async () => {
    const response = await fetch('https://'+ip+'/getChat', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${jwtToken}`,
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({
          alias: alias,
      }),
  });

    const data = await response.json();
    setData(data);
    setLoading(false);

  }


const submitMessage = () => {

/*   console.log(JSON.stringify({
    alias: alias,
    user: 'admin',
    message: message,
    })) */


  if(message!=''){

    wsChat.send([alias, 'admin', message])
    fetchData();
    setMessage('');

  }
}

  
      return(


          <SafeAreaView style={styles.container}>


            {loading && <Text style={styles.loading}>Cargando...</Text>}

            {data && jwtToken && authState.authenticated &&

              <FlatList 
              
              data={data} 
              renderItem={({item}) => <ChatBubble user={item[0]} value={item[1]}/>} 
              //extraData={refreshList}
              inverted
              contentContainerStyle={styles.view}>


              </FlatList>
            }
                   

            <ChatTextInput ph={'Escriba su consulta'} val={message} setVal={setMessage} onPress={submitMessage}/>
  
          </SafeAreaView>

            

        
      );
  };
  export default ChatAdmin;


  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      //justifyContent: 'flex-end',

    },

    view: {
    flexGrow: 1,
    backgroundColor: '#fff',
    //alignItems: 'flex-start',
    //justifyContent: 'flex-start',
    //marginTop: '20%',
    //marginLeft: '10%'
    flexDirection:'column-reverse'

    },

    listWrapper: {
      flexDirection: 'row',
      //flexWrap: 'wrap',
      //borderBottomWidth: 0.5,
    },

    loading: {
      //flexGrown: 1,
      alignSelf: 'center',
      justifyContent:'center',      
      backgroundColor: '#fff',

    },


  
   });
