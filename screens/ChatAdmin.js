import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, TextInput, View, FlatList, SafeAreaView, Platform} from 'react-native';

import TextInputApp from '../components/TextInputApp';
import ButtonApp from '../components/ButtonApp';
import ChatBubble from '../components/ChatBubble';
import ChatTextInput from '../components/ChatTextInput';
import ChatIndex from './ChatIndex';


const ADDRESS = require('../serverconn_conf/ServerAddress')
const ip = ADDRESS.IP
const port = ADDRESS.PORT


//Comprobar parámetro navigation
const ChatAdmin = ({route, navigation}) => {

  const {alias} = route.params;


  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    const response = await fetch('http://'+ip+':'+port+'/getChat', {
      method: 'POST',
      headers: {
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

  useEffect(() => {
    fetchData();
  }, []);



  const[message, setMessage] = useState('')
  //const[refreshList, setRefreshList] = useState(false);


  const sendMessage = async () => {

        if(message!=''){

          await fetch('http://'+ip+':'+port+'/sendMessage', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({
              alias: alias,
              user: 'admin',
              message: message,
          }),
      });

      fetchData();

      //setRefreshList(!refreshList)
      setMessage('')
    }
  }
  
      return(


          <SafeAreaView style={styles.container}>


            {loading && <Text style={styles.loading}>Cargando...</Text>}

            {data &&

              <FlatList 
              
              data={data} 
              renderItem={({item}) => <ChatBubble user={item[0]} value={item[1]}/>} 
              //extraData={refreshList}
              contentContainerStyle={styles.view}>


              </FlatList>
            }
                   

            <ChatTextInput ph={'Escriba su consulta'} val={message} setVal={setMessage} onPress={sendMessage}/>
  
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
