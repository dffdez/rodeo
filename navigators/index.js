import React, { useEffect } from 'react';

//React navigation
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import * as Notifications from 'expo-notifications'


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

import rodeoserver from '../serverconn_conf/ServerAddress'
const ip = rodeoserver.IP
const port = rodeoserver.PORT


//Authentication
import {useAuth} from '../context/AuthContext';


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
    const { getUsername } = useAuth();


    useEffect(() => {

        registerForPushNotificationsAsync();

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
        await fetch('http://'+ip+':'+port+'/setPushNotificationToken', {
            method: 'POST',
            headers: {
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
    <Tab.Navigator screenOptions={{headerShown: false}}>


        {getIsAdmin() ? (
            <>
                <Tab.Screen name="Seguimiento" component={TrackNav} />
                <Tab.Screen name="Blog" component={BlogAdmin} />
                <Tab.Screen name="Consultas" component={ChatNav} />
                <Tab.Screen name="Perfil" component={ProfileNav} />
            </>
        ):(
            <>
                <Tab.Screen name="Seguimiento" component={TrackUserNav} />
                <Tab.Screen name="Blog" component={Blog}  options={{headerTitle: "Blog"}} />
                <Tab.Screen name="Consultas" component={ChatUser} />
                <Tab.Screen name="Perfil" component={Profile} />
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

const ProfileNav = () => {
    return(
        <Stack.Navigator screenOptions={{headerShown: false}}>
            <Stack.Screen name="ProfileAdmin" component={ProfileAdmin} />
            <Stack.Screen name="Profile" component={Profile} />
            <Stack.Screen name="UserManagement" component={UserManagement} />
            <Stack.Screen name="Stoplighconfig" component={Stoplighconfig} />
        </Stack.Navigator>
    )
}



//BUTTONS before authentication
const Navigation = () => {

    const {getIsSignedIn} = useAuth(); //Solo puede ser llamado dentro de function


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


