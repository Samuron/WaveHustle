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
                title={firebase.auth().currentUser.displayName}
                onLeftIconButtonTouchTap={e => this.context.router.push('/')}
                onRightIconButtonTouchTap={e => firebase.auth().signOut()}
                iconClassNameRight="fa fa-sign-out"
                iconClassNameLeft="fa fa-home"
          />
        <div style={{ paddingTop: this.context.muiTheme.spacing.desktopKeylineIncrement }}>
          {this.props.children}
        </div>
      </div>
    );
  }
});

export default App;
