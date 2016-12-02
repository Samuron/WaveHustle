import React from 'react';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import YouTube from 'react-youtube';
import ReactFireMixin from 'reactfire';
import firebase from 'firebase';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import Avatar from 'material-ui/Avatar';
import Divider from 'material-ui/Divider';
import Toggle from 'material-ui/Toggle';
import {List, ListItem} from 'material-ui/List';
import {grey400, darkBlack, lightBlack} from 'material-ui/styles/colors';

const ChatMessage = ({ time, name, message, photoUrl}) => {
    var timestamp = new Date(time);
    var secondaryText = <p><span style={{ color: darkBlack }}>{timestamp.toDateString() }</span> by {name}</p>;
    var avatar = <Avatar src={photoUrl} />;
    return (
        <div>
            <ListItem leftAvatar={avatar} primaryText={message} secondaryText={secondaryText}/>
            <Divider inset={true} />
        </div>
    );
};

const VideoContent = React.createClass({
    mixins: [ReactFireMixin],

    contextTypes: {
        router: React.PropTypes.object.isRequired
    },

    getInitialState() {
      return {
          videoYouTubeId: '',
          author: '',
          photoUrl: '',
          description: '',
          messages: [],
          open: false,
          expanded: this.props.expanded
      };
    },

    componentDidMount() {
      this.subscribeOnUpdates( this.props.collection, this.props.videoKey );
    },

    componentWillReceiveProps({ videoKey }) {
      this.unbind( 'messages' );
      this.subscribeOnUpdates( this.props.collection, videoKey );
    },

    subscribeOnUpdates(collection, videoKey) {
      const videoRef = firebase.database().ref(`/${collection}/${videoKey}`);
      this.chatRef = firebase.database().ref(`/${collection}/${videoKey}/chat`);

      videoRef.once('value', snapshot => {
        const s = snapshot.val();
        this.setState(s);
      });

      this.bindAsArray(this.chatRef.orderByChild('time').limitToFirst(100), 'messages');
    },

    postMessage() {
        var user = firebase.auth().currentUser;
        this.chatRef.push({
            time: firebase.database.ServerValue.TIMESTAMP,
            message: this.state.message,
            name: user.displayName,
            photoUrl: user.photoURL
        });
        this.setState({ message: '', open: true });
    },

    handleExpandChange(expanded) {
        this.setState({ expanded: expanded });
    },

    handleToggle(event, toggle) {
        this.setState({ expanded: toggle });
    },

    render() {
        var messages = this.state.messages.slice(0).reverse();
        return (
            <Card expanded={this.state.expanded} onExpandChange={this.handleExpandChange}>
                <CardHeader
                    title={this.state.author}
                    subtitle={this.state.description}
                    avatar={this.state.photoUrl}
                    actAsExpander={true}
                    showExpandableButton={true}/>
                <CardText>
                    <Toggle
                        toggled={this.state.expanded}
                        onToggle={this.handleToggle}
                        labelPosition="right"
                        label="Expand video"
                        />
                </CardText>
                <CardMedia expandable={true}>
                    {
                        this.state.videoYouTubeId ? <YouTube
                            videoId={this.state.videoYouTubeId}
                            opts={this.props.opts}
                            onReady={this.props.onReady}
                            onStateChange={this.props.onStateChange}
                            /> : null
                    }
                </CardMedia>
                <CardTitle title="Comment" subtitle="What do you think about this video?" />
                <CardText>
                    <TextField
                      hintText="Your comment"
                      value={this.state.message}
                      onChange={e => this.setState({ message: e.target.value })}
                    />
                </CardText>
                <CardActions>
                    <FlatButton onClick={this.postMessage} label="Add" primary={true}/>
                    {this.props.children}
                </CardActions>
                <List style={{ maxHeight: 300, overflow: 'scroll' }}>
                    {messages.map((message, index) => <ChatMessage key={index} {...message} />) }
                </List>
            </Card>
        )
    }
})

export default VideoContent;
