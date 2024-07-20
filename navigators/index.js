import React from 'react';

//React navigation
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

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




//Authentication
import {useAuth} from '../context/AuthContext';


const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();



//TAB BAR after authentication
const Home = () => {

    //Determinar si admin
    const { getIsAdmin } = useAuth(); //Solo puede ser llamado dentro de function

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
                <Tab.Screen name="Blog" component={Blog} />
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
        <Stack.Navigator screenOptions={{headerShown: false}}>
            <Stack.Screen name="ChatIndex" component={ChatIndex} />
            <Stack.Screen name="ChatAdmin" component={ChatAdmin} />
        </Stack.Navigator>
    )
}

const ProfileNav = () => {
    return(
        <Stack.Navigator screenOptions={{headerShown: false}}>
            <Stack.Screen name="ProfileAdmin" component={ProfileAdmin} />
            <Stack.Screen name="Profile" component={Profile} />
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


