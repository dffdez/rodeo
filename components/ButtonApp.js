import React, {useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';


const ButtonApp = ({title, onPress}) => {

  return (
      <TouchableOpacity style={styles.button} onPress={onPress}>
        <Text style={styles.text}>{title}</Text>
      </TouchableOpacity>
  )
}
export default ButtonApp;

const styles = StyleSheet.create({

  button: {
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#5ba4fc',
    height: 50,
    width: '80%',
    borderRadius: 10,
    marginTop:20,
  },

  text: {
    color: 'white'
  },
});