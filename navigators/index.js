import React, { useEffect } from 'react';

//React navigation
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import * as Notifications from 'expo-notifications'
import { StyleSheet, Text, TextInput, View, Button, Platform, Image, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard } from 'react-native';

import Ionicons from 'react-native-vector-icons/Ionicons';


//screens
import Login from './../screens/Login';
import Signup from './../screens/Signup';
import Blog from './../screens/Blog';
import Tracking from './../screens/Tracking';
import TrackingAll from '../screens/TrackingAll';
import ChatUser from './../screens/ChatUser';
import Profile from '../screens/Profile';
import ProfileAdmin from '../screens/ProfileAdmin';

//admin screens
import TrackConf from '../screens/TrackConf';
import TrackingAdmin from '../screens/TrackingAdmin';
import BlogAdmin from '../screens/BlogAdmin';
import ChatIndex from './../screens/ChatIndex';
import ChatAdmin from '../screens/ChatAdmin';
import Stoplighconfig from '../screens/Admin/StoplightConfig';
import UserManagement from '../screens/Admin/UsersManagement';
import ReferenceConfig from '../screens/Admin/ReferenceConfig';
import TrackConfRef from '../screens/Admin/TrackConfRef';


import rodeoserver from '../serverconn_conf/ServerAddress'
const ip = rodeoserver.IP
const port = rodeoserver.PORT


//Authentication
import {useAuth} from '../context/AuthContext';
import SignupAdmin from '../screens/Admin/SignupAdmin';


const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

//Permite recibir notificaciones cuando la app está abierta
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
    }),
});

//TAB BAR after authentication
const Home = () => {

    //Determinar si admin
    const { getIsAdmin } = useAuth(); //Solo puede ser llamado dentro de function
    const { getUsername, ws, wsChat } = useAuth();
    const { jwtToken } = useAuth(null);

  
    useEffect(() => {

        registerForPushNotificationsAsync();
        ws.emit('join', getUsername())
        wsChat.emit('join', getUsername())  

    }, []);

    //Push notifications
    async function registerForPushNotificationsAsync() {
        let token;

        const{status: existingStatus} = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;

        if (existingStatus !== 'granted') {
            const {status} = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }
    
        if (finalStatus !== 'granted') {
            alert('Error al activar las notificaciones');
            return;
        }

        //ProjectId obtenido de Expo al crear nuevo proyecto
        const projectId = "605e5af7-6932-44dc-8391-5e2a4976e615"
        if (!projectId) {
            console.log('Project ID not found');
        }

    
        token = (await Notifications.getExpoPushTokenAsync({
            projectId
        })).data;


        //Almacena el token en la base de datos
        await fetch('https://'+ip+'/setPushNotificationToken', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${jwtToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                alias: getUsername(),
                token: token,
            }),
        });


    
        return token;
        
    }

    return(

        
        <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Seguimiento') {
              iconName = focused ? 'bar-chart' : 'bar-chart-outline';
            } else if (route.name === 'Blog') {
              iconName = focused ? 'newspaper' : 'newspaper-outline';
            } else if (route.name === 'Consultas') {
                iconName = focused ? 'chatbubble' : 'chatbubble-outline';
            } else if (route.name === 'Perfil') {
                iconName = focused ? 'settings' : 'settings-outline';
            } else if (route.name === 'Configuración') {
                iconName = focused ? 'settings' : 'settings-outline';
            }

            // You can return any component that you like here!
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: 'tomato',
          tabBarInactiveTintColor: 'gray',
          tabBarHideOnKeyboard: true,

        })

    
    }

      >

        
        {getIsAdmin() ? (
            <>
                <Tab.Screen name="Seguimiento" component={TrackNav} options={{headerTitle: "Seguimiento", headerShown: true}}/>
                <Tab.Screen name="Blog" component={BlogAdmin} options={{headerTitle: "Blog", headerShown: true }}/>
                <Tab.Screen name="Consultas" component={ChatNav} options={{headerTitle: "Consultas", headerShown: false }}/>
                <Tab.Screen name="Configuración" component={ProfileNav} options={{headerTitle: "Perfil", headerShown: false }}/>
            </>
        ):(
            <>
                <Tab.Screen name="Seguimiento" component={TrackUserNav} options={{headerTitle: "Seguimiento", headerShown: true}}/>
                <Tab.Screen name="Blog" component={Blog}  options={{headerTitle: "Blog", headerShown: true }} />
                <Tab.Screen name="Consultas" component={ChatUser} options={{headerTitle: "Consultas", headerShown: true}}/>
                <Tab.Screen name="Perfil" component={Profile} options={{headerTitle: "Perfil", headerShown: false }}/>
            </>
        )}


    </Tab.Navigator>
    
    );
}




const TrackNav = () => {
    return(
        <Stack.Navigator screenOptions={{headerShown: false}}>
            <Stack.Screen name="TrackingAdmin" component={TrackingAdmin} />
            <Stack.Screen name="TrackConf" component={TrackConf} />
        </Stack.Navigator>
    )
}


const TrackUserNav = () => {
    return(
        <Stack.Navigator screenOptions={{headerShown: false}}>
            <Stack.Screen name="TrackingFavs" component={Tracking} />
            <Stack.Screen name="TrackingAll" component={TrackingAll} />
        </Stack.Navigator>
    )
}

const ChatNav = () => {
    return(
        <Stack.Navigator screenOptions={{headerShown: true}}>
            <Stack.Screen name="ChatIndex" component={ChatIndex} options={{headerTitle: "Consultas"}} />
            <Stack.Screen name="ChatAdmin" component={ChatAdmin} options={{headerTitle: "Consultas"}}/>
        </Stack.Navigator>
    )
}


const BlogUserNav = () => {
    return(
        <Stack.Navigator screenOptions={{headerShown: true}}>
            <Stack.Screen name="Blog" component={Blog} options={{headerTitle: "Blog"}} />
            <Stack.Screen name="Video" component={Video} options={{headerTitle: "Blog"}}/>
        </Stack.Navigator>
    )
}


const BlogNav = () => {
    return(
        <Stack.Navigator screenOptions={{headerShown: true}}>
            <Stack.Screen name="BlogAdmin" component={BlogAdmin} options={{headerTitle: "Blog"}} />
            <Stack.Screen name="Video" component={Video} options={{headerTitle: "Blog"}}/>
        </Stack.Navigator>
    )
}

const ProfileNav = () => {
    return(
        <Stack.Navigator screenOptions={{headerShown: false}}>
            <Stack.Screen name="ProfileAdmin" component={ProfileAdmin} />
            <Stack.Screen name="Profile" component={Profile} options={{headerTitle: "Perfil", headerShown: true}}/>
            <Stack.Screen name="UserManagement" component={UserManagement} options={{headerTitle: "Gestión de usuarios", headerShown: true}}/>
            <Stack.Screen name="SignupAdmin" component={SignupAdmin} options={{headerTitle: "Nuevo Administrador", headerShown: true}}/>
            <Stack.Screen name="Stoplighconfig" component={Stoplighconfig} options={{headerTitle: "Semáforo", headerShown: true}}/> 
            <Stack.Screen name="ReferenceConfig" component={ReferenceConfig} options={{headerTitle: "Referencias", headerShown: true}}/> 
            <Stack.Screen name="TrackConfRef" component={TrackConfRef} />


        </Stack.Navigator>
    )
}



//BUTTONS before authentication
const Navigation = () => {

    const {getIsSignedIn, getSession} = useAuth(); //Solo puede ser llamado dentro de function


    useEffect(() => {
        getSession();
    }, []);



      return(
        <NavigationContainer>
            <Stack.Navigator screenOptions={{headerShown: false}}>
                {getIsSignedIn() ? (
                    <>
                        <Stack.Screen name="Home" component={Home} />
                    </>
                ):(
                    <>
                        <Stack.Screen name="Login" component={Login} />
                        <Stack.Screen name="Signup" component={Signup} />
                    </>
                )}

            </Stack.Navigator>
        </NavigationContainer>
    )
}
export default Navigation;


