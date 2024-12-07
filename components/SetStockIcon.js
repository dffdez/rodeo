import React, {useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, Image} from 'react-native';
import {useAuth} from '../context/AuthContext';

import Ionicons from 'react-native-vector-icons/Ionicons';


const ADDRESS = require('../serverconn_conf/ServerAddress')
const ip = ADDRESS.IP
const port = ADDRESS.PORT


const SetStockIcon= ({ok, onpress}) => {

    


  return (

    <TouchableOpacity style={styles.circle} >
      {!ok ?
          <TouchableOpacity style={styles.iconnook} onPress={onpress}> 
            <Ionicons name={'image-outline'} size={100} style={styles.iconimage}/>
          </TouchableOpacity> 
        :
        <TouchableOpacity style={styles.iconok} onPress={onpress}> 
            <Ionicons name={'image'} size={100} style={styles.iconimage}/>
        </TouchableOpacity> 
      }
    </TouchableOpacity> 

  )
}
export default SetStockIcon;

const styles = StyleSheet.create({

    circle: {
        marginBottom:20,    
        alignSelf: 'center',
        justifyContent: 'center',
        width: 150,
        height: 150,
      },

    iconnook: {
        marginBottom:20,    
        alignSelf: 'center',
        justifyContent: 'center',
        borderRadius: 100,
        backgroundColor: '#be4939',
        width: 150,
        height: 150,
                verticalAlign: 'middle',
        alignItems: 'center',
        alignSelf: 'center',
        justifyContent: 'center'
      },

      iconok: {
        marginBottom:20,    
        alignSelf: 'center',
        justifyContent: 'center',
        borderRadius: 100,
        backgroundColor: '#88d5b9',
        width: 150,
        height: 150,
                verticalAlign: 'middle',
        alignItems: 'center',
        alignSelf: 'center',
        justifyContent: 'center'
      },

      iconimage: {
        //marginBottom:20,    
        alignSelf: 'center',
        justifyContent: 'center',
        verticalAlign: 'middle',
        alignItems: 'center'

        
      },
      
});