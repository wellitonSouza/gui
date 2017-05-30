import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import AltContainer from 'alt-container';

import LoginStore from '../../stores/LoginStore';
import Login from './Login.js';

function GatekeeperRenderer(props) {
  if (props.authenticated) {
    return (
      <span>
        {props.children}
      </span>
    )
  } else {
    return (
      <Login />
    )
  }
}

class Gatekeeper extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <AltContainer store={LoginStore}>
        <GatekeeperRenderer key={localStorage.jwt}>
          {this.props.children}
        </GatekeeperRenderer>
      </AltContainer>
    )
  }
}

export default Gatekeeper;
