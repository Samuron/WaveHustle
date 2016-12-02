import React, { Component } from 'react';
import Avatar from 'material-ui/Avatar';
import {List, ListItem} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import TextField from 'material-ui/TextField';
import IconButton from 'material-ui/IconButton';

const listItemStyle = {
  paddingTop: 10,
  paddingBottom: 10,
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

  submit() {
    console.log('submit', this.state.message)

    this.props.onMessage(this.state.message);
    // after submit
    this.setState({
      message: ''
    });
  }

  render() {
    return (
      <div style={style}>
        <List style={{paddingBottom: 0, height: 245, overflow: 'scroll'}}>
          <Subheader>Recent chats</Subheader>
          <ListItem
            innerDivStyle={listItemStyle}
            primaryText={
              <p style={textStyle}>
                Brendan Lim Brendan Lim Brendan Lim Brendan Lim
                Brendan Lim Brendan Lim Brendan Lim Brendan Lim
              </p>
            }
            leftAvatar={<Avatar src="http://www.material-ui.com/images/ok-128.jpg" />}
          />
          <ListItem
            innerDivStyle={listItemStyle}
            primaryText={
              <p style={textStyle}>
                Brendan Lim Brendan Lim Brendan Lim Brendan Lim
                Brendan Lim Brendan Lim Brendan Lim Brendan Lim
              </p>
            }
            leftAvatar={<Avatar src="http://www.material-ui.com/images/ok-128.jpg" />}
          />
          <ListItem
            innerDivStyle={listItemStyle}
            primaryText={
              <p style={textStyle}>
                Brendan Lim Brendan Lim Brendan Lim Brendan Lim
                Brendan Lim Brendan Lim Brendan Lim Brendan Lim
              </p>
            }
            leftAvatar={<Avatar src="http://www.material-ui.com/images/ok-128.jpg" />}
          />
          <ListItem
            innerDivStyle={listItemStyle}
            primaryText={
              <p style={textStyle}>
                Brendan Lim Brendan Lim Brendan Lim Brendan Lim
                Brendan Lim Brendan Lim Brendan Lim Brendan Lim
              </p>
            }
            leftAvatar={<Avatar src="http://www.material-ui.com/images/ok-128.jpg" />}
          />
        </List>
        <div style={{padding: '0 0 0 10px'}}>
          <TextField name="message"
                     value={this.state.message}
                     style={{ width: 240, fontSize: 12 }}
                     onChange={(e) => this.setState({ message: e.target.value })} />
          <IconButton iconStyle={{width: 30, height: 30}}
                      onClick={e => this.submit()}
                      iconClassName="fa fa-paper-plane" />
        </div>
      </div>
    );
  }
}
