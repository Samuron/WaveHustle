import React, { Component } from 'react';
import firebase from 'firebase';
import {List, ListItem} from 'material-ui/List';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import ContentClear from 'material-ui/svg-icons/content/clear';

const listStyle = {
  background: '#000',
  marginBottom: '1em'
};

const listItemTitleStyle = {
  verticalAlign: 'middle'
};

const listItemIconStyle = {
  position: 'absolute',
  right: '2em',
  top: '1em'
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
    };
    this.removing = false;
  }

  openThread() {
    if(!this.removing){
      console.log('open thread');
    }
  }

  addThread() {

  }

  removeThread() {
    console.log('remove thread');
    this.removing = true;
    setTimeout(() => {
      this.removing = false;
    }, 1000);
  }

  render() {
    return (
      <DashboardComponent threads={this.state.threads}
                          openThread={this.openThread.bind(this)}
                          addThread={this.addThread.bind(this)}
                          removeThread={this.removeThread.bind(this)}
      />
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
        <List style={listStyle}>
          {
            this.props.threads.map((thread) => {
              return (
                <ListItem onClick={this.props.openThread} key={thread.id}>
                  <div style={listItemTitleStyle}>{thread.name}: {thread.id}</div>
                  <ContentClear onClick={this.props.removeThread} style={listItemIconStyle}/>
                </ListItem>
              );
            })
          }
        </List>
        <FloatingActionButton onClick={this.props.addThread}>
          <ContentAdd />
        </FloatingActionButton>


      </div>
    );
  }
}
