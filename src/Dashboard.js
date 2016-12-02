import React, { Component } from 'react';
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
      <DashboardComponent threads={this.state.threads} />
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
