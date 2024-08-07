import React, {useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, Image} from 'react-native';
import {useAuth} from '../context/AuthContext';



const Stoplight = ({style, state}) => {
    


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

    <TouchableOpacity style={style}>
        <TouchableOpacity style={styles.stoplight} />
    </TouchableOpacity> 

  )
}
export default Stoplight;

const styles = StyleSheet.create({

    stoplight: {
        alignSelf: 'center',
        justifyContent: 'center',
        width: 40,
        height: 40,
        backgroundColor: '#f85',
        borderRadius: 10
        
      },
      
});