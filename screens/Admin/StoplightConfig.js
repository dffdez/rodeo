import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, FlatList, View, Image, TouchableOpacity, Modal, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, SafeAreaView, Platform } from 'react-native';

import ButtonAppSecondary from '../../components/ButtonAppSecondary';
import { ColorPicker } from 'react-native-color-picker';
import Slider from '@react-native-community/slider';

import {useAuth} from '../../context/AuthContext';


import rodeoserver from '../../serverconn_conf/ServerAddress'
const ip = rodeoserver.IP
const port = rodeoserver.PORT



const Stoplighconfig = ({navigation}) => {

    const { jwtToken } = useAuth();


    const[modalStoplightVisible, setModalStoplightVisible] = useState(false);

 
    const[neutral, setNeutral] = useState('');
    const[ent_apx, setEntApx] = useState('');
    const[ent_ent, setEntEnt] = useState('');
    const[sal_tp_apx, setTpApx] = useState('');
    const[sal_tp_sal, setTpSal] = useState('');
    const[sal_sl_apx, setStApx] = useState('');
    const[sal_sl_sal, setStSal] = useState('');

    const [selector, setSelector] = useState('');
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);


    const fetchData = async () => {

  
      const response = await fetch('http://'+ip+':'+port+'/getStoplight', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${jwtToken}`,
        },
    });

      const data = await response.json();
      setData(data);
      setLoading(false);   
      
      setNeutral(data[0])
      setEntApx(data[1])
      setEntEnt(data[2])
      setTpApx(data[3])
      setTpSal(data[4])
      setStApx(data[5])
      setStSal(data[6])

    }
  
    useEffect(() => {
      fetchData();
    }, []);

    const savePickedColors = async () => {

  
      await fetch('http://'+ip+':'+port+'/setStoplight', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${jwtToken}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            neutral: neutral,
            ent_apx: ent_apx,
            ent_ent: ent_ent,
            sal_tp_apx: sal_tp_apx,
            sal_tp_sal: sal_tp_sal,
            sal_sl_apx: sal_sl_apx,
            sal_sl_sal: sal_sl_sal,
        }),
    });  
  
    navigation.goBack()
    }

    // Save the selected button and show modal
    const configColor = (selector) => {
      setSelector(selector)
      setModalStoplightVisible(true)
    }

    const setColor = (pickedColor) => {

      if (selector == 'Neutro')
          setNeutral(pickedColor)
      if (selector == 'Entrada aproximación')
          setEntApx(pickedColor)
      if (selector == 'Entrada')
          setEntEnt(pickedColor)
      if (selector =='Take profit aproximación')
          setTpApx(pickedColor)
      if (selector == 'Take profit salida')
          setTpSal(pickedColor)
      if (selector == 'Stop loss aproximación')
          setStApx(pickedColor)
      if (selector == 'Stop loss salida')
          setStSal(pickedColor)
      
      setModalStoplightVisible(false)
    }

    const getOldColor = () => {

    if (selector == 'Neutro')
        return neutral
    if (selector == 'Entrada aproximación')
        return ent_apx
    if (selector == 'Entrada')
        return ent_ent
    if (selector =='Take profit aproximación')
        return sal_tp_apx
    if (selector == 'Take profit salida')
        return sal_tp_sal
    if (selector == 'Stop loss aproximación')
        return sal_sl_apx
    if (selector == 'Stop loss salida')
        return sal_sl_sal

    }


    return(
      
      <SafeAreaView style={styles.container}>

        <Modal animationType="slide" transparent={false} visible={modalStoplightVisible}>
          <SafeAreaView style={styles.view}> 

            <Text>{selector}</Text>
            </SafeAreaView>

            <ColorPicker sliderComponent={Slider} oldColor={getOldColor()} onColorSelected={color => setColor(color)} style={{flex: 3}}/>

            <SafeAreaView style={styles.view}> 

            <ButtonAppSecondary title={'Descartar'} button_style={styles.button} text_style={styles.text} onPress={() => setModalStoplightVisible(false)}/>

          </SafeAreaView>
        </Modal>

        {loading && <Text style={styles.loading}>Cargando...</Text>}

        {data &&

        <SafeAreaView style={styles.modalcontainer}> 

            <ButtonAppSecondary title={'Neutro'} button_style={styles.button} text_style={styles.text} onPress={() => configColor('Neutro')}/>
            <ButtonAppSecondary title={'Entrada aproximación'} button_style={styles.button} text_style={styles.text} onPress={() => configColor('Entrada aproximación')}/>
            <ButtonAppSecondary title={'Entrada'} button_style={styles.button} text_style={styles.text} onPress={() => configColor('Entrada')}/>
            <ButtonAppSecondary title={'Take profit aproximación'} button_style={styles.button} text_style={styles.text} onPress={() => configColor('Take profit aproximación')}/>
            <ButtonAppSecondary title={'Take profit salida'} button_style={styles.button} text_style={styles.text} onPress={() => configColor('Take profit salida')}/>
            <ButtonAppSecondary title={'Stop loss aproximación'} button_style={styles.button} text_style={styles.text} onPress={() => configColor('Stop loss aproximación')}/>
            <ButtonAppSecondary title={'Stop loss salida'} button_style={styles.button} text_style={styles.text} onPress={() => configColor('Stop loss salida')}/>
            <ButtonAppSecondary title={'Guardar cambios'} button_style={styles.button} text_style={styles.text} onPress={() => savePickedColors()}/>

        </SafeAreaView>

        }

        </SafeAreaView>
    );
};
export default Stoplighconfig;


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