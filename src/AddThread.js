import React, { Component } from 'react';
import firebase from 'firebase';
import { List, ListItem } from 'material-ui/List';
import TextField from 'material-ui/TextField';
import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';
import { Card, CardActions, CardHeader, CardMedia, CardTitle, CardText } from 'material-ui/Card';

import { values, reverse } from 'lodash';

const style = {
  width: '100%'
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

  handleOpen() { 
    this.setState({ open: true }); 
  };

  handleClose() { 
    this.setState({ open: false }); 
  };

  postThread() {
    if (this.refs.name.getValue() == "") {
      this.clear();
      return;
    }

    var thread = firebase.database().ref('/threads/').push({
      creator: this.state.userName,
      creatorPhotoUrl: this.state.userPhotoUrl,
      name: this.refs.name.getValue(),
      photoUrl: this.refs.photoUrl.getValue(),
      isPrivate: false
    });
    this.clear();
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
        <Dialog title="Create new thread" actions={actions} modal={true} open={this.state.open}>
          <TextField
            hintText="Name"
            ref="name"
            value={this.state.name}
            onChange={(event) => this.setState({ name: event.target.value })}
            />
          <br />
          <TextField
            hintText="Add picture link"
            ref="photoUrl"
            value={this.state.photoUrl}
            onChange={(event) => this.setState({ photoUrl: event.target.value })}
          />
          <br />
        </Dialog>
      </div>
    )
  }
};
