import React, { Component } from 'react';
import Chat from './Chat';
import AddEvent from './AddEvent';
import EventsList from './EventCard';
import firebase from 'firebase';
import { map, orderBy } from 'lodash';


export default class Thread extends Component {
  constructor(props) {
    super(props);
    this.addNewMessage = this.addNewMessage.bind(this);
    const { threadId } = this.props.params;
    this.threadRf = firebase.database().ref(`/threads/${threadId}`);
    this.eventsRf = firebase.database().ref(`/threads/${threadId}/events`);
    this.state = {
      messages: [],
      events: [],
      user: firebase.auth().currentUser,
    }
  }

  componentWillMount() {
    this.eventsRf.on('value', (snapshot) => {
      var events = [];
      snapshot.forEach((child) => {
        var item = child.val();
        item.id = child.key;
        events.push(item);
      });

      this.setState({
        events: events
      });
    });

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

    firebase.database().ref(`/threads/${threadId}/chat`).push({
      message: messageText,
      name: this.state.user.displayName,
      photoUrl: this.state.user.photoURL,
      time: + new Date()
    })
  }

  render() {
    return (
      <div style={{ width: 1200, margin: '0 auto'}}>
        <div className="event-content" style={{ width: 870, float: 'left', height: 1000}}>
          <AddEvent threadId={this.props.params.threadId} />
          <br />
          {
            this.state.events.length ? <EventsList events={this.state.events} threadId={this.props.params.threadId} /> :
              <p style={{ textAlign: 'center', fontSize: 18  }}>
                nothing found
              </p>
          }
      </div>
        <div className="chat" style={{ width: 300, marginTop: 55, float: 'right', position: 'relative'}}>
          <Chat onMessageSubmit={this.addNewMessage} messages={this.state.messages} />
        </div>
      </div>
    );
  }
}
