import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, TextInput, View, ScrollView, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, Platform, SafeAreaView, Alert} from 'react-native';

import ButtonApp from '../../components/ButtonApp';

import {useAuth} from '../../context/AuthContext';


const ADDRESS = require('../../serverconn_conf/ServerAddress')
const ip = ADDRESS.IP
const port = ADDRESS.PORT



const TrackConfRef = ({route, navigation}) => {

  const { authState, jwtToken } = useAuth();


  const {simbolo} = route.params;
  const {nombre} = route.params;


  const[e_apx_rsi_min, set_e_apx_rsi_min] = useState('')
  const[e_apx_rsi_max, set_e_apx_rsi_max] = useState('')
  const[e_apx_stoch_min, set_e_apx_stoch_min] = useState('')
  const[e_apx_stoch_max, set_e_apx_stoch_max] = useState('')
  const[e_ent_rsi_min, set_e_ent_rsi_min] = useState('')
  const[e_ent_rsi_max, set_e_ent_rsi_max] = useState('')
  const[e_ent_stoch_min, set_e_ent_stoch_min] = useState('')
  const[e_ent_stoch_max, set_e_ent_stoch_max] = useState('')
  const[stp_apx_stoch_min, set_stp_apx_stoch_min] = useState('')
  const[stp_apx_stoch_max, set_stp_apx_stoch_max] = useState('')
  const[stp_sal_stoch_min, set_stp_sal_stoch_min] = useState('')
  const[ssl_apx_value_min, set_ssl_apx_value_min] = useState('')
  const[ssl_apx_value_max, set_ssl_apx_value_max] = useState('')
  const[ssl_sal_value_min, set_ssl_sal_value_min] = useState('')


  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);



  const fetchData = async () => {


    const response = await fetch('https://'+ip+'/getLimitsRef', {
      method: 'POST',
      headers: {
          'Authorization': `Bearer ${jwtToken}`,
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({
          simbolo: simbolo,
      }),
  });

    const data = await response.json();
    setData(data);
    setLoading(false);

    set_e_apx_rsi_min(data[1])
    set_e_apx_rsi_max(data[2])
    set_e_apx_stoch_min(data[3])
    set_e_apx_stoch_max(data[4])
    set_e_ent_rsi_min(data[5])
    set_e_ent_rsi_max(data[6])
    set_e_ent_stoch_min(data[7])
    set_e_ent_stoch_max(data[8])
    set_stp_apx_stoch_min(data[9])
    set_stp_apx_stoch_max(data[10])
    set_stp_sal_stoch_min(data[11])
    set_ssl_apx_value_min(data[12])
    set_ssl_apx_value_max(data[13])
    set_ssl_sal_value_min(data[14])

  }

  useEffect(() => {
    fetchData();
  }, []);


  
  const validateChanges = async () => {

    setSaving(true)
    
    if (!isNaN(+e_ent_rsi_max) && !isNaN(+e_apx_rsi_max) && !isNaN(+e_ent_stoch_max) && !isNaN(+e_apx_stoch_max) &&
    !isNaN(+e_ent_rsi_min) && !isNaN(+e_ent_rsi_max) && !isNaN(+e_ent_stoch_min) && !isNaN(+e_ent_stoch_max) && 
    !isNaN(+stp_apx_stoch_min) && !isNaN(+stp_apx_stoch_max) && !isNaN(+stp_apx_stoch_max) && !isNaN(+ssl_apx_value_min) &&
    !isNaN(+ssl_apx_value_max) && !isNaN(+ssl_apx_value_max) && 
    
    e_ent_rsi_max != '' && e_apx_rsi_max != '' && e_ent_stoch_max != '' && e_apx_stoch_max != '' &&
    e_ent_rsi_min != '' && e_ent_rsi_max != '' && e_ent_stoch_min != '' && e_ent_stoch_max != '' && 
    stp_apx_stoch_min != '' && stp_apx_stoch_max != '' && stp_apx_stoch_max != '' && ssl_apx_value_min != '' &&
    ssl_apx_value_max != '' && ssl_apx_value_max != '') {


      if ( +e_ent_rsi_max <= +e_apx_rsi_max && +e_ent_rsi_min <= +e_ent_rsi_max && +e_ent_stoch_max <= +e_apx_stoch_max && +e_ent_stoch_min <= +e_ent_stoch_max &&
         +stp_apx_stoch_min <= +stp_apx_stoch_max && +ssl_apx_value_min <= +ssl_apx_value_max) {


            await fetch('https://'+ip+'/setLimitsRef', {
              method: 'POST',
              headers: {
                  'Authorization': `Bearer ${jwtToken}`,
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                simbolo: simbolo,
                e_apx_rsi_min: e_ent_rsi_max,
                e_apx_rsi_max: e_apx_rsi_max,
                e_apx_stoch_min: e_ent_stoch_max,
                e_apx_stoch_max: e_apx_stoch_max,
                e_ent_rsi_min: e_ent_rsi_min,
                e_ent_rsi_max: e_ent_rsi_max,
                e_ent_stoch_min: e_ent_stoch_min,
                e_ent_stoch_max: e_ent_stoch_max,
                stp_apx_stoch_min: stp_apx_stoch_min,
                stp_apx_stoch_max: stp_apx_stoch_max,
                stp_sal_stoch_min: stp_apx_stoch_max,
                ssl_apx_value_min: ssl_apx_value_min,
                ssl_apx_value_max: ssl_apx_value_max,
                ssl_sal_value_min: ssl_apx_value_max
              }),
          });

            navigation.goBack() 

      } else {
        setSaving(false)

        Alert.alert('Error en los datos', '\nEl valor mínimo no puede ser mayor que el valor máximo.')
        //\n\nEl valor máximo no puede ser menor que el valor mínimo.
      }

  } else {
    setSaving(false)

    Alert.alert('Error en los datos', 'Los valores introducidos debe ser números. \n\nNo puede haber valores en blanco.\n\nSe deben utilizar puntos en lugar de comas.')
  }

  }

  const dismissChanges = () => {

    set_e_apx_rsi_min('')
    set_e_apx_rsi_max('')
    set_e_apx_stoch_min('')
    set_e_apx_stoch_max('')
    set_e_ent_rsi_min('')
    set_e_ent_rsi_max('')
    set_e_ent_stoch_min('')
    set_e_ent_stoch_max('')
    set_stp_apx_stoch_min('')
    set_stp_apx_stoch_max('')
    set_stp_sal_stoch_min('')
    set_ssl_apx_value_min('')
    set_ssl_apx_value_max('')
    set_ssl_sal_value_min('')


    navigation.goBack()

  }

  
      return(


    <SafeAreaView style={styles.container}>

{loading && <Text style={styles.loading}>Cargando...</Text>}

{saving && <Text style={styles.loading}>Guardando cambios...</Text>}


{data &&

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>

        <ScrollView contentContainerStyle={styles.view} >

              <View style={styles.emptyspace} />

              <View >
                <Text style={styles.titleStock}>{simbolo}</Text>
              </View>              

              <View style={styles.emptyspace} />
              <View style={styles.emptyspace} />


              <View style={styles.listTitle}>
                <Text style={styles.title1}>Operación: </Text>
                <Text style={styles.title2}>Entrada</Text>
              </View>
              <View style={styles.listTitle}>
                <Text style={styles.title1}>Estado: </Text>
                <Text style={styles.title2}>Aproximación</Text>
              </View>

              <View style={styles.listWrapper}>
                <Text style={styles.row}>RSI min</Text>
                <Text style={styles.row}>RSI max</Text>
                <Text style={styles.row}>Stoch min</Text>
                <Text style={styles.row}>Stoch max</Text>
              </View>

              <View style={styles.listWrapper}>
                <Text style={styles.fixedfield}>{e_ent_rsi_max}</Text>
                <TextInput style={(!isNaN(+e_apx_rsi_max) && e_apx_rsi_max != '') ? styles.inputfield : styles.inputfieldError} value={e_apx_rsi_max} onChangeText={set_e_apx_rsi_max} inputMode='decimal'/>
                <Text style={styles.fixedfield}>{e_ent_stoch_max}</Text>
                <TextInput style={(!isNaN(+e_apx_stoch_max) && e_apx_stoch_max != '') ? styles.inputfield : styles.inputfieldError} value={e_apx_stoch_max} onChangeText={set_e_apx_stoch_max} inputMode='decimal'/>
              </View>

              <View style={styles.emptyspace} />

              

              <View style={styles.listTitle}>
                <Text style={styles.title1}>Operación: </Text>
                <Text style={styles.title2}>Entrada</Text>
              </View>
              <View style={styles.listTitle}>
                <Text style={styles.title1}>Estado: </Text>
                <Text style={styles.title2}>Entrada</Text>
              </View>

              <View style={styles.listWrapper}>
                <Text style={styles.row}>RSI min</Text>
                <Text style={styles.row}>RSI max</Text>
                <Text style={styles.row}>Stoch min</Text>
                <Text style={styles.row}>Stoch max</Text>
              </View>

              <View style={styles.listWrapper}>
                <TextInput style={(!isNaN(+e_ent_rsi_min) && e_ent_rsi_min != '') ? styles.inputfield : styles.inputfieldError} value={e_ent_rsi_min} onChangeText={set_e_ent_rsi_min} inputMode='decimal'/>
                <TextInput style={(!isNaN(+e_ent_rsi_max) && e_ent_rsi_max != '') ? styles.inputfield : styles.inputfieldError} value={e_ent_rsi_max} onChangeText={set_e_ent_rsi_max} inputMode='decimal'/>
                <TextInput style={(!isNaN(+e_ent_stoch_min) && e_ent_stoch_min != '') ? styles.inputfield : styles.inputfieldError} value={e_ent_stoch_min} onChangeText={set_e_ent_stoch_min} inputMode='decimal'/>
                <TextInput style={(!isNaN(+e_ent_stoch_max) && e_ent_stoch_max != '') ? styles.inputfield : styles.inputfieldError} value={e_ent_stoch_max} onChangeText={set_e_ent_stoch_max} inputMode='decimal'/>
              </View>

              <View style={styles.emptyspace} />

              

              <View style={styles.listTitle}>
                <Text style={styles.title1}>Operación: </Text>
                <Text style={styles.title2}>Salida "take profit"</Text>
              </View>
              <View style={styles.listTitle}>
                <Text style={styles.title1}>Estado: </Text>
                <Text style={styles.title2}>Aproximación</Text>
              </View>

              <View style={styles.listWrapper}>
                <Text style={styles.row}>RSI min</Text>
                <Text style={styles.row}>RSI max</Text>
                <Text style={styles.row}>Stoch min</Text>
                <Text style={styles.row}>Stoch max</Text>
              </View>

              <View style={styles.listWrapper}>
                <Text style={styles.fixedfield}>-</Text>
                <Text style={styles.fixedfield}>-</Text>
                <TextInput style={(!isNaN(+stp_apx_stoch_min) && stp_apx_stoch_min != '') ? styles.inputfield : styles.inputfieldError} value={stp_apx_stoch_min} onChangeText={set_stp_apx_stoch_min} inputMode='decimal'/>
                <TextInput style={(!isNaN(+stp_apx_stoch_max) && stp_apx_stoch_max != '') ? styles.inputfield : styles.inputfieldError} value={stp_apx_stoch_max} onChangeText={set_stp_apx_stoch_max} inputMode='decimal'/>
              </View>

              <View style={styles.emptyspace} />

              

              <View style={styles.listTitle}>
                <Text style={styles.title1}>Operación: </Text>
                <Text style={styles.title2}>Salida "take profit"</Text>
              </View>
              <View style={styles.listTitle}>
                <Text style={styles.title1}>Estado: </Text>
                <Text style={styles.title2}>Salida</Text>
              </View>

              <View style={styles.listWrapper}>
                <Text style={styles.row}>RSI min</Text>
                <Text style={styles.row}>RSI max</Text>
                <Text style={styles.row}>Stoch min</Text>
                <Text style={styles.row}>Stoch max</Text>
              </View>

              <View style={styles.listWrapper}>
                <Text style={styles.fixedfield}>-</Text>
                <Text style={styles.fixedfield}>-</Text>
                <Text style={styles.fixedfield}>{stp_apx_stoch_max}</Text>
                <Text style={styles.fixedfield}>-</Text>
              </View>

              <View style={styles.emptyspace} />
              <View style={styles.emptyspace} />

              

              <View style={styles.listTitle}>
                <Text style={styles.title1}>Operación: </Text>
                <Text style={styles.title2}>Salida "stop loss"</Text>
              </View>
              <View style={styles.listTitle}>
                <Text style={styles.title1}>Estado: </Text>
                <Text style={styles.title2}>Aproximación</Text>
              </View>

              <View style={styles.listWrapper}>
                <Text style={styles.row}>Min</Text>
                <Text style={styles.row}>Max</Text>
              </View>


              <View style={styles.listWrapper}>
                <TextInput style={(!isNaN(+ssl_apx_value_min) && ssl_apx_value_min != '') ? styles.inputfield : styles.inputfieldError} value={ssl_apx_value_min} onChangeText={set_ssl_apx_value_min} inputMode='decimal'/>
                <TextInput style={(!isNaN(+ssl_apx_value_max) && ssl_apx_value_max != '') ? styles.inputfield : styles.inputfieldError} value={ssl_apx_value_max} onChangeText={set_ssl_apx_value_max} inputMode='decimal'/>
              </View>


              <View style={styles.emptyspace} />

              

              <View style={styles.listTitle}>
                <Text style={styles.title1}>Operación: </Text>
                <Text style={styles.title2}>Salida "stop loss"</Text>
              </View>
              <View style={styles.listTitle}>
                <Text style={styles.title1}>Estado: </Text>
                <Text style={styles.title2}>Salida</Text>
              </View>

              <View style={styles.listWrapper}>
                <Text style={styles.row}>Min</Text>
                <Text style={styles.row}>Max</Text>
              </View>

              <View style={styles.listWrapper}>
                <Text style={styles.fixedfield}>{ssl_apx_value_max}</Text>
                <Text style={styles.fixedfield}>-</Text>
              </View>


              <View style={styles.emptyspace} />

              <ButtonApp title={'Guardar cambios y Volver'} onPress={() => validateChanges()}/>
              <ButtonApp title={'Descartar y Volver'} onPress={() => dismissChanges() }/>


              <View style={styles.emptyspace} />




        </ScrollView>

      </TouchableWithoutFeedback>
          </KeyboardAvoidingView>

}

      </SafeAreaView>


  
      );
  };
  export default TrackConfRef;


  const styles = StyleSheet.create({

    emptyspace: {
      padding: 10,
    },

    container: {
      flex: 1,
      backgroundColor: '#fff',
      
    },

    loading: {
      //flexGrown: 1,
      alignSelf: 'center',
      justifyContent:'center',      
      backgroundColor: '#fff',

    },

    view: {
    flexGrow: 1,
    backgroundColor: '#fff',
    //alignItems: 'flex-start',
    //justifyContent: 'center',
    //marginTop: '20%',
    //marginLeft: '10%'
    },

    listWrapper: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      borderBottomWidth: 0.5,
    },

    listTitle: {
      flexDirection: 'row',
      //flexWrap: 'wrap',
      //borderBottomWidth: 0.5,
      //marginBottom: 40,
    },

    row: {
      backgroundColor: '#fff',
      borderWidth: 0.5,
      borderColor: 'black',
      flex: 1,
      fontSize: 15,
      textAlign:'center', 
      padding: 10,
    },

    titleStock: {
      fontSize: 20,
      textAlign: 'center', 
      padding: 2,
      backgroundColor: '#fff',

    },

    title1: {
      fontSize: 15,
      textAlign: 'left', 
      padding: 2,
      backgroundColor: '#fff',

    },

    title2: {
      fontSize: 15,
      textAlign: 'left', 
      padding: 2,
      backgroundColor: '#fff',
    },
    
    inputfield: {
      backgroundColor: '#fff',
      borderWidth: 0.5,
      borderColor: 'black',
      flex: 1,
      fontSize: 15,
      textAlign:'center', 
      padding: 10,
      borderRadius: 10,
    },

    inputfieldError: {
      backgroundColor: '#fff',
      borderWidth: 2,
      borderColor: 'red',
      flex: 1,
      fontSize: 15,
      textAlign:'center', 
      padding: 10,
      borderRadius: 10,
    },

    fixedfield: {
      backgroundColor: '#f5f5f5',
      borderWidth: 0.5,
      borderColor: 'black',
      flex: 1,
      fontSize: 15,
      textAlign:'center', 
      padding: 10,
    },
  
   });