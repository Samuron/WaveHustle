import React, { Component } from 'react';
import firebase from 'firebase';
import VideoContent from './VideoContent';
import YouTube from 'react-youtube';
import FlatButton from 'material-ui/FlatButton';

const Broadcast = React.createClass({

  getInitialState() {
    return {
      video: {},
      videoKey: this.props.params.videoKey
    }
  },

  componentDidMount() {
    firebase.database()
      .ref(`/broadcasts/${this.state.videoKey}`)
      .on( 'value', snapshot => {
        const video = snapshot.val();
        this.setState({ video });
        this._setVideoState(video);
      });
  },

  _setVideoState({ time, state }) {
    if (this.player) {
      // sync time
      this.player.seekTo(time);
      // playing or buffering
      if (state === 1) {
        this.player.playVideo();
      } else {
        this.player.pauseVideo();
      }
    }
  },

  onReady({ target }) {
    this.player = target;
  },

  render() {
    const opts = {
      width: '500',
      height: '300',
      frameBorder: '0',
      playerVars: {
        autoPlay: 0,
        controls: 0
      }
    };

    return (
      <div style={{ width: 500, margin: 'auto' }}>
        {
          this.state.videoKey ? <VideoContent
            videoKey={this.state.videoKey}
            collection="broadcasts"
            onReady={e => this.onReady(e)}
            expanded={true}
            opts={opts} /> : null
        }
      </div>
    );
  }
});

export default Broadcast;
