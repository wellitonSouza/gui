import React from 'react';
import { Router, Route, IndexRoute, Redirect, hashHistory } from 'react-router';

import Full from './containers/full/'
import Devices from './views/devices/'
import Dashboard from './views/dashboard/'

export default (
  <Router history={hashHistory}>
    <Route path="/" name="Home" component={Full}>
      <IndexRoute component={Dashboard}/>
      <Route path="dashboard" name="Home" component={Dashboard}/>
    </Route>

    <Route path="/devices" name="Devices" component={Full}>
      <IndexRoute component={Devices}/>
    </Route>

    <Route path="/templates" name="Device Templates" component={Full}>
      <IndexRoute component={Dashboard}/>
    </Route>

    <Route path="/config" name="Home" component={Full}>
      <IndexRoute component={Dashboard}/>
    </Route>

    <Route path="/flows" name="Home" component={Full}>
      <IndexRoute component={Dashboard}/>
    </Route>
  </Router>
);
