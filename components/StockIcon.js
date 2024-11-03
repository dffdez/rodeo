import React, {useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, Image} from 'react-native';
import {useAuth} from '../context/AuthContext';


const ADDRESS = require('../serverconn_conf/ServerAddress')
const ip = ADDRESS.IP
const port = ADDRESS.PORT


const StockIcon = ({name}) => {

  const { getUsername, jwtToken} = useAuth();



  return (

    <TouchableOpacity style={styles.circle}>
        <Image source={{uri: 'https://'+ip+'/getIconStock/'+name, 
                headers: {'Authorization': `Bearer ${jwtToken}`}}} style={styles.icon} />
    </TouchableOpacity> 

  )
}
export default StockIcon;

const styles = StyleSheet.create({

    circle: {
        marginBottom:20,    
        alignSelf: 'center',
        justifyContent: 'center',
        width: 150,
        height: 150,
      },

    icon: {
        marginBottom:20,    
        alignSelf: 'center',
        justifyContent: 'center',
        borderRadius: 100,

        width: 150,
        height: 150,
        
        
        
      },
      
});