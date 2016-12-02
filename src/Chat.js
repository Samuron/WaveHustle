import React, { Component } from 'react';
import Avatar from 'material-ui/Avatar';
import {List, ListItem} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import TextField from 'material-ui/TextField';
import IconButton from 'material-ui/IconButton';

const listItemStyle = {
  paddingTop: 10,
  paddingBottom: 10,
  minHeight: 40
};

const textStyle = {
  color: 'white',
  fontSize: '12px',
  margin: 0
};

const style = {
  width: 300,
  height: 300,
  textAlign: 'left',
  display: 'inline-block',
  float: 'right',
  background: 'rgb(0, 151, 167)'
};

export default class Chat extends Component {
  constructor(props) {
    super(props);

    this.state = {
      message: ''
    };
  }

  defaultProps = {
    messages: []
  };

  submit(e) {
    e.preventDefault();
    
    if (this.state.message) {
      this.props.onMessageSubmit(this.state.message);
      // after submit
      this.setState({
        message: ''
      });
    }
  }

  componentDidUpdate() {
    this.listNode.scrollTop = this.listNode.scrollHeight;
  }

  render() {
    return (
      <div style={style}>
        <div style={{height: 245, overflow: 'scroll'}} ref={node => {this.listNode = node}}>
          <List style={{paddingBottom: 0}}>
            <Subheader>Recent chats</Subheader>
            {this.props.messages.map(({ message, id, photoUrl}) => (
              <ListItem
                innerDivStyle={listItemStyle}
                key={id}
                primaryText={<p style={textStyle}>{message}</p>}
                leftAvatar={<Avatar src={photoUrl} />}
              />
            ))}
          </List>
        </div>
        <div style={{padding: '0 0 0 10px'}}>
          <form onSubmit={e => this.submit(e)}>
            <TextField name="message"
                       value={this.state.message}
                       style={{ width: 240, fontSize: 12 }}
                       onChange={(e) => this.setState({ message: e.target.value })} />
            <IconButton iconStyle={{width: 30, height: 30}}
                        onClick={e => this.submit(e)}
                        iconClassName="fa fa-paper-plane" />
          </form>
        </div>
      </div>
    );
  }
}
