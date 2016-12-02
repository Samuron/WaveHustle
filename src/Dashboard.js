import React, { Component } from 'react';
import { Link } from 'react-router';
import firebase from 'firebase';
import {List, ListItem} from 'material-ui/List';

const style = {
  background: '#000'
};

export default class Dashboard extends Component {
  constructor(props){
    super(props);
    this.state = {
      threads: [
        {
          name: 'govno',
          id: 'povidlo'
        }
      ]
    }
  }

  render() {
    return (
      <div>
        <DashboardComponent threads={this.state.threads} />
        <Link to={`/thread`}>To fake tread</Link>
      </div>
    );
  }
}

class DashboardComponent extends Component {
  constructor(props){
    super(props);
  }

  render() {

    return (
      <div>
        <List  style={style}>
          {
            this.props.threads.map((thread) => {
              return (
                <ListItem key={thread.id}>{thread.name}: {thread.id}</ListItem>
              );
            })
          }
        </List>

      </div>
    );
  }
}
