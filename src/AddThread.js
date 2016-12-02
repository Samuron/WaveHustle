import React, { Component } from 'react';
import firebase from 'firebase';
import { List, ListItem } from 'material-ui/List';
import TextField from 'material-ui/TextField';
import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import { Card, CardActions, CardHeader, CardMedia, CardTitle, CardText } from 'material-ui/Card';

import { values, reverse } from 'lodash';

const style = {
  width: '100%',
  heigth: '100%'
};

export default class AddThread extends Component {
  constructor(props) {
    super(props);
    var user = firebase.auth().currentUser;
    this.state = {
      name: "",
      photoUrl: "",
      userName: user.displayName,
      userPhotoUrl: user.photoURL,
      open: false
    };
  }

  clear() {
    this.setState({
      name: "",
      photoUrl: ""
    })
  }

  handleOpen = () => { this.setState({ open: true }); };
  handleClose = () => {
    this.clear();
    this.setState({ open: false });
  };

  postThread = () => {
    if (this.state.name == "") {
      this.clear();
      return;
    }

    var thread = firebase.database().ref('/threads/').push({
      creator: this.state.userName,
      creatorPhotoUrl: this.state.userPhotoUrl,
      name: this.state.name,
      photoUrl: this.state.photoUrl,
      isPrivate: false
    });
    this.handleClose();
  }

  render() {
    const actions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onTouchTap={this.handleClose}
        />,
      <FlatButton
        label="Create"
        primary={true}
        keyboardFocused={true}
        onTouchTap={this.postThread}
        />,
    ];

    return (
      <div>
        <RaisedButton label="Add thread" onTouchTap={this.handleOpen} />
        <Dialog title="Create new thread" actions={actions} modal={true} open={this.state.open}>
          <br />
          Whats is it about?
          <br />
          <TextField
            hintText="Name"
            value={this.state.name}
            onChange={(event) => this.setState({ name: event.target.value })}
          />
          <br />
          Personalize it!
          <br />
          <TextField
            hintText="Add picture link"
            value={this.state.photoUrl}
            onChange={(event) => this.setState({ photoUrl: event.target.value })}
          />
          <br />
        </Dialog>
      </div>
    )
  }
};
