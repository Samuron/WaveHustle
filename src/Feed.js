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

export default class Feed extends Component {
  constructor(props) {
    super(props);

    this.state = {
      videosCount: 2,
      videos: [],
      user: firebase.auth().currentUser
    };

  }

  componentDidMount() {
    this.userRef = firebase.database().ref(`/users/${this.state.user.uid}`);

    this.userRef
      // .child('videos')
      // .orderByKey()
      // .limitToLast(this.state.videosCount)
      .on('value', snapshot => {
        // this.isInitialDataLoaded = true;
        const value = snapshot.val();

        console.log('value', value);
        const videos = reverse(values(value.videos));
        this.setState({ videos });
      });
  }

  postVideo() {
    var link = this.refs.videoLink.getValue();

    if (!link)
      return;

    var videoId = link.includes('?v=')
      ? link.split('?v=')[1].slice(0, 11)
      : link.substr(link.lastIndexOf('/') + 1);

    if (!videoId)
      return;

    var videoRefs = firebase.database().ref('/videos/').push({
      videoYouTubeId: videoId,
      author: this.state.user.displayName,
      photoUrl: this.state.user.photoURL,
      description: this.refs.videoDescription.getValue()
    });

    this.
      userRef.child('friends').once('value', s => {
        s.val().map(e => Object.keys(e)[0]).forEach(id => {
          var friendRef = firebase.database().ref(`/users/${id}`).child('videos')
          friendRef.push({
            id: videoRefs.getKey()
          });
        })
      });

    this.userRef
      .child('videos')
      .push({ id: videoRefs.getKey() });
  }

  renderVideoComponent({ id }, index) {
    return (
      <div>
        render item
      </div>
    );
  }

  render() {
    return (
      <div>
        <Card style={style}>
          <CardHeader
            title="Share youtube video"
            subtitle="Paste video link"
            avatar={this.state.user.photoURL}
            />
          <CardTitle title="Any cool link?"/>
          <CardText>
            <TextField hintText="YouTube video link" ref="videoLink" />
          </CardText>
          <CardTitle title="Drop some words for ya niggas?"/>
          <CardText>
            <TextField hintText="Add description" ref="videoDescription" />
          </CardText>
          <CardActions>
            <RaisedButton onClick={() => this.postVideo() } label="Post" />
          </CardActions>
        </Card>
        <List style={style}>
          {this.state.videos.map(this.renderVideoComponent) }
        </List>
      </div>
    )
  }
};
