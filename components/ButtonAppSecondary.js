import React, {useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';


const ButtonAppSecondary = ({title, onPress, button_style, text_style}) => {

  return (
      <TouchableOpacity style={button_style} onPress={onPress}>
        <Text style={text_style}>{title}</Text>
      </TouchableOpacity>
  )
}
export default ButtonAppSecondary;

const styles = StyleSheet.create({

  button: {
    alignItems: 'center',
    alignSelf:'center',
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