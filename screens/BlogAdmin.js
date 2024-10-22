import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, TextInput, View, Keyboard, TouchableOpacity, FlatList, SafeAreaView, Image, Modal, KeyboardAvoidingView, TouchableWithoutFeedback, Platform, Alert, Dimensions } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { WebView } from 'react-native-webview';
import * as DocumentPicker from 'expo-document-picker';
import { Video } from 'expo-av';





import TextInputApp from '../components/TextInputApp';
import ButtonApp from '../components/ButtonApp';
import ButtonAppSecondary from '../components/ButtonAppSecondary';
import Ionicons from 'react-native-vector-icons/Ionicons';


const ADDRESS = require('../serverconn_conf/ServerAddress')
const ip = ADDRESS.IP
const port = ADDRESS.PORT


const BlogAdmin = ({navigation}) => {


  const[title, setTitle] = useState('')
  const[message, setMessage] = useState('')
  const [selectedImage, setSelectImage] = useState(null);
  const [isSelectedImage, setIsSelectedImage] = useState(false);
  const [selectedDocument, setSelectDocument] = useState(null);
  const [isSelectedDocument, setIsSelectedDocument] = useState(false);
  const [selectedVideo, setSelectVideo] = useState(null);
  const [isSelectedVideo, setIsSelectedVideo] = useState(false);


  const[modalPostVisible, setModalPostVisible] = useState(false);
  const[modalEditPostVisible, setModalPostEditVisible] = useState(false);
  const[modalVideoVisible, setModalVideoVisible] = useState(false);
  const[modalEditVideoVisible, setModalVideoEditVisible] = useState(false);  
  const[modalFileVisible, setModalFileVisible] = useState(false);
  const[modalEditFileVisible, setModalFileEditVisible] = useState(false);

  const[posts, setPosts] = useState(true);
  const[videos, setVideos] = useState(false);
  const[files, setFiles] = useState(false);

  const [data, setData] = useState([]);
  const [dataVideo, setDataVideo] = useState([]);
  const [dataDocuments, setDataDocuments] = useState([]);

  const [filenameDownload, setFilenameDownload] = useState([]);
  const [modalDownloadVisible, setModalDownloadVisible] = useState([]);




  const [loading, setLoading] = useState(true);


  const fetchData = async () => { 
    const response = await fetch('http://'+ip+':'+port+'/getPosts');
      
    const data = await response.json();
    setData(data);
    setLoading(false);
  }

  const getVideos = async () => {
    const response = await fetch('http://'+ip+':'+port+'/getVideos'); 
    const data = await response.json();
    setDataVideo(data);
    setLoading(false);
  }

  const getFiles = async () => {
    const response = await fetch('http://'+ip+':'+port+'/getDocuments');  
    const data = await response.json();
    setDataDocuments(data);
    setLoading(false);
  }

  useEffect(() => {
    fetchData();
  }, []);


  const newPost = async () => {

    if (title!='' && message!='' && isSelectedImage){

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
      
      if(isSelectedImage == true){

        const formData = new FormData();
        formData.append(
          'image',
          {
            uri: selectedImage,
            name: title+'.jpg',
            type: 'image/jpg',
          }
        )
        await fetch('http://'+ip+':'+port+'/newImage', {
          method: 'POST',
          body: formData,
  
      });
  
      }

      fetchData();
      setTitle('')
      setMessage('')
      setIsSelectedImage(false)
      handleSetModalVisible(false)
    } else {

    Alert.alert('Información', 'La publicación debe incluir título, texto e imagen.')
    }
  }


  const newVideo = async () => {

    if (title!='' && isSelectedVideo){

        await fetch('http://'+ip+':'+port+'/newBlogVideo', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({
              title: title,
          }),
      });
      
      if(isSelectedVideo == true){

        const formData = new FormData();
        formData.append(
          'video',
          {
            uri: selectedVideo,
            name: title+'.mp4',
            type: 'video/mp4',
          }
        )
        await fetch('http://'+ip+':'+port+'/newVideo', {
          method: 'POST',
          body: formData,
  
      });
  
      }

      getVideos();
      setTitle('')
      setMessage('')
      setIsSelectedVideo(false)
      handleSetModalVisible(false)
    } else {

    Alert.alert('Información', 'La publicación debe incluir título y video.')
    }
  }


  const newDocument = async () => {

    if (title!='' && isSelectedDocument){

        await fetch('http://'+ip+':'+port+'/newBlogDocument', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({
              title: title,
          }),
      });
      

        const formData = new FormData();
        formData.append(
          'document',
          {
            uri: selectedDocument,
            name: title+'.pdf',
            type: 'application/pdf',
          }
        )
        await fetch('http://'+ip+':'+port+'/newDocument', {
          method: 'POST',
          body: formData,
  
      });


      getFiles();
      setTitle('')
      setMessage('')
      setIsSelectedDocument(false)
      handleSetModalVisible(false)
    } else {

      Alert.alert('Información', 'La publicación debe incluir título y documento.')
    }
  }


  const selectImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({mediaTypes: ImagePicker.MediaTypeOptions.Images });

    if(!result.canceled){
      setSelectImage(result.assets[0].uri)
      console.log("Seleccionado")
      setIsSelectedImage(true)

     // newPost_image_mod()

    } else {
      console.log("No seleccionado")
    }
  }

  const selectVideo = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({mediaTypes: ImagePicker.MediaTypeOptions.Videos });

    if(!result.canceled){
      setSelectVideo(result.assets[0].uri)
      console.log(result)
      console.log(result.assets[0].uri)

      setIsSelectedVideo(true)

    } else {
      console.log("No seleccionado")
    }
  }

  const selectDocument = async () => {
    let result = await DocumentPicker.getDocumentAsync({});

    if (!result.canceled) {
      setSelectDocument(result.assets[0].uri);
      setIsSelectedDocument(true)
    } else {
      console.log("No seleccionado")
    }
  };

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

  const editPost = (title, article) => {
    setTitle(title)
    setMessage(article)
    handleSetModalEditVisible(true)
  }

  const dismissPost = () => {
    setTitle('')
    setMessage('')
    handleSetModalEditVisible(false)
  }

  const modifyPost = async (title, article) => {

    await fetch('http://'+ip+':'+port+'/modifyPost', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({
          title: title,
          message: article,
      }),
  });

  fetchData();

  setTitle('')
  setMessage('')
  setModalEditPostVisible(false)

  }

  const deletePost = async (title) => {

      if (posts == true) {
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

      } else if (videos == true) {
        await fetch('http://'+ip+':'+port+'/deletePostVideo', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({
              title: title,
          }),
      });

        getVideos()  
      } else if (files == true) {
        await fetch('http://'+ip+':'+port+'/deletePostDocument', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({
              title: title,
          }),
      });

        getFiles()
      }

    setTitle('')
    setMessage('')
    handleSetModalEditVisible(false)

  }


  // Handle severals screens 

  const handleSetModalVisible = (value) => {
    if (posts == true) {
      setModalPostVisible(value)
    } else if (videos == true) {
      setModalVideoVisible(value)   
    } else if (files == true) {
      setModalFileVisible(value)
    }
  }

  const handleSetModalEditVisible = (value) => {
    if (posts == true) {
      setModalPostEditVisible(value)
    } else if (videos == true) {
      setModalVideoEditVisible(value)   
    } else if (files == true) {
      setModalFileEditVisible(value)
    }
  }

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
            source={{ uri: 'http://'+ip+':'+port+'/getBlogDocument/'+filenameDownload}} 
            style={styles.webview} 
            javaScriptEnabled={true}
            //allowsInlineMediaPlayback={true}
          />
          <ButtonAppSecondary button_style={styles.button} text_style={styles.buttonText} title={'Volver'} onPress={() => setModalDownloadVisible(false) }/>
          <View style={styles.emptyspace} />

        </View>

      </Modal>

            
      <Modal animationType="slide" transparent={true} visible={modalPostVisible}>

        <SafeAreaView style={styles.container}>

          <View style={styles.emptyspace} />
          <View style={styles.emptyspace} />
         
          
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={styles.modalview}>
                        <TextInput value={title} style={styles.inputTitle} onChangeText={setTitle} placeholder="Título" />
                        <TextInput value={message} style={styles.inputText} onChangeText={setMessage} placeholder="Texto de la publicación" multiline={true}/>

                        <ButtonAppSecondary button_style={styles.button} text_style={styles.buttonText} title={'Añadir imagen'} onPress={() => selectImage() }/>
                        <ButtonAppSecondary button_style={styles.button} text_style={styles.buttonText} title={'Publicar'} onPress={() => newPost()}/>
                        <ButtonAppSecondary button_style={styles.button} text_style={styles.buttonText} title={'Descartar'} onPress={() => handleSetModalVisible(false) }/>


                    </View>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>

        </SafeAreaView>
      </Modal>


      <Modal animationType="slide" transparent={true} visible={modalEditPostVisible}>

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




            <Modal animationType="slide" transparent={true} visible={modalVideoVisible}>

        <SafeAreaView style={styles.container}>

          <View style={styles.emptyspace} />
          <View style={styles.emptyspace} />
         
          
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={styles.modalview}>
                        <TextInput value={title} style={styles.inputTitle} onChangeText={setTitle} placeholder="Título" />

                        <ButtonAppSecondary button_style={styles.button} text_style={styles.buttonText} title={'Añadir video'} onPress={() => selectVideo() }/>
                        <ButtonAppSecondary button_style={styles.buttonPublish} text_style={styles.buttonText} title={'Publicar'} onPress={() => newVideo()}/>
                        <ButtonAppSecondary button_style={styles.button} text_style={styles.buttonText} title={'Descartar'} onPress={() => handleSetModalVisible(false) }/>


                    </View>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>

        </SafeAreaView>
      </Modal>


      <Modal animationType="slide" transparent={true} visible={modalEditVideoVisible}>

        <SafeAreaView style={styles.container}>

          <View style={styles.emptyspace} />
          <View style={styles.emptyspace} />
         

          
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={styles.modalview}>
                        <TextInput value={title} style={styles.inputTitle} onChangeText={setTitle} placeholder="Título" />

                        <ButtonAppSecondary button_style={styles.button} text_style={styles.buttonText} title={'Guardar cambios'} onPress={() => modifyPost(title, message)}/>
                        <ButtonAppSecondary button_style={styles.button} text_style={styles.buttonText} title={'Eliminar'} onPress={() => deletePost(title) }/>
                        <ButtonAppSecondary button_style={styles.button} text_style={styles.buttonText} title={'Descartar'} onPress={() => dismissPost()}/>


                    </View>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>

        </SafeAreaView>
      </Modal>




            <Modal animationType="slide" transparent={true} visible={modalFileVisible}>

        <SafeAreaView style={styles.container}>

          <View style={styles.emptyspace} />
          <View style={styles.emptyspace} />
         
          
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={styles.modalview}>
                        <TextInput value={title} style={styles.inputTitle} onChangeText={setTitle} placeholder="Título" />

                        <ButtonAppSecondary button_style={styles.button} text_style={styles.buttonText} title={'Añadir archivo'} onPress={() => selectDocument() }/>
                        <ButtonAppSecondary button_style={styles.buttonPublish} text_style={styles.buttonText} title={'Publicar'} onPress={() => newDocument()}/>
                        <ButtonAppSecondary button_style={styles.button} text_style={styles.buttonText} title={'Descartar'} onPress={() => handleSetModalVisible(false) }/>


                    </View>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>

        </SafeAreaView>
      </Modal>


      <Modal animationType="slide" transparent={true} visible={modalEditFileVisible}>

        <SafeAreaView style={styles.container}>

          <View style={styles.emptyspace} />
          <View style={styles.emptyspace} />
         

          
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={styles.modalview}>
                        <TextInput value={title} style={styles.inputTitle} onChangeText={setTitle} placeholder="Título" />

                        <ButtonAppSecondary button_style={styles.button} text_style={styles.buttonText} title={'Guardar cambios'} onPress={() => modifyPost(title, message)}/>
                        <ButtonAppSecondary button_style={styles.button} text_style={styles.buttonText} title={'Eliminar'} onPress={() => deletePost(title) }/>
                        <ButtonAppSecondary button_style={styles.button} text_style={styles.buttonText} title={'Descartar'} onPress={() => dismissPost()}/>


                    </View>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>

        </SafeAreaView>
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

      {data && posts &&

          <FlatList 
          contentContainerStyle={styles.view}
          data={data} 
          //extraData={refreshList}

          renderItem={({item}) => 
            <TouchableOpacity style={styles.listWrapper} onLongPress={() => editPost(item[0], item[1])}> 
              <Text style={styles.title}>{item[0]}</Text>
              <Image source={{uri: 'http://'+ip+':'+port+'/getBlogImage/'+item[0]}} style={styles.imageblog} />

              <Text style={styles.article}>{item[1]}</Text>
            </TouchableOpacity> 
          }
          />

      }


      {dataVideo && videos &&

      <FlatList 
          contentContainerStyle={styles.view}
          data={dataVideo} 
          //extraData={refreshList}

          renderItem={({item}) => 
            <TouchableOpacity style={styles.listWrapper} onLongPress={() => editPost(item[0])}> 
              <Text style={styles.title}>{item[0]}</Text>
              <Video 
                source={{uri: 'http://'+ip+':'+port+'/getBlogVideo/'+item[0]}}
                useNativeControls   // Controles nativos del reproductor
                resizeMode="contain"  // Cómo se ajusta el video al tamaño
                isLooping  // Reproduce en bucle
                style={styles.imageblog} />
            </TouchableOpacity> 
          }
          />




      }


      {dataDocuments && files &&


        <FlatList 
          contentContainerStyle={styles.view}
          data={dataDocuments} 
          //extraData={refreshList}

          renderItem={({item}) => 
            <TouchableOpacity style={styles.listWrapperFiles} onPress={() => documentAlert(item[0])} onLongPress={() => editPost(item[0])}> 
              <Ionicons name={'document-text'} size={'200'} style={styles.row} />
              <Text style={styles.row}>{item[0]}</Text>
            </TouchableOpacity> 
          }
          />

      }


      <ButtonApp title={'Nueva publicación'} onPress={() => handleSetModalVisible(true)}/>

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

      listWrapperFiles: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        borderBottomWidth: 0.5,
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

    buttonPublish: {
      alignSelf: 'center',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#fff',
      borderColor: 'grey',
      height: 50,
      width: '80%',
      borderRadius: 10,
      borderWidth: 0.5,
      marginTop:60,
    },
  
    buttonText: {
      color: 'black'
    },

    listWrapperDone: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      borderBottomWidth: 1,
      marginBottom: 20,

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


