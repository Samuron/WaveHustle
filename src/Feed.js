import React, { Component } from 'react';
import firebase from 'firebase';
import ReactFireMixin from 'reactfire';
import {List, ListItem} from 'material-ui/List';
import Divider from 'material-ui/Divider';
import {grey400, darkBlack, lightBlack} from 'material-ui/styles/colors';
import TextField from 'material-ui/TextField';
import Avatar from 'material-ui/Avatar';
import Snackbar from 'material-ui/Snackbar';
import RaisedButton from 'material-ui/RaisedButton';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import FeedVideo from './FeedVideo';
import Friends from './Friends';

import { values, reverse } from 'lodash';
// import fbutils from '../node_modules/firebase-util/dist/firebase-util.js';

const style = {
  width: 500,
  margin: 'auto'
}

const opts = {
  width: '500',
  height: '300',
  frameBorder: '0'
}

export default class Feed extends Component {
  constructor(props) {
    super(props);

    this.state = {
      videosCount: 2,
      videos: [],
      user: firebase.auth().currentUser
    };

    // window.onscroll = e => this.handleScroll(e)
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

    //this.userRef
    //  .child('videos')
    //  // .limitToFirst( 1 )
    //  .on('child_added', snapshot => {
    //    // dirty hack to handle updates only
    //    if (!this.isInitialDataLoaded) return false;
    //    console.log('handle new values', snapshot.val());
    //
    //    this.state.videos.unshift(snapshot.val());
    //
    //    this.setState({
    //      videos: this.state.videos
    //    });
    //
    //    console.log('videos:', this.state.videos, this.state.videos.length)
    //  });
  }

  //handleScroll(e) {
  //  var scroll = window.document.body;
  //  const lastVideo = this.state.videos[this.state.videos.length - 1];
  //
  //  if (!lastVideo) return;
  //
  //  if (scroll.clientHeight + scroll.scrollTop >= scroll.scrollHeight) {
  //    this.userRef
  //      .child('videos')
  //      .orderByKey()
  //      .endAt(lastVideo.id)
  //      .limitToLast(this.state.videosCount)
  //      .once('value', snapshot => {
  //        // const update = snapshot
  //        // this.state.videos.push( snapshot.val() );
  //        Array.prototype.push.apply(this.state.videos, values(snapshot.val()));
  //        this.setState({
  //          videos: this.state.videos
  //        });
  //      });
  //  }
  //}

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
      <div style={{ marginBottom: 20 }}>
        <FeedVideo key={index} videoKey={id} opts={opts} />
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
