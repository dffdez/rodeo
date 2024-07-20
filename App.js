import React from 'react';

// React navigation stack
import Navigation from './navigators/index';
import { AuthProvider } from './context/AuthContext';


//import Login from './screens/Login';
//import Signup from './screens/Signup';
//import Welcome from './screens/Welcome';

export default function App() {
  return (
    <AuthProvider>
      <Navigation />
    </AuthProvider>
     
  );
}