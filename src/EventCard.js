import React from 'react';
import firebase from 'firebase';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';

class EventCard extends React.Component {
  render() {
    return (
      <Card style={{ marginBottom: 10 }}>
        <CardHeader title={this.props.name} subtitle={`by ${this.props.creator}`} avatar={this.props.creatorPhotoUrl}/>
        <CardMedia
          overlay={<CardTitle title={`Hosted at ${this.props.place}`} subtitle={`Price: ${this.props.price}`}/>}>
          <img src={this.props.photoUrl}/>
        </CardMedia>
        <CardText>
          {this.props.description}
        </CardText>
      </Card>
    );
  }
}

export default class EventsList extends React.Component {
  render() {
    return (
      <div>
        {this.props.events.map(e => <EventCard key={e['.key']} {...e} />)}
      </div>
    );
  }
}
