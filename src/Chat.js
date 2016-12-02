import React, { Component } from 'react';
import Avatar from 'material-ui/Avatar';
import {List, ListItem} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import TextField from 'material-ui/TextField';
import IconButton from 'material-ui/IconButton';
import Divider from 'material-ui/Divider';

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
  maxHeight: 500,
  textAlign: 'left',
  display: 'inline-block',
  float: 'right',
  background: 'rgb(0, 151, 167)'
};

function ChatMessage({ message, name, time }) {
  const timeFormatted = new Date(time);
  let minutes = timeFormatted.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`
  }

  return (
    <p style={textStyle}>
      <span style={{color: 'rgb(72, 72, 72)'}}>
        {name}
        <i style={{ marginLeft: 10 }}>{timeFormatted.getHours()}:{minutes}</i>
      </span><br />
      {message}
    </p>
  )
}

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
        <div style={{height: 445, overflow: 'auto'}} ref={node => {this.listNode = node}}>
          <List style={{paddingBottom: 0}}>
            <Subheader>Recent chats</Subheader>
            {this.props.messages.map(({ message, id, time, name, photoUrl}) => (
              <ListItem
                innerDivStyle={listItemStyle}
                key={id}
                primaryText={<ChatMessage message={message} time={time} name={name} />}
                leftAvatar={<Avatar src={photoUrl} />}
              />
            ))}
          </List>
        </div>
        <Divider />
        <div style={{padding: '0 0 0 0px'}}>
          <form onSubmit={e => this.submit(e)}>
            <TextField name="message"
                       hintText="type message..."
                       value={this.state.message}
                       style={{ width: 240, fontSize: 12, paddingLeft: 10 }}
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
