import React, {useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, Image} from 'react-native';
import {useAuth} from '../context/AuthContext';



const Stoplight = ({style, state, onpress}) => {
    


  return (

    <TouchableOpacity style={style} >
        <TouchableOpacity onPress={onpress} style={{
          alignSelf: 'center',
          justifyContent: 'center',
          width: 40,
          height: 40,
          backgroundColor: state,
          borderRadius: 10
      }} />
    </TouchableOpacity> 

  )
}
export default Stoplight;

const styles = StyleSheet.create({

    stoplight: {
        alignSelf: 'center',
        justifyContent: 'center',
        width: 40,
        height: 40,
        backgroundColor: '#f85',
        borderRadius: 10
        
      },
      
});