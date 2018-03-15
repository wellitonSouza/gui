import React, { Component } from 'react';
import AltContainer from 'alt-container';
import LoginStore from '../../stores/LoginStore';
import Login from './Login.js';
import { Router, hashHistory } from 'react-router';
import routes from "../../outsideRoutes";

function GatekeeperRenderer(props) {
  if (props.authenticated) {
    return (
      <span>
        {props.children}
      </span>
    )
  } else {
    return (
      <Router routes={routes} history={hashHistory} />
      // <Login />
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
