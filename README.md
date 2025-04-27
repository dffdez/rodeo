<a id="readme-top"></a>

<p align="center">
  <img src="https://img.shields.io/github/stars/dffdez/rodeo" alt="Stars" />
  <img src="https://img.shields.io/github/forks/dffdez/rodeo" alt="Forks" />
  <img src="https://img.shields.io/github/watchers/dffdez/rodeo" alt="Watchers" />
  <img src="https://img.shields.io/github/contributors/dffdez/rodeo" alt="Contributors" />
  <img src="https://img.shields.io/github/last-commit/dffdez/rodeo" alt="Last Commit" />
</p>


<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/dffdez/rodeo">
    <img src="assets/logo_en.png" alt="Logo" width="350" height="350">
  </a>


  <h3 align="center">Rodeo</h3>

   <p align="center">
    Desarrollo de una aplicación móvil para la formación y seguimiento del mercado bursátil
    <br />
    <br />
    <a href="https://github.com/dffdez/rodeo"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://github.com/dffdez/rodeo">View Demo</a>
    &middot;
    <a href="https://github.com/dffdez/rodeo/issues/new?labels=bug&template=bug-report---.md">Report Bug</a>
    &middot;
    <a href="https://github.com/dffdez/rodeo/issues/new?labels=enhancement&template=feature-request---.md">Request Feature</a>
  </p>
    
</div>


<!-- TABLE OF CONTENTS -->

  <summary>Contenidos</summary>
  <br />
  <ol>
    <li>
      <a href="#sobre-el-proyecto">Sobre el proyecto</a>
      <ul>
        <li><a href="#tecnologías-utilizadas">Tecnologías utilizadas</a></li>
      </ul>
    </li>
    <li>
      <a href="#primeros-pasos">Primeros pasos</a>
      <ul>
        <li><a href="#prerrequisitos">Prerrequisitos</a></li>
        <li><a href="#instalación">Instalación</a></li>
        <ul>
          <li><a href="#instalación-desde-el-repositorio">Instalación desde el repositorio</a></li>
          <li><a href="#instalación-del-apk">Instalación del <i>.apk</i></a></li>
        </ul>
      </ul>
    </li>
    <li><a href="#ejemplo-de-uso">Ejemplo de uso</a></li>
  </ol>
    <br />



<!-- ABOUT THE PROJECT -->
## Sobre el proyecto

Este proyecto consiste en el desarrollo de una aplicación móvil, que ofrece a los usuarios la posibilidad de hacer seguimiento del mercado de valores en tiempo real. Identifica mediante un algoritmo el momento óptimo de realizar inversiones
y permite suscribirse a valores específicos, recibiendo alertas personalizadas sobre el momento de inversión de dicho activo.

Además, la aplicación incorpora un apartado de formación, que permite la publicación de artículos, videos y documentos de temática financiera. Incluye también un apartado de consultas, donde los usuarios pueden
plantear preguntas a los administradores mediante un chat en línea.

En este repositorio se encuentra la interfaz de usuario de la aplicación, desarrollada en React Native. 

El _backend_ de esta aplicación se encuentra en https://github.com/dffdez/rodeoserver


### Tecnologías utilizadas

Las principales tecnologías que se han utilizado en este proyecto son:

* [![React Native][ReactNativeBadge]][ReactNative-url]
* [![Expo][ExpoBadge]][Expo-url]

[ReactNativeBadge]: https://img.shields.io/badge/React%20Native-20232A?logo=react&logoColor=61DAFB&style=for-the-badge
[ReactNative-url]: https://reactnative.dev/

[ExpoBadge]: https://img.shields.io/badge/Expo-000020?logo=expo&logoColor=white&style=for-the-badge
[Expo-url]: https://expo.dev/


<p align="right">(<a href="#readme-top">back to top</a>)</p>


<!-- GETTING STARTED -->
## Primeros pasos

En esta sección se detallan los pasos a seguir para utilizar este proyecto.

Adicionalmente, en este repositorio se incluye el _.apk_ de la aplicación para instalarla directamente en dispositivos Android.

### Prerrequisitos

Antes de comenzar es necesario:
<ul>
   <li><a>Instalar Node.js</a></li>
   <li><a>Instalar expo-cli</a></li>
   <li><a>Instalar la aplicación Expo Go en un dispositivo físico o en un emulador/simulador</a></li>
   <li><a>Instalar Visual Studio Code (recomendado)</a></li>

</ul>
<br />

  Para la instalación de Node.js puede seguir los pasos que se indican en https://nodejs.org/en 

  Para comprobar que la instalación se ha hecho correctamente puede ejecutar los siguientes comandos:

  ```sh
  node -v
  npm version
  npx -v
  ```
<br />


  Para la instalación de expo-cli puede ejecutar el siguiente comando:

   ```sh
  npm install -g expo-cli
  ```
<br />


  La aplicación Expo Go la puede obtener desde:
   <li><a> AppStore (iOS)</a></li>
   <li><a>Google Play (Android)</a></li>
   <br />


  Se recomienda tener instalado Visual Studio Code, que se puede instalar siguiendo los pasos que se indican en https://code.visualstudio.com/

 

### Instalación

#### Instalación desde el repositorio

Los pasos a seguir para probar este proyecto son:

1. Clonar el repositorio
 ```sh
   git clone https://github.com/dffdez/rodeo.git
   ```
2. Situarse en el directorio raíz del proyecto y ejecutar:
```sh
   npm start
   ```
   o bien
```sh
   expo start
   ```

Este comando inicia el servidor de desarrollo de Expo, mostrando en la terminal un código QR.

 3.1. Dispositivo físico

Si está utilizando un dispositivo físico para probar la aplicación, debe escanear este código con la cámara de su dispositivo. 
Esto hará que se abra la aplicación Expo Go mostrando la interfaz de la aplicación.

 3.2. Emulador/simulador

Si en lugar de un dispositivo físico está utilizando un emulador, por ejemplo de Android, debe tener abierto el emulador con la aplicación Expo Go instalada.
Debajo del código QR debajo aparecen unas instrucciones que indican que debe pulsar "a" para abrir la aplicación en Android. Esto hará que se abra 
la aplicación Expo Go en el emulador mostrando la interfaz de la aplicación.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

#### Instalación del _.apk_

Los pasos a seguir para utilizar la aplicación con el _.apk_ son:

1. Descargar en un dispositivo físico o emulador de Android el archivo _.apk_, que puede encontrar en https://github.com/dffdez/rodeo/releases/tag/v1.0.0
2. Buscar el _.apk_ en el explorador de archivos y pulsar sobre el archivo.
3. Permitir instalar aplicaciones de fuentes desconocidas (si lo pide).
4. Aceptar las opciones e instalar.

Con estos pasos la aplicación estará instalada en el dispositivo.

<p align="right">(<a href="#readme-top">back to top</a>)</p>




<!-- USAGE EXAMPLES -->
## Ejemplo de uso

Si han seguido estos pasos podrá hacer uso de la aplicación, que mostrará las siguientes pantallas:


<p align="center">
  <img src="https://github.com/user-attachments/assets/3f0ed37f-aebd-4ae9-ba11-df0d8042ad02" alt="image" />
</p>
<br />
<br />

<p align="center">
  <img src="https://github.com/user-attachments/assets/aa33b550-7386-4887-a3a0-577d7bdaa4ed" alt="image" />
</p>
<br />
<br />


<p align="right">(<a href="#readme-top">back to top</a>)</p>

