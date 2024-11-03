import React, { useState } from 'react';


const ip = '192.168.1.37'
const port = '5000'


const StockConn = () => {


    // Funcion para obtener la informacion de los valores de la base de datos

    const getStocks = async(username, password) => {

        try {

            const response = await fetch('https://'+ip+'/getStocks', {
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
                return data;


            } else {
                console.error('Petición de valores fallida.');
            }
        } catch (error) {
            console.error('Error al obtener valores:', error);
        }
    };


    
};
export default StockConn;