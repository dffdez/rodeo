import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, FlatList, View, Image, TouchableOpacity, Modal, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, SafeAreaView, Platform } from 'react-native';


import ButtonAppSecondary from '../../components/ButtonAppSecondary';

import {useAuth} from '../../context/AuthContext';



import rodeoserver from '../../serverconn_conf/ServerAddress'
const ip = rodeoserver.IP
const port = rodeoserver.PORT



const ReferenceConfig = ({navigation}) => {


    return(
      <SafeAreaView style={styles.container}>


      <ButtonAppSecondary title={'NASDAQ'} button_style={styles.button} text_style={styles.text} onPress={() => navigation.navigate('TrackConfRef', {simbolo: 'NDAQ', nombre: 'NASDAQ'})}/>

      <ButtonAppSecondary title={'Bitcoin'} button_style={styles.button} text_style={styles.text} onPress={() => navigation.navigate('TrackConfRef', {simbolo: 'BTC', nombre: 'Bitcoin'})}/>

             


        </SafeAreaView>
    );
};
export default ReferenceConfig;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',

  },

  view: {
    //flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },

  logo: {
    width: '90%',
    height: '40%',
  },

  loading: {
    //flexGrown: 1,
    alignSelf: 'center',
    justifyContent:'center',      
    backgroundColor: '#fff',

  },

  modalview: {
    flexGrown: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },

  listWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderBottomWidth: 0.5,
  },

  row: {
    backgroundColor: '#fff',
    flex: 1,
    marginBottom: 20,
    marginTop:20,
    fontSize: 15,
    paddingHorizontal: 10,
  },

  button: {
    alignItems: 'center',
    alignSelf: 'center',
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

  username: {
    fontSize: 25,
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight:'bold',
    paddingLeft: '4%',
    paddingRight: '4%',
  },

  alias: {
    fontSize: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: '4%',
    paddingRight: '4%',
  },

  email: {
    fontSize: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: '4%',
    paddingRight: '4%',
  },

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

  inputtextError: {
    height: 50,
    width: '80%',
    borderColor: 'red',
    borderWidth: 1,
    borderRadius: 10,
    marginTop:20,
    paddingLeft: '4%',
    alignSelf: 'center',

  }

 });