import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, TextInput, View, TouchableOpacity, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, Platform} from 'react-native';


const ChatTextInput = ({ph, val, setVal, onPress}) => {
    return(


            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={styles.row}>
                        <TextInput value={val} style={styles.inputtext} onChangeText={setVal} placeholder={ph}/>
                        <TouchableOpacity style={styles.button} onPress={onPress} >
                            <Text style={styles.text}>Enviar</Text>
                        </TouchableOpacity>
                    </View>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>


    )
}
export default ChatTextInput;


const styles = StyleSheet.create({


    row:{
        flexDirection: 'row',
        alignSelf: 'center',
        flexWrap: 'wrap',

        
    },
  
    inputtext: {
        alignItems: 'center',
        height: 50,
        width: '75%',
        borderColor: 'grey',
        borderWidth: 1,
        borderRadius: 10,
        backgroundColor: 'white',
        paddingLeft: '4%',
        paddingRight: '4%'

    },

    button: {
        alignItems: 'center',
        justifyContent: 'center',
        marginStart: 5,
        backgroundColor: '#5ba4fc',
        height: 50,
        width: '20%',
        borderRadius: 50,

      },
      text: {
        color: 'white',
      }
  
   });