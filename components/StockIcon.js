import React, {useState, useEffect} from 'react';
import {View, StyleSheet, Text, TouchableOpacity} from 'react-native';

//import { Image } from 'expo-image';
import { Image } from 'react-native';

import {useAuth} from '../context/AuthContext';
import { WebView } from 'react-native-webview';


const ADDRESS = require('../serverconn_conf/ServerAddress')
const ip = ADDRESS.IP
const port = ADDRESS.PORT


const StockIcon = ({name}) => {

  const { authState, jwtToken} = useAuth();



  return (

    <View style={styles.circle} >
        <WebView 
        source={{
          uri: 'https://'+ip+'/getIconStock/'+name, 
          headers: {'Authorization': `Bearer ${jwtToken}`}}} 
        style={styles.icon} />
    </View> 

  )
}
export default StockIcon;

const styles = StyleSheet.create({

    circle: {
        marginBottom:40,    
        alignSelf: 'center',
        justifyContent: 'center',
        width: 150,
        height: 150,
        overflow: 'hidden',
        borderRadius: 100,
        

      },

    icon: {
        //marginBottom:20,    
        alignSelf: 'center',
        justifyContent: 'center',
        borderRadius: 100,

        width: 150,
        height: 150,
        
        
        
      },
      
});