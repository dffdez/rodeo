import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, Platform, View, Keyboard, TouchableOpacity, FlatList, SafeAreaView, Image, Modal, KeyboardAvoidingView, TouchableWithoutFeedback, Alert} from 'react-native';

import TextInputApp from '../components/TextInputApp';
import ButtonApp from '../components/ButtonApp';
import ButtonAppSecondary from '../components/ButtonAppSecondary';


const ADDRESS = require('../serverconn_conf/ServerAddress')
const ip = ADDRESS.IP
const port = ADDRESS.PORT



const BlogAdmin = ({navigation}) => {


  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    const response = await fetch('http://'+ip+':'+port+'/getBlog');
      
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
          contentContainerStyle={styles.view}
          data={data} 
          //extraData={refreshList}

          renderItem={({item}) => 
            <TouchableOpacity style={styles.listWrapper}> 
              <Text style={styles.title}>{item[0]}</Text>
              <Text style={styles.article}>{item[1]}</Text>
            </TouchableOpacity> 
          }
          />


      }


      <View style={styles.emptyspace} />



      </SafeAreaView>
  
      );
  };
  export default BlogAdmin;


  const styles = StyleSheet.create({

    emptyspace: {
      padding: 10,
    },

    loading: {
      //flexGrown: 1,
      alignSelf: 'center',
      justifyContent:'center',      
      backgroundColor: '#fff',

    },

    container: {
      flex: 1,
      backgroundColor: '#fff',

    },

    view: {
    flexGrow: 1,
    backgroundColor: '#fff',
    //alignItems: 'flex-start',
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
      flexDirection: 'column',
      //flexWrap: 'wrap',
      //borderBottomWidth: 0.5,
    },

    inputTitle: {
      fontSize: 20,
        alignItems: 'flex-end',
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

    inputText: {
      marginTop: 5,
      alignItems: 'center',
      height: 50,
      width: '85%',
      height: '50%',
      borderColor: 'grey',
      borderWidth: 1,
      borderRadius: 10,
      backgroundColor: 'white',
      paddingLeft: '4%',
      paddingRight: '4%',
    },

    title:{
      backgroundColor: '#fff',
      //flex: 1,
      marginBottom: 10,
      fontSize: 20,
      fontStyle: 'italic',
      paddingHorizontal: 10,
    },

    article: {
      backgroundColor: '#fff',
      //flex: 1,
      marginBottom: 40,
      fontSize: 15,
      paddingHorizontal: 10,
    },


  
   });


