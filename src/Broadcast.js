import React, { Component } from 'react';
import firebase from 'firebase';
import VideoContent from './VideoContent';
import YouTube from 'react-youtube';
import FlatButton from 'material-ui/FlatButton';

const Broadcast = React.createClass({
  getInitialState() {
    var broadcastId = firebase.auth().currentUser.uid;
    return {
      video: null,
      broadcastId: broadcastId,
      broadcastRef: firebase.database().ref(`/broadcasts/${broadcastId}`)
    }
  },

  contextTypes: {
    router: React.PropTypes.object.isRequired
  },

  componentDidMount() {
    this.state.broadcastRef
      .once('value', snapshot => {
        const video = snapshot.val();

        if (video) {
          this.state.broadcastRef
            .onDisconnect()
            .update({ state: 2 });
        }

        this.setState({ video });
      });
  },

  _setVideoState({ time, state }) {
    this.player.seekTo(time);
    // playing or buffering
    if (state === 1) {
      this.player.playVideo();
    } else {
      this.player.pauseVideo();
    }
  },

  onStateChange({ target, data }) {
    if (data == -1 || data == 5)
      return;

    const video = {
      time: target.getCurrentTime(),
      // if state is buffering then set previous value
      state: data == 3 ? this.state.video.state : data
    };
    this.state.broadcastRef.update(video);
  },

  onReady({ target }) {
    console.log('on ready')
    this.player = target;
    this._setVideoState(this.state.video);
  },

  stopBroadcast() {
    console.log('stop broadcast');
    this.state.broadcastRef.update({
      time: 0,
      state: 2,
      isActive: false
    });
    this._setVideoState(0, 2);
  },

  render() {
    const opts = {
      width: '500',
      height: '300',
      frameBorder: '0',
      playerVars: {
        autoPlay: 0,
        controls: 1
      }
    };

    return (
      <div style={{ width: 500, margin: 'auto' }}>
        {
          this.state.video ? <VideoContent
            videoKey={this.state.broadcastId}
            collection="broadcasts"
            expanded={true}
            opts={opts}
            onReady={e => this.onReady(e) }
            onStateChange={e => this.onStateChange(e) }>
            <FlatButton onClick={this.stopBroadcast} label="Stop" secondary={true} />
          </VideoContent> : null
        }
      </div>
    );
  }
});

export default Broadcast;
