import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, TextInput, View, Keyboard, TouchableOpacity, FlatList, SafeAreaView, Image, Modal, KeyboardAvoidingView, TouchableWithoutFeedback, Platform} from 'react-native';

import TextInputApp from '../components/TextInputApp';
import ButtonApp from '../components/ButtonApp';
import ButtonAppSecondary from '../components/ButtonAppSecondary';


const ADDRESS = require('../serverconn_conf/ServerAddress')
const ip = ADDRESS.IP
const port = ADDRESS.PORT


const BlogAdmin = ({navigation}) => {


  const[title, setTitle] = useState('')
  const[message, setMessage] = useState('')
  const[modalVisible, setModalVisible] = useState(false);
  const[modalEditVisible, setModalEditVisible] = useState(false);



  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    const response = await fetch('http://'+ip+':'+port+'/getBlog');
      
    const data = await response.json();
    setData(data);
    setLoading(false);

  }

  useEffect(() => {
    fetchData();
  }, []);



  const newPost = async () => {

    if (title!='' && message!=''){

        await fetch('http://'+ip+':'+port+'/newPost', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({
              title: title,
              message: message,
          }),
      });

      fetchData();

      setTitle('')
      setMessage('')
      setModalVisible(false)

    }
  }

  const editPost = (title, article) => {

    setTitle(title)
    setMessage(article)
    setModalEditVisible(true)

  }

  const dismissPost = () => {
    setTitle('')
    setMessage('')
    setModalEditVisible(false)
  }

  const modifyPost = async (title, article) => {

    await fetch('http://'+ip+':'+port+'/modifyPost', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({
          title: title,
          message: message,
      }),
  });

  fetchData();

  setTitle('')
  setMessage('')
  setModalEditVisible(false)

  }

  const deletePost = async (title, article) => {

    await fetch('http://'+ip+':'+port+'/deletePost', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({
              title: title,
          }),
      });

    fetchData();

    setTitle('')
    setMessage('')
    setModalEditVisible(false)

  }



  
      return(
    <SafeAreaView style={styles.container}>

      


      <Modal animationType="slide" transparent={true} visible={modalVisible}>

        <SafeAreaView style={styles.container}>

          <View style={styles.emptyspace} />
          <View style={styles.emptyspace} />
         

          
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={styles.modalview}>
                        <TextInput value={title} style={styles.inputTitle} onChangeText={setTitle} placeholder="Título" />
                        <TextInput value={message} style={styles.inputText} onChangeText={setMessage} placeholder="Texto de la publicación" multiline={true}/>

                        <ButtonAppSecondary button_style={styles.button} text_style={styles.buttonText} title={'Publicar'} onPress={() => newPost()}/>
                        <ButtonAppSecondary button_style={styles.button} text_style={styles.buttonText} title={'Descartar'} onPress={() => setModalVisible(false) }/>


                    </View>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>

        </SafeAreaView>
      </Modal>


      <Modal animationType="slide" transparent={true} visible={modalEditVisible}>

        <SafeAreaView style={styles.container}>

          <View style={styles.emptyspace} />
          <View style={styles.emptyspace} />
         

          
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={styles.modalview}>
                        <TextInput value={title} style={styles.inputTitle} onChangeText={setTitle} placeholder="Título" />
                        <TextInput value={message} style={styles.inputText} onChangeText={setMessage} placeholder="Texto de la publicación" multiline={true}/>

                        <ButtonAppSecondary button_style={styles.button} text_style={styles.buttonText} title={'Guardar cambios'} onPress={() => modifyPost(title, message)}/>
                        <ButtonAppSecondary button_style={styles.button} text_style={styles.buttonText} title={'Eliminar'} onPress={() => deletePost(title) }/>
                        <ButtonAppSecondary button_style={styles.button} text_style={styles.buttonText} title={'Descartar'} onPress={() => dismissPost()}/>


                    </View>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>

        </SafeAreaView>
      </Modal>


      


      {loading && <Text style={styles.loading}>Cargando...</Text>}

      {data &&

          <FlatList 
          contentContainerStyle={styles.view}
          data={data} 
          //extraData={refreshList}

          renderItem={({item}) => 
            <TouchableOpacity style={styles.listWrapper} onLongPress={() => editPost(item[0], item[1])}> 
              <Text style={styles.title}>{item[0]}</Text>
              <Text style={styles.article}>{item[1]}</Text>
            </TouchableOpacity> 
          }
          />


      }


      <ButtonApp title={'Nueva publicación'} onPress={() => setModalVisible(true)}/>

      <View style={styles.emptyspace} />



      </SafeAreaView>
  
      );
  };
  export default BlogAdmin;


  const styles = StyleSheet.create({

    emptyspace: {
      padding: 10,
    },

    loading: {
      //flexGrown: 1,
      alignSelf: 'center',
      justifyContent:'center',      
      backgroundColor: '#fff',

    },

    container: {
      flex: 1,
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

    modalview: {
      flexGrow: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      //justifyContent: 'center',
      //marginTop: '20%',
      //marginLeft: '10%'
      },

    listWrapper: {
      flexDirection: 'column',
      //flexWrap: 'wrap',
      //borderBottomWidth: 0.5,
    },

    inputTitle: {
      fontSize: 20,
        alignItems: 'flex-end',
        height: 50,
        width: '85%',
        borderColor: 'grey',
        borderWidth: 1,
        borderRadius: 10,
        backgroundColor: 'white',
        paddingLeft: '4%',
        paddingRight: '4%',
        marginStart: 5,

    },

    inputText: {
      marginTop: 5,
      alignItems: 'center',
      height: 50,
      width: '85%',
      height: '50%',
      borderColor: 'grey',
      borderWidth: 1,
      borderRadius: 10,
      backgroundColor: 'white',
      paddingLeft: '4%',
      paddingRight: '4%',
    },

    title:{
      backgroundColor: '#fff',
      //flex: 1,
      marginBottom: 10,
      fontSize: 20,
      fontStyle: 'italic',
      paddingHorizontal: 10,
      
    },

    article: {
      backgroundColor: '#fff',
      //flex: 1,
      marginBottom: 40,
      fontSize: 15,
      paddingHorizontal: 10,
    },

    button: {
      alignSelf: 'center',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#fff',
      borderColor: 'grey',
      height: 50,
      width: '80%',
      borderRadius: 10,
      borderWidth: 0.5,
      marginTop:20,
    },
  
    buttonText: {
      color: 'black'
    },

  
   });


