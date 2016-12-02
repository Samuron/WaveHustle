import React, { Component } from 'react';
import firebase from 'firebase';
import { AppBar, Drawer, MenuItem, IconButton } from 'material-ui/';
import NavigationClose from 'material-ui/svg-icons/navigation/close';
import FontIcon from 'material-ui/FontIcon';

const App = React.createClass({
  getInitialState() {
    return { open: true };
  },

  contextTypes: {
    muiTheme: React.PropTypes.object.isRequired,
    router: React.PropTypes.object.isRequired
  },

  handleNavClick() {
    this.setState({ open: !this.state.open });
  },

  render() {
    return (
      <div>
        <AppBar style={{ position: 'fixed', top: 0, left: 0 }}
          onLeftIconButtonTouchTap={this.handleNavClick}
          iconClassNameRight="muidocs-icon-navigation-expand-more"
          />
        <Drawer open={this.state.open}>
          <AppBar title="Video hustle" iconElementLeft={<IconButton onClick={this.handleNavClick}><NavigationClose /></IconButton>}/>
          <MenuItem
            onClick={e => this.context.router.push('/feed') }
            leftIcon={<FontIcon className="fa fa-newspaper-o"/>}>
            Feed
          </MenuItem>
          <MenuItem
            onClick={e => this.context.router.push('/friends') }
            leftIcon={<FontIcon className="fa fa-users"/>}>
            Friends
          </MenuItem>
          <MenuItem
            onClick={e => this.context.router.push('/broadcast') }
            leftIcon={<FontIcon className="fa fa-video-camera"/>}>
            Broadcast
          </MenuItem>
          <MenuItem
            onClick={e => this.context.router.push('/subscription') }
            leftIcon={<FontIcon className="fa fa-users"/>}>
            Subscriptions
          </MenuItem>
          <MenuItem
            onClick={e => firebase.auth().signOut() }
            leftIcon={<FontIcon className="fa fa-sign-out"/>}>
            Sign out
          </MenuItem>
        </Drawer>
        <div style={{ paddingTop: this.context.muiTheme.spacing.desktopKeylineIncrement }}>
          {this.props.children}
        </div>
      </div>
    );
  }
});

export default App;
