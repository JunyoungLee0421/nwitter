import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import firebase from "./fBase";
//import style
import "./style.css";

//console.log(firebase);

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);