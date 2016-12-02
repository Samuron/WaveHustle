import React from 'react';
import firebase from 'firebase';
import { Card, CardActions, CardHeader, CardMedia, CardTitle, CardText } from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';
import Avatar from 'material-ui/Avatar';
import { List, ListItem } from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import Divider from 'material-ui/Divider';


function Visitor(props) {
  return (
    <ListItem primaryText={props.visitor} leftAvatar={<Avatar src={props.visitorPhotoUrl} />} />
  );
}

class EventCard extends React.Component {
  constructor(props) {
    super(props);
    this.visitEvent = this.visitEvent.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleOpen = this.handleOpen.bind(this);
    this.visitorsRf = firebase.database().ref(`/threads/${this.props.threadId}/events/${this.props.id}/visitors`);
    this.state = {
      visitors: [],
      openVisitors: false
    }
  }

  componentWillMount() {
    this.visitorsRf.on('value', (snapshot) => {
      var visitors = [];
      snapshot.forEach((child) => {
        var item = child.val();
        item.id = child.key;
        visitors.push(item);
      });

      this.setState({
        visitors: visitors
      });
    });
  }

  handleClose() {
    this.setState({ openVisitors: false });
  }

  handleOpen() {
    this.setState({ openVisitors: true });
  }

  visitEvent() {
    var user = firebase.auth().currentUser;
    this.visitorsRf.push({
      visitor: user.displayName,
      visitorPhotoUrl: user.photoURL
    });
  }

  render() {
    return (
      <Card style={{ marginBottom: 10 }}>
        <CardHeader title={this.props.name} subtitle={`by ${this.props.creator}`} avatar={this.props.creatorPhotoUrl} />
        <CardMedia
          overlay={<CardTitle title={`Hosted at ${this.props.place}`} subtitle={`Price: ${this.props.price}`} />}>
          <img src={this.props.photoUrl} />
        </CardMedia>
        <CardText>
          {this.props.description}
        </CardText>
        <CardActions>
          <RaisedButton label="I'll go" onTouchTap={this.visitEvent} />
          <RaisedButton label="Show visitors" onTouchTap={this.handleOpen} />
          <Dialog modal={false} open={this.state.openVisitors} onRequestClose={this.handleClose} >
            <List>
             <Subheader>You can meet these awesome guys</Subheader>
              {this.state.visitors.map(e => <Visitor {...e} />)}
            </List>
          </Dialog>
        </CardActions>
      </Card>
    );
  }
}

export default class EventsList extends React.Component {
  render() {
    return (
      <div>
        {this.props.events.map(e => <EventCard key={e.id} threadId={this.props.threadId} {...e} />)}
      </div>
    );
  }
}
