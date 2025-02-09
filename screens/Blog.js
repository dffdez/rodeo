import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, Platform, View, Keyboard, TouchableOpacity, FlatList, SafeAreaView, Image, Modal, KeyboardAvoidingView, TouchableWithoutFeedback, Alert, Dimensions} from 'react-native';

import TextInputApp from '../components/TextInputApp';
import ButtonApp from '../components/ButtonApp';
import ButtonAppSecondary from '../components/ButtonAppSecondary';
import { WebView } from 'react-native-webview';
import { Video } from 'expo-av';
import Ionicons from 'react-native-vector-icons/Ionicons';

import {useAuth} from '../context/AuthContext';


const ADDRESS = require('../serverconn_conf/ServerAddress')
const ip = ADDRESS.IP
const port = ADDRESS.PORT



const BlogAdmin = ({navigation}) => {

  const { authState, jwtToken} = useAuth();


  const [data, setData] = useState([]);
  const [dataVideo, setDataVideo] = useState([]);
  const [dataDocuments, setDataDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  const[posts, setPosts] = useState(true);
  const[videos, setVideos] = useState(false);
  const[files, setFiles] = useState(false);

  const [filenameDownload, setFilenameDownload] = useState('');
  const [modalDownloadVisible, setModalDownloadVisible] = useState(false);


  const fetchData = async () => {

    const response = await fetch('https://'+ip+'/getPosts', {
      method: 'GET',
      headers: {
                'Authorization': `Bearer ${jwtToken}`,
      },
  });

    const data = await response.json();
    setData(data);
    setLoading(false);
  }

  const getVideos = async () => {

    const response = await fetch('https://'+ip+'/getVideos', {
      method: 'GET',
      headers: {
                'Authorization': `Bearer ${jwtToken}`,
      },
  }); 
    const data = await response.json();
    setDataVideo(data);
    setLoading(false);
  }

  const getFiles = async () => {

    const response = await fetch('https://'+ip+'/getDocuments', {
      method: 'GET',
      headers: {
                'Authorization': `Bearer ${jwtToken}`,
      },
  });  
    const data = await response.json();
    setDataDocuments(data);
    setLoading(false);
  }

  useEffect(() => {
    fetchData();
  }, []);

  const documentAlert = (filename) => {

    Alert.alert('Información', 'Está a punto de descargar el archivo. ¿Desea continuar?', [
      {
        text: 'Cancelar'
      },
      {text: 'OK', onPress: () => documentDownload(filename)
      },
    ]);

  }

  const documentDownload = (filename) => {
    setFilenameDownload(filename)
    setModalDownloadVisible(true)
    //setModalDownloadVisible(false)
  };

  const showScreen = async (screen) => {

    if (screen == 'post') {
      fetchData()
      setPosts(true)   
      setVideos(false)
      setFiles(false) 

    } else if (screen == 'video') {
      getVideos()
      setPosts(false)   
      setVideos(true)
      setFiles(false)       
      
    } else if (screen == 'documents') {
      getFiles()
      setPosts(false)   
      setVideos(false)
      setFiles(true) 

    }
  }

      return(
    <SafeAreaView style={styles.container}>

      <Modal animationType="slide" transparent={true} visible={modalDownloadVisible}>

        <View style={styles.container}>
          <WebView 
            source={{ uri: 'https://'+ip+'/getBlogDocument/'+filenameDownload}} 
            //source={{ uri: `https://docs.google.com/gview?embedded=true&url=${'https://'+ip+'/getBlogDocument/'+filenameDownload}`}} 
            style={styles.webview} 
            javaScriptEnabled={true}
            startInLoadingState={true}
            //allowFileAccess={true}
            
          />
          <ButtonAppSecondary button_style={styles.button} text_style={styles.buttonText} title={'Volver'} onPress={() => setModalDownloadVisible(false) }/>
          <View style={styles.emptyspace} />

        </View>

      </Modal>

          <TouchableOpacity style={styles.listWrapperDone}>

            <TouchableOpacity style={styles.rowIndex} onPress={() => showScreen('post')} >
              <Text style={styles.rowDone}>Posts</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.rowIndex} onPress={() => showScreen('video')} >
              <Text style={styles.rowDone}>Videos</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.rowIndex} onPress={() => showScreen('documents')} >
              <Text style={styles.rowDone}>Archivos</Text>
            </TouchableOpacity>

          </TouchableOpacity> 


      {loading && <Text style={styles.loading}>Cargando...</Text>}

      {data && posts && jwtToken && authState.authenticated &&

          <FlatList 
          contentContainerStyle={styles.view}
          data={data} 
          //extraData={refreshList}

          renderItem={({item}) => 
            <TouchableOpacity style={styles.listWrapper}> 
              <Text style={styles.title}>{item[0]}</Text>
              <WebView source={{uri: 'https://'+ip+'/getBlogImage/'+item[0], 
                headers: {'Authorization': `Bearer ${jwtToken}`} }} style={styles.imageblog} />

              <Text style={styles.article}>{item[1]}</Text>
            </TouchableOpacity> 
          }
          />

      }


      {dataVideo && videos && jwtToken && authState.authenticated &&

      <FlatList 
          contentContainerStyle={styles.view}
          data={dataVideo} 
          //extraData={refreshList}

          renderItem={({item}) => 
            <TouchableOpacity style={styles.listWrapper}> 
              <Text style={styles.title}>{item[0]}</Text>
              <Video 
                source={{uri: 'https://'+ip+'/getBlogVideo/'+item[0], 
              headers: {'Authorization': `Bearer ${jwtToken}`}
                }}
                useNativeControls   // Controles nativos del reproductor
                resizeMode="contain"  // Cómo se ajusta el video al tamaño
                //isLooping  // Reproduce en bucle
                style={styles.imageblog} />
            </TouchableOpacity> 
          }
          />




      }


      {dataDocuments && files && jwtToken && authState.authenticated &&

        <FlatList 
          contentContainerStyle={styles.view}
          data={dataDocuments} 
          //extraData={refreshList}

          renderItem={({item}) => 
            <TouchableOpacity style={styles.listWrapperFiles} onPress={() => documentAlert(item[0])}> 
              <Ionicons name={'document-text'} size={'200'} style={styles.row} />
              <Text style={styles.row}>{item[0]}</Text>
            </TouchableOpacity> 
          }
          />

      }


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
    //flexGrow: 1,
    backgroundColor: '#fff',
    //alignItems: 'flex-start',
    //justifyContent: 'center',
    //marginTop: '20%',
    //marginLeft: '10%'
    flexDirection:'column-reverse'
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
      fontWeight: 'bold',
      paddingHorizontal: 20,
      
    },

    article: {
      backgroundColor: '#fff',
      //flex: 1,
      marginBottom: 40,
      fontSize: 15,
      paddingHorizontal: 20,
    },

    imageblog: {
      alignSelf: 'center',
      marginTop: 10,
      marginBottom: 10,
      width: 350,
      height: 300,
      backgroundColor: 'black',
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

    listWrapperDone: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      borderBottomWidth: 1,
      marginBottom: 20,

    },

    listWrapperFiles: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      borderBottomWidth: 0.5,
    },

    rowDone: {
      backgroundColor: '#fff',
      //flex: 1,
      marginBottom: 10,
      marginTop: 10,
      paddingHorizontal: 10,
      fontSize: 15,
      fontWeight: 'bold',
    },

    rowIndex: {
      backgroundColor: '#fff',
      flex: 1,
      marginBottom: 5,
      marginTop:5,
      paddingHorizontal: 10,
      fontSize: 15,
      fontWeight: 'bold',
      alignItems: 'center'
    },

    webview: {
      width: Dimensions.get('window').width,
      height: Dimensions.get('window').height,
    },

    row: {
      backgroundColor: '#fff',
      //flex: 1,
      marginBottom: 20,
      marginTop:20,
      fontSize: 20,
      paddingHorizontal: 20,
      verticalAlign: 'middle'
    },


  
   });


