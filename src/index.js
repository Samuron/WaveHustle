import React from 'react';
import ReactDOM from 'react-dom';
import firebase from 'firebase'
import { Router, Route, IndexRoute, hashHistory } from 'react-router'

import App from './App';
import Login from './Login';
// import Feed from './Feed';
import Dashboard from './Dashboard';
import Thread from './Thread';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import injectTapEventPlugin from 'react-tap-event-plugin';

injectTapEventPlugin();
const FIREBASE_CONFIG = {
  apiKey: "AIzaSyD9aT-N7s3tqOO1rgFPD8dVgh4ojL7YGLs",
  authDomain: "wavehustle-abaaa.firebaseapp.com",
  databaseURL: "https://wavehustle-abaaa.firebaseio.com",
  storageBucket: "wavehustle-abaaa.appspot.com",
  messagingSenderId: "1063127459803"
};

firebase.initializeApp(FIREBASE_CONFIG);

const checkToken = (nextState, replace, next) => {
  firebase.auth().onAuthStateChanged(user => {
    if (!user) {
      replace('/login');
      next();
    } else {
      next();
    }
  });
};

const Navigation = (
  <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
    <Router history={hashHistory}>
      <Route path="/" component={App} onEnter={checkToken}>
        <IndexRoute component={Dashboard} />
        <Route path="/thread/:threadId" component={Thread} />
      </Route>
      <Route path="/login" component={Login} />
    </Router>
  </MuiThemeProvider>
);

ReactDOM.render(Navigation, document.getElementById('root'));
