import React from 'react';
import firebase from 'firebase';
import ReactFireMixin from 'reactfire';
import TextField from 'material-ui/TextField';
import Avatar from 'material-ui/Avatar';
import Snackbar from 'material-ui/Snackbar';
import RaisedButton from 'material-ui/RaisedButton';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import {List, ListItem} from 'material-ui/List';

const style = {
  width: 500,
  margin: 'auto'
}

const Friends = React.createClass({

  mixins: [ReactFireMixin],

  getInitialState() {
    var user = firebase.auth().currentUser;
    return {
      friendsList: [],
      user: user,
      userRef: firebase.database().ref(`/users/${user.uid}`),
      usersRef: firebase.database().ref('/users'),
      newFriendSuggestion: [],
      searchText: ''
    };
  },

  componentDidMount() {
    this.state.userRef.child('friends').limitToFirst(10).on('value', snapshot => {
      var friends = snapshot.val() || [];
      var friendsIds = this.state.friendsList.map(e => Object.keys(e)[0]);
      friends.forEach( (e, index) => {
        var friend = Object.keys(e)[0]
        if (!friendsIds.includes(friend)) {
          this.state.usersRef.orderByKey().equalTo(friend).once('value', s => {
            this.state.friendsList.push(s.val());
            this.setState({});
          })
        }
      })
    })
  },

  findFriend(value) {
    this.setState({searchText: value});
    if (value != '') {
      var friendsIds = this.state.friendsList.map(e => Object.keys(e)[0]);
      friendsIds.push(this.state.user.uid);
      this.state.usersRef
      .orderByChild('displayName')
      .startAt(value)
      .limitToFirst(3).once('value', s => {
        var search = Object.keys(s.val()).map( key => {return {[key]: s.val()[key]} } );
        search = search.filter(e => {return !friendsIds.includes(Object.keys(e)[0])})
        this.setState({ newFriendSuggestion: search})
      })
    } else {
      this.setState({newFriendSuggestion : []});
    }

  },

  addFriend(f) {
    var newFriendId = Object.keys(f)[0];
    delete f[newFriendId].videos
    delete f[newFriendId].friends
    this.state.userRef.child('friends').update({[this.state.friendsList.length]: f});
    this.state.newFriendSuggestion = this.state.newFriendSuggestion.filter(e => {Object.keys(e)[0] == newFriendId});
    var friendRef = firebase.database().ref(`/users/${newFriendId}`).child('friends')
    friendRef.once("value", s => {
      var userData = {[this.state.user.uid]: {
        displayName: this.state.user.displayName,
        photoUrl: (this.state.photoUrl || '')
      }};
      var a = {[s.numChildren()]: userData};
      friendRef.update(a);
    })
    this.setState({searchText: ''});
  },

  renderNewFriends(f, index) {
    var friendId = Object.keys(f)[0];
    var avatar = <Avatar src={f[friendId].photoUrl} />;
    return <ListItem key={index}
            leftAvatar={avatar}
            primaryText={f[friendId].displayName}
            onTouchTap={(e) => this.addFriend(f) }/>
  },

  renderFriends(v, index) {
    var friendId = Object.keys(v)[0];
    var avatar = <Avatar src={v[friendId].photoUrl} />;
    return <ListItem key={index} leftAvatar={avatar} primaryText={v[friendId].displayName} disabled={true} />
  },

  render(e) {
    return (
      <div>
        <Card style={style}>
          <CardTitle title="Whanna find a new friend?"/>
          <CardText>
            <TextField
              hintText="Friends name"
              ref="friendSearch"
              value={this.state.searchText}
              onChange={(event) => this.findFriend(event.target.value)}/>
          </CardText>
            { this.state.newFriendSuggestion.map(e => this.renderNewFriends(e)) }
          <CardTitle title="Old buddies"/>
            { this.state.friendsList.map(this.renderFriends) }
        </Card>
      </div>
    )
  }
});

export default Friends;
