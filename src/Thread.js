import React, { Component } from 'react';
import Chat from './Chat';
import AddEvent from './AddEvent';
import EventsList from './EventCard';
import firebase from 'firebase';
import { map, orderBy } from 'lodash';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';

const styles = {
  customWidth: {
    background: '#333'
  },
};

export default class Thread extends Component {
  constructor(props) {
    super(props);
    this.addNewMessage = this.addNewMessage.bind(this);
    const { threadId } = this.props.params;
    this.threadRf = firebase.database().ref(`/threads/${threadId}`);
    this.eventsRf = firebase.database().ref(`/threads/${threadId}/events`);
    this.usersRf =  firebase.database().ref(`/users`);

    this.state = {
      messages: [],
      events: [],
      user: firebase.auth().currentUser,
      thread: {
        isPrivate: true
      },
      searchQuery: '',
      choosedUser: '',
      users: []
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
          thread: thread,
          messages: orderBy(messages, 'time')
        });
      });

    this.usersRf
      .on('value', snapshot => {
        const users = snapshot.val();
        const output = [];
        Object.keys(users).forEach(userKey => {
          output.push({...users[userKey], id: userKey });
        });
        this.setState({users: output});
      });

  }

  filterUsers() {
    return this.state.users.filter(user => !this.state.thread.users.includes(user.id));
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

  makePrivate() {
    this.threadRf.update({
      isPrivate: true,
      users: [this.state.user.uid]
    });
  }

  addUser(e, index, value) {
    this.threadRf.update({
      users: [...this.state.thread.users, value]
    });
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
        <div className="event-content" style={{ width: 870, float: 'left'}}>
          <AddEvent threadId={this.props.params.threadId} />
          {this.state.thread.isPrivate ? (
            <DropDownMenu style={styles.customWidth} value={this.state.choosedUser} onChange={this.addUser.bind(this)}>
              <MenuItem key={-1} value={''} primaryText={'add some user'} />
              {this.filterUsers().map((user, index) => (<MenuItem key={index} value={user.id} primaryText={user.displayName} />))}
            </DropDownMenu>
          ) :
            (<RaisedButton label="Make private"
                        onTouchTap={this.makePrivate.bind(this)}>
          </RaisedButton>)
          }
          <div style={{background: 'rgb(48, 48, 48)', margin: '10px 0 0 0', padding: '0 10px'}}>
            <TextField hintText="Search...."
                       fullWidth={true}
                       onChange={e => this.setState({ searchQuery: e.target.value.toLowerCase() })}/>
          </div>
          <br />
          <div style={{height: 800, overflowY: 'scroll'}}>
            {
              events.length ? <EventsList events={events} threadId={this.props.params.threadId}/> :
                <p style={{ textAlign: 'center', fontSize: 18  }}>
                  nothing found
                </p>
            }
          </div>
      </div>
        <div className="chat" style={{ width: 300, marginTop: 45, float: 'right', position: 'relative'}}>
          <Chat onMessageSubmit={this.addNewMessage} messages={this.state.messages} />
        </div>
      </div>
    );
  }
}
