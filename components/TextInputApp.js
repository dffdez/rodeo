import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, TextInput, View} from 'react-native';


const TextInputApp = ({ph, val, setVal, secure}) => {
    return(

                <TextInput 
                style={styles.inputtext}
                placeholder={ph} 
                onChangeText={setVal} 
                secureTextEntry={secure}
                />

    )
}
export default TextInputApp;


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