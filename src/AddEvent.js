import React from 'react';
import firebase from 'firebase';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import DatePicker from 'material-ui/DatePicker';

export default class AddEvent extends React.Component {
  constructor(props) {
    super(props);
    var user = firebase.auth().currentUser;
    this.state = {
      creator: user.displayName,
      creatorPhotoUrl: user.photoURL,
      name: '',
      place: '',
      date: '',
      photoUrl: '',
      description: '',
      open: false
    }
  }

  handleOpen = () => { this.setState({ open: true }); };
  handleClose = () => { this.setState({ open: false }); };
  setName = (e, name) => { this.setState({ name }); };
  setPlace = (e, place) => { this.setState({ place }); };
  setDate = (e, date) => { this.setState({ date: date.toDateString() }); };
  setPhotoUrl = (e, photoUrl) => { this.setState({ photoUrl }); };
  setPrice = (e, price) => { this.setState({ price }); };
  setDescription = (e, description) => { this.setState({ description }); };
  saveToDb = () => {
    debugger;
    firebase.database().ref(`/threads/${this.props.threadId}/events`).push(this.state);
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
        label="Submit"
        primary={true}
        keyboardFocused={true}
        onTouchTap={this.saveToDb}
        />,
    ];

    return (
      <div>
        <RaisedButton label="Add event" onTouchTap={this.handleOpen} />
        <Dialog title="Tell us about event" actions={actions} modal={true} open={this.state.open}>
          <TextField hintText="How would you like it to be called?" onChange={this.setName} />
          <br />
          <TextField hintText="Where would you like it to be held?" onChange={this.setPlace} />
          <br />
          <DatePicker hintText="Bro, do you even know when?" onChange={this.setDate} />
          <br />
          <TextField hintText="Share a photo?" onChange={this.setPhotoUrl} />
          <br />
          <TextField hintText="The best things in life are free" onChange={this.setPrice} />
          <br />
          <TextField hintText="A few strokes about your event" onChange={this.setDescription} />
          <br />
        </Dialog>
      </div>
    );
  }
}