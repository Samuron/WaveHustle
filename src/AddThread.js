import React, { Component } from 'react';
import firebase from 'firebase';
import TextField from 'material-ui/TextField';
import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import { values, reverse, find } from 'lodash';

const style = {
  width: '100%',
  heigth: '100%'
};

export const CATEGORIES = [{
  id: 1,
  name: 'Management'
}, {
  id: 2,
  name: 'Programming'
}, {
  id: 3,
  name: 'Support'
}, {
  id: 4,
  name: 'Other'
}];

export default class AddThread extends Component {
  constructor(props) {
    super(props);
    var user = firebase.auth().currentUser;
    this.state = {
      name: "",
      photoUrl: "",
      userName: user.displayName,
      userPhotoUrl: user.photoURL,
      open: false,
      category: null,
    };
  }

  clear() {
    this.setState({
      name: "",
      photoUrl: ""
    })
  }

  handleOpen = () => { this.setState({ open: true }); };
  handleClose = () => {
    this.clear();
    this.setState({ open: false });
  };

  postThread = () => {
    if (this.state.name == "") {
      this.clear();
      return;
    }

    var thread = firebase.database().ref('/threads/').push({
      creator: this.state.userName,
      creatorPhotoUrl: this.state.userPhotoUrl,
      name: this.state.name,
      photoUrl: this.state.photoUrl,
      isPrivate: false,
      category: this.state.category
    });
    this.handleClose();
  }

  render() {
    const actions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onTouchTap={this.handleClose}
        />,
      <FlatButton
        label="Create"
        primary={true}
        keyboardFocused={true}
        onTouchTap={this.postThread}
        />,
    ];

    return (
      <div>
        <RaisedButton label="Add thread" onTouchTap={this.handleOpen} />
        <Dialog title="Create new thread" actions={actions} modal={true} open={this.state.open}>
          <br />
          Whats is it about?
          <br />
          <TextField
            hintText="Name"
            value={this.state.name}
            onChange={(event) => this.setState({ name: event.target.value })}
          />
          <br />
          Personalize it!
          <br />
          <TextField
            hintText="Add picture link"
            value={this.state.photoUrl}
            onChange={(event) => this.setState({ photoUrl: event.target.value })}
          />
          <br />
          <SelectField
            hintText="Category"
            value={this.state.category ? this.state.category.id : null}
            onChange={(e, value) => {
              this.setState({
                category: find(CATEGORIES, cat => cat.id === value)
              })
            }}
          >
            {CATEGORIES.map(category => <MenuItem key={category.id} value={category.id} primaryText={category.name} />)}
          </SelectField>
        </Dialog>
      </div>
    )
  }
};
