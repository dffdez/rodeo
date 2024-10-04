import React from 'react';

//This file is deprecated since this function is in index.js


import * as Notifications from 'expo-notifications'

async function registerForPushNotificationsAsync() {
    let token;

    if (existingStatus !== ' granted') {
        const {status} = await Notifications.requestPermissionsAsync();
        finalStatus = status;
    }

    if (finalStatus !== ' granted') {
        alert('Error push notifications');
        return;
    }

    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log(token);

    return token;
    
}