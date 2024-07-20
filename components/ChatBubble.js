import React, {useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';


const ChatBubble = ({user, value}) => {

  if(user=='admin'){
    return (
        <TouchableOpacity style={styles.admin}>
          <Text style={styles.text}>{value}</Text>
        </TouchableOpacity>
    )
  }
  else{
    return (
      <TouchableOpacity style={styles.user}>
        <Text style={styles.text}>{value}</Text>
      </TouchableOpacity>
  )
  }
}
export default ChatBubble;

const styles = StyleSheet.create({

  user: {
    alignSelf: 'flex-end',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#5ba4fc',
    height: 50,
    width: '80%',
    borderRadius: 10,
    marginTop:20,
  },

  admin: {
    alignSelf: 'flex-start',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'grey',
    height: 50,
    width: '80%',
    borderRadius: 10,
    marginTop:20,
  },

  text: {
    color: 'black',
    fontSize: 14,
    paddingLeft: '4%',
    paddingRight: '4%'
  },
});