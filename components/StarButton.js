import React, {useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, Image} from 'react-native';
import {useAuth} from '../context/AuthContext';

import favstar from '../assets/favstar.png';
import nofavstar from '../assets/nofavstar.png';

import rodeoserver from '../serverconn_conf/ServerAddress'
const ip = rodeoserver.IP
const port = rodeoserver.PORT


const StarButton = ({style, symbol, init}) => {

    const [fvselector, setFavStock] = useState(init);
    const { getUsername } = useAuth();
    

    const setFavourite = async (symbol) => {

      await fetch('http://'+ip+':'+port+'/setFavourite', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            alias: getUsername(),
            simbolo: symbol,
        }),
    });
  
    }
  
    const deleteFavourite = async (symbol) => {
        
      await fetch('http://'+ip+':'+port+'/deleteFavourite', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            alias: getUsername(),
            simbolo: symbol,
        }),
    });
    
    }

    const changeFavourite = async (symbol) => {
        if (fvselector == nofavstar ){
            setFavStock(favstar)
            setFavourite(symbol)
        }
        if (fvselector == favstar){
          setFavStock(nofavstar)
          deleteFavourite(symbol)
        }
    }

  return (

    <TouchableOpacity style={style} onPress={() => changeFavourite(symbol)}>
        <Image source={fvselector} style={styles.starIcon} />
    </TouchableOpacity> 

  )
}
export default StarButton;

const styles = StyleSheet.create({

    starIcon: {
        alignSelf: 'center',
        justifyContent: 'center',
        width: 40,
        height: 40,
      },
      
});