import React from 'react';
import firebase from 'firebase';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import DatePicker from 'material-ui/DatePicker';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

export default class AddEvent extends React.Component {
  constructor(props) {
    super(props);
    var user = firebase.auth().currentUser;
    this.state = {
      creator: user.displayName,
      creatorPhotoUrl: user.photoURL,
      name: '',
      place: '',
      date: {},
      photoUrl: '',
      description: '',
      price: '',
      currency: '',
      open: false
    }
  }

  handleOpen = () => { this.setState({ open: true }); };
  handleClose = () => { this.setState({ open: false }); };
  setName = (e, name) => { this.setState({ name }); };
  setPlace = (e, place) => { this.setState({ place }); };
  setDate = (e, date) => { this.setState({ date }); };
  setPhotoUrl = (e, photoUrl) => { this.setState({ photoUrl }); };
  setPrice = (e, price) => { this.setState({ price }); };
  setDescription = (e, description) => { this.setState({ description }); };
  setCurrency = (e, i, currency) => { this.setState({ currency }); };

  saveToDb = () => {

    console.log(this.state);

    var event = {
      creator: this.state.creator,
      creatorPhotoUrl: this.state.creatorPhotoUrl,
      name: this.state.name,
      place: this.state.place,
      date: this.state.date.toDateString(),
      photoUrl: this.state.photoUrl,
      description: this.state.description,
      price: this.state.price + ' ' + this.state.currency,
    }
    firebase.database().ref(`/threads/${this.props.threadId}/events`).push(event);
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
    var dialogStyle = {
      width: '50%'
    };

    return (
      <div>
        <RaisedButton label="Add event" onTouchTap={this.handleOpen} />
        <Dialog autoScrollBodyContent={true}
                title="Tell us about event"
                actions={actions}
                modal={true}
                open={this.state.open}>
          <TextField floatingLabelText="Name"
            hintText="How would you like it to be called?"
            onChange={this.setName} fullWidth={true} />
          <br />
          <TextField floatingLabelText="Place"
            hintText="Where would you like it to be held?"
            onChange={this.setPlace} fullWidth={true} />
          <br />
          <DatePicker floatingLabelText="Date"
            hintText="Bro, do you even know when?"
            onChange={this.setDate} fullWidth={true} />
          <br />
          <TextField floatingLabelText="Photo url" hintText="Share a photo?" onChange={this.setPhotoUrl} fullWidth={true} />
          <br />
          <TextField floatingLabelText="Price"
            hintText="The best things in life are free"
            onChange={this.setPrice} fullWidth={true} />
          <SelectField floatingLabelText="Currency" value={this.state.currency} onChange={this.setCurrency} fullWidth={true}>
            <MenuItem value="UAH" primaryText="UAH" />
            <MenuItem value="USD" primaryText="USD" />
            <MenuItem value="EUR" primaryText="EUR" />
          </SelectField>
          <br />
          <TextField hintText="A few strokes about your event"
            onChange={this.setDescription} fullWidth={true} />
          <br />
        </Dialog>
      </div>
    );
  }
}
