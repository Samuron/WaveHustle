import React, { Component } from 'react';
import firebase from 'firebase';
import {List, ListItem} from 'material-ui/List';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';

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

    this.state = {
      name: "",
      photoUrl: "",
      user: firebase.auth().currentUser,
      userName: "",
      userPhotoUrl: ""
    };

  }

  componentDidMount() {
    this.userRef = firebase.database().ref(`/users/${this.state.user.uid}`);

    this.userRef
      .on('value', snapshot => {
        const value = snapshot.val();
        this.setState({ 
            userName: value.displayName,
            userPhotoUrl: value.photoUrl
        });
      });
  }

  clear() {
    this.setState({ 
      name: "",
      photoUrl: ""
    })
  }

  postThread() {
    if (this.refs.name.getValue() == "") 
    {
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
    return (
      <div>
        <Card style={style}>
          <CardHeader
            title="Create new thread"
            subtitle="Unique it!"
            />
          <CardTitle title="What it is about?"/>
          <CardText>
            <TextField 
              hintText="Name" 
              ref="name" 
              value={this.state.name}
              onChange={ (event) => this.setState({ name: event.target.value }) }
            />
          </CardText>
          <CardTitle title="Picture it!"/>
          <CardText>
            <TextField 
              hintText="Add picture link" 
              ref="photoUrl" 
              value={this.state.photoUrl}
              onChange={ (event) => this.setState({ photoUrl: event.target.value }) }
            />
          </CardText>
          <CardActions>
            <RaisedButton onClick={() => this.postThread() } label="Post" />
          </CardActions>
        </Card>
      </div>
    )
  }
};
