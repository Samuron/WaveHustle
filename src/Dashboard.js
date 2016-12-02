import React, { Component } from 'react';
import firebase from 'firebase';
import { Link } from 'react-router'
import {List, ListItem} from 'material-ui/List';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import ContentClear from 'material-ui/svg-icons/content/clear';

const listStyle = {
  background: '#000',
  marginBottom: '1em'
};

const listItemStyle = {
  margin: '0.5em 0'
};

const listItemTitleStyle = {
  color: 'white',
  verticalAlign: 'middle',
  display: 'inline-block',
  width: '80%'
};

const listItemIconStyle = {
  display: 'inline-block',
  width: '15%'
};

export default class Dashboard extends Component {
  constructor(props){
    super(props);
    this.state = {
      threads: []
    };
  }

  addThread() {

  }

  removeThread(el) {
    console.log(el.currentTarget.getAttribute('data-val'));
  }

  componentDidMount() {
    this.threadsRef = firebase.database().ref(`/threads`);
    this.threadsRef.on('value', (resp) => {
      let threads = resp.val();
      let output = [];
      Object.keys(threads).forEach((threadKey) => {
          output.push({id: threadKey, ...threads[threadKey]});
      });
      this.setState({threads: output});
    });
  }

  render() {
    return (
      <div>
        <DashboardComponent threads={this.state.threads}
                            addThread={this.addThread.bind(this)}
                            removeThread={this.removeThread.bind(this)}
        />
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
        <List style={listStyle}>
          {
            this.props.threads.map((thread) => {
              return (
                <ListItem style={listItemStyle} key={thread.id}>
                  <Link to={'/thread'}>
                    <div style={listItemTitleStyle}>{thread.name}: {thread.id}</div>
                  </Link>
                  <div style={listItemIconStyle}>
                    <ContentClear data-val={thread.id} onClick={this.props.removeThread}/>
                  </div>

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
