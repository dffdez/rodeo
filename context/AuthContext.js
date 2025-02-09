import React, { useState, createContext, useContext, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { io } from 'socket.io-client'
import { Alert } from 'react-native';

const AuthContext = createContext(null);
const {Provider} = AuthContext;


import rodeoserver from '../serverconn_conf/ServerAddress'
const ip = rodeoserver.IP
const port = rodeoserver.PORT


const AuthProvider = ({children}) => {

    
    const ws = io('wss://'+ip+'/stocks')
    const wsChat = io('wss://'+ip+'/chat')

    
    //Almacena el estado 
    const [authState, setAuthState] = useState({
        username: null,
        accessToken: null,
        authenticated: false,
        admin: false,
    });

    const [jwtToken, setjwtToken] = useState(null)


    // Funcion para login
    const login = async(username, password) => {

        try {

            const response = await fetch('https://'+ip+'/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: username,
                    password: password,
                }),
            });


            if(response.ok) {

                const data = await response.json();
                const accessToken = data.access_token;
                storeToken(accessToken, username) //Almacena el token
                setjwtToken(accessToken)

                //console.log(data)
                

                if(data.admin == 'admin'){

                    setAuthState({
                        username: username,
                        accessToken: accessToken,
                        authenticated: true,
                        admin: true,
                    });

                }
                else{

                    setAuthState({
                        username: username,
                        accessToken: accessToken,
                        authenticated: true,
                        admin: false,
                    });

                }

                console.log('Login successful.')


            } else {
                Alert.alert('Inicio de sesión', 'El usuario y/o la contraseña son incorrectos.\n\nPor favor, inténtelo de nuevo.')
                
                console.error('Login failed.');
            }
        } catch (error) {
            Alert.alert('Inicio de sesión', 'El servidor no responde.\n\nPor favor, inténtelo más tarde.')
            console.error('Error during login:', error);

        }
    };


    // Funcion para registro
    const signup = async (alias, name, surname, email, password) => {
        try {

            const response = await fetch('https://'+ip+'/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    alias:alias,
                    name: name,
                    surname: surname,
                    email: email,
                    password: password,
                }),
            });

            const data = await response.json();

            if(data['message'] == 'OK') {


                console.log('Signup successful.')
                return true; //If ok

            } else {
                console.error('Signup failed.');
                return false; //If not ok
            }
        } catch (error) {
            console.error('Error during signup:', error);
        }
    };


    // Funcion para cierre de sesion
    const logout = async () => {

        // Eliminar accessToken almacenado
        // Envia a pantalla de login
        await SecureStore.deleteItemAsync('jwtToken')
        await SecureStore.deleteItemAsync('username')
        await SecureStore.deleteItemAsync('password')

        
        setAuthState({
            username:null,
            accessToken: null,
            authenticated: false,
            admin:false
        });

        
    };

    const storeToken = async (token, user) => {
        try {
            await SecureStore.setItemAsync('jwtToken', token)
            await SecureStore.setItemAsync('user', user)
        } catch (error) {
            console.log('Error storing JWT', error)
        }

    }

    //Devuelve el token de acceso
    const getToken = async () => {
        try {
            let result = await SecureStore.getItemAsync('jwtToken')
            //console.log('Token obtenido', result)
            if (result) {
                return result
            } else {
                console.log('No JWT stored')
            }
        } catch (error) {
            console.log('Error getting JWT', error)
        }
    };

    /* useEffect(() => {
       /*  const fetchToken = async () => {
            const token = await getToken();  // Obtener el token
            setjwtToken(token);  // Establecer el token en el estado
        };

        fetchToken();

    }, []); */



    //Devuelve usuario y token
    const getSession = async () => {
        try {
            let accessToken = await SecureStore.getItemAsync('jwtToken')
            let username = await SecureStore.getItemAsync('username')
            let password = await SecureStore.getItemAsync('password')

            //console.log('Probado login automatico')
            //console.log(password)

            //console.log('Token obtenido', result)
            if (accessToken && username && password) {

                login(username, password)

                //console.log('Probado login automatico')
                
                return true
            } else {
                return false
            }
        } catch (error) {
            console.log('Error getting JWT', error)
        }
    };

    //Devuelve el nombre de usuario
    const getUsername = () => {
        return authState.username;
    };



    //Devuelve si el usuario esta o no autenticado
    const getIsSignedIn = () => {
        return authState.authenticated && jwtToken;
    };


    //Devuelve si el usuario es administrador
    const getIsAdmin = () => {
        return authState.admin;
    };




    return (
        <Provider value={{authState, jwtToken, ws, wsChat, getToken, getSession, login, logout, signup, getIsSignedIn, getIsAdmin, getUsername}}>
            {children}
        </Provider>
    );
};
export {AuthContext, AuthProvider};



export const useAuth = () => {
    const context = useContext(AuthContext);
    if(!context) {
        throw new Error('There is no AuthProvider');
    }
    return context;

};
