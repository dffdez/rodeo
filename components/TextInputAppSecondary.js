import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, TextInput, View} from 'react-native';


const TextInputAppSecondary = ({ph, val, setVal, secure, style, inputmod}) => {
    return(

                <TextInput 
                style={style}
                value={val}
                placeholder={ph} 
                onChangeText={setVal} 
                inputMode={inputmod}
                secureTextEntry={secure}
                />

    )
}
export default TextInputAppSecondary;


const styles = StyleSheet.create({
  
    inputtext: {
      height: 50,
      width: '80%',
      borderColor: 'grey',
      borderWidth: 1,
      borderRadius: 10,
      marginTop:20,
      paddingLeft: '4%',
      alignSelf: 'center',

    },
  
   });