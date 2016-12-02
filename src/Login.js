import React, { Component } from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import firebase from 'firebase';

const style = {
  textAlign: 'center',
  width: '500px',
  margin: '100px auto 0 auto',
  padding: '10px'
};

export default class Login extends Component {

  static contextTypes = {
    router: React.PropTypes.object.isRequired
  };

  constructor() {
    super();

    this.facebookProvider = new firebase.auth.FacebookAuthProvider();
    this.googleProvider = new firebase.auth.GoogleAuthProvider();
  }

  auth( providerName ) {
    const provider = this[providerName];
    var refs = firebase.database()
    firebase.auth()
      .signInWithPopup(provider)
      .then(response => {
        console.log( 'auth:', response );
        this.context.router.push('/');

        console.log(response.user.uid, response.user.displayName, response.user.photoURL);

        refs.ref(`/users/${response.user.uid}`).update({
          displayName: response.user.displayName,
          photoUrl: response.user.photoURL
        });
      })
      .catch(console.error)
  }

  render() {
    return (
      <div style={style}>
        <h3>Hello %username%</h3>
        <RaisedButton
          label='Log in with facebook'
          primary={true}
          onClick={e => this.auth( 'facebookProvider' )} />

        <RaisedButton
          label='Log in with Google'
          secondary={true}
          onClick={e => this.auth( 'googleProvider' )} />
      </div>
    )
  }
};
