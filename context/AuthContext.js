import React, { useState, createContext, useContext } from 'react';


const AuthContext = createContext(null);
const {Provider} = AuthContext;


import rodeoserver from '../serverconn_conf/ServerAddress'
const ip = rodeoserver.IP
const port = rodeoserver.PORT


const AuthProvider = ({children}) => {

    //Almacena el estado 
    const [authState, setAuthState] = useState({
        username: 'usuario1',
        accessToken: null,
        authenticated: false,
        admin: false,
    });


    // Funcion para login
    const login = async(username, password) => {

        try {

            const response = await fetch('http://'+ip+':'+port+'/login', {
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

                
                //Almacenar accessToken
                // IMPORTANTE
                

                console.log('Login successful.')


            } else {
                console.error('Login failed.');
            }
        } catch (error) {
            console.error('Error during login:', error);
        }
    };


    // Funcion para registro
    const signup = async (alias, name, surname, email, password) => {
        try {

            const response = await fetch('http://'+ip+':'+port+'/signup', {
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


        setAuthState({
            username:null,
            accessToken: null,
            authenticated: false,
            admin:false
        });

        
    };


    //Devuelve el token de acceso
    const getAccessToken = () => {
        return authState.accessToken;
    };

    //Devuelve el nombre de usuario
    const getUsername = () => {
        return authState.username;
    };



    //Devuelve si el usuario esta o no autenticado
    const getIsSignedIn = () => {
        return authState.authenticated;
    };


    //Devuelve si el usuario es administrador
    const getIsAdmin = () => {
        return authState.admin;
    };




    return (
        <Provider value={{authState, getAccessToken, login, logout, signup, getIsSignedIn, getIsAdmin, getUsername}}>
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
