import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import firebase from 'firebase/app';

var firebaseConfig = {
  apiKey: "AIzaSyByuiFeQAioVumSfEHGJ1N8Nxgg1yY3Lw8",
  authDomain: "smc2-e0416.firebaseapp.com",
  databaseURL: "https://smc2-e0416.firebaseio.com",
  projectId: "smc2-e0416",
  storageBucket: "smc2-e0416.appspot.com",
  messagingSenderId: "1014428648038",
  appId: "1:1014428648038:web:38751cbcd97ab0866863a7"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
ReactDOM.render(<App />, document.getElementById('root'));