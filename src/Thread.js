import React, { Component } from 'react';
import Chat from './Chat';
import EventCard from './EventCard';
import firebase from 'firebase';
import { map, orderBy } from 'lodash';


export default class Thread extends Component {
  constructor(props) {
    super(props);
    this.addNewMessage = this.addNewMessage.bind(this);

    this.state = {
      messages: [],
      user: firebase.auth().currentUser,
    }
  }

  componentWillMount() {
    const { threadId } = this.props.params;
    this.threadRf = firebase.database().ref(`/threads/${threadId}`);

    this.threadRf
      .on('value', snapshot => {
        const thread = snapshot.val();
        const messages = map(thread.chat, (val, key) => {
          return {
            ...val,
            id: key
          }
        });

        this.setState({
          messages: orderBy(messages, 'time')
        });
      });
  }

  addNewMessage(messageText) {
    const { threadId } = this.props.params;
    console.log('add new message', messageText);

    // TODO: get thread id
    firebase.database().ref(`/threads/${threadId}/chat`).push({
      message: messageText,
      name: this.state.user.displayName,
      photoUrl: this.state.user.photoURL,
      time: + new Date()
    })
  }

  render() {
    return (
      <div>
        <EventCard style={{ width: 300, background: 'red'}} events={[]} />
        <Chat onMessageSubmit={this.addNewMessage} messages={this.state.messages} />
      </div>
    );
  }
}
