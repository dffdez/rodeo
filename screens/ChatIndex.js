import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { FlatList, StyleSheet, Text, TextInput, View, Button, TouchableOpacity, SafeAreaView, Platform} from 'react-native';


import Logo from '../assets/adaptive-icon.png';



const ADDRESS = require('../serverconn_conf/ServerAddress')
const ip = ADDRESS.IP
const port = ADDRESS.PORT



const ChatIndex = ({navigation}) => {

  const [data, setData] = useState([]);
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

      {loading && <Text style={styles.loading}>Cargando...</Text>}

      {data &&
      
        <FlatList 
        data={data} 
        renderItem={({item}) => 
          <TouchableOpacity style={styles.listWrapper} onPress={() => navigation.navigate('ChatAdmin', {alias: item[0]})}>
            <Text style={styles.row}>{item}</Text>
          </TouchableOpacity> 
        } 
        />
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

    row: {
      backgroundColor: '#fff',
      flex: 1,
      marginBottom: 20,
      marginTop:20,
      fontSize: 15,
      paddingHorizontal: 10,
    },

    loading: {
      //flexGrown: 1,
      alignSelf: 'center',
      justifyContent:'center',      
      backgroundColor: '#fff',

    },
  
   });