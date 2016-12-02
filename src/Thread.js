import React, { Component } from 'react';
import Chat from './Chat';
import EventCard from './EventCard';



export default class Thread extends Component {
  constructor(props) {
    super(props);
    this.addNewMessage = this.addNewMessage.bind(this)
  }

  addNewMessage(message) {
    console.log('add new message', message)
  }

  render() {
    return (
      <div>
        <EventCard style={{ width: 300, background: 'red'}} events={[]} />
        <Chat onMessageSubmit={this.addNewMessage}/>
      </div>
    );
  }
}
