import React, { Component } from 'react';
import firebase from 'firebase';
import { Link } from 'react-router'
import {List, ListItem} from 'material-ui/List';
import {GridList, GridTile} from 'material-ui/GridList';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import ContentClear from 'material-ui/svg-icons/content/clear';

const gridStyles = {
  root: {
    display: 'flex',
    flexDirection: 'column',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  gridList: {
    overflowY: 'auto'
  },
  addButton: {
    display: 'flex',
    background: 'none',
    boxShadow: 'none'
  },
  tile: {
    background: '#444',
    borderRadius: '0.3em',
    padding: '1em',
    boxSizing: 'border-box'
  }
};

const listItemTitleStyle = {
  color: 'white',
  verticalAlign: 'middle',
  display: 'inline-block',
};

const listItemIconContainerStyle = {
  display: 'inline-block',
  textAlign: 'right'
};

const listItemIconStyle = {
  position: 'absolute',
  background: 'black',
  borderRadius: '1em',
  right: '1em',
  top: '1em'
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
    let threadId = el.currentTarget.getAttribute('data-val');
    let threadRef = firebase.database().ref(`/threads/` + threadId);
    threadRef.remove();
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
      <div style={gridStyles.root}>
        <GridList style={gridStyles.gridList}>
          {
            this.props.threads.map((thread) => {
              return (
                <Link to={`/thread/${thread.id}`} key={thread.id}>
                  <GridTile
                    style={
                      {
                        ...gridStyles.tile,
                        background: thread.photoUrl ? 'url(' + thread.photoUrl + ')' : 'grey'
                      }
                    }>
                      <div style={listItemTitleStyle}>{thread.name}: {thread.id}</div>
                      <div style={listItemIconContainerStyle}>
                        <ContentClear style={listItemIconStyle} data-val={thread.id} onClick={this.props.removeThread}/>
                      </div>
                  </GridTile>
                </Link>
              );
            })
          }
        </GridList>
        <FloatingActionButton style={gridStyles.addButton} onClick={this.props.addThread}>
          <ContentAdd />
        </FloatingActionButton>


      </div>
    );
  }
}
