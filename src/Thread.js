import React, { Component } from 'react';
import Chat from './Chat';
import AddEvent from './AddEvent';
import EventsList from './EventCard';
import firebase from 'firebase';
import { map, orderBy } from 'lodash';
import TextField from 'material-ui/TextField';

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
      searchQuery: ''
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
    const events = !this.state.searchQuery ? this.state.events : this.state.events.filter(event => {
      const name = event.name.toLowerCase();
      const place = event.place.toLowerCase();
      const creator = event.creator.toLowerCase();
      
      return name.indexOf(this.state.searchQuery) > -1 ||
             place.indexOf(this.state.searchQuery) > -1 ||
             creator.indexOf(this.state.searchQuery) > -1;
    });

    return (
      <div style={{ width: 1200, margin: '0 auto'}}>
        <div className="event-content" style={{ width: 870, float: 'left', height: 1000, overflowY: 'scroll'}}>
          <AddEvent threadId={this.props.params.threadId} />
          <div style={{background: 'rgb(48, 48, 48)', margin: '10px 0 0 0', padding: '0 10px'}}>
            <TextField hintText="Search...."
                       fullWidth={true}
                       onChange={e => this.setState({ searchQuery: e.target.value.toLowerCase() })}/>
          </div>
          <br />
          {
            events.length ? <EventsList events={events} threadId={this.props.params.threadId}/> :
              <p style={{ textAlign: 'center', fontSize: 18  }}>
                nothing found
              </p>
          }
      </div>
        <div className="chat" style={{ width: 300, marginTop: 45, float: 'right', position: 'relative'}}>
          <Chat onMessageSubmit={this.addNewMessage} messages={this.state.messages} />
        </div>
      </div>
    );
  }
}
