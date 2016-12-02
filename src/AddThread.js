import React, { Component } from 'react';
import firebase from 'firebase';
import { List, ListItem } from 'material-ui/List';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import { Card, CardActions, CardHeader, CardMedia, CardTitle, CardText } from 'material-ui/Card';

import { values, reverse } from 'lodash';

const style = {
  width: 500,
  margin: 'auto'
};

const opts = {
  width: '500',
  height: '300',
  frameBorder: '0'
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
    };

  }

  postThread() {
    var thread = firebase.database().ref('/threads/').push({
      creator: this.state.userName,
      creatorPhotoUrl: this.state.userPhotoUrl,
      name: this.refs.name.getValue(),
      photoUrl: this.refs.photoUrl.getValue(),
      isPrivate: false
    });
  }

  render() {
    return (
      <div>
        <Card style={style}>
          <CardHeader
            title="Create new thread"
            subtitle="Unique it!"
            />
          <CardTitle title="What it is about?" />
          <CardText>
            <TextField hintText="Name" ref="name" />
          </CardText>
          <CardTitle title="Picture it!" />
          <CardText>
            <TextField hintText="Add picture link" ref="photoUrl" />
          </CardText>
          <CardActions>
            <RaisedButton onClick={() => this.postThread()} label="Post" />
          </CardActions>
        </Card>
      </div>
    )
  }
};
