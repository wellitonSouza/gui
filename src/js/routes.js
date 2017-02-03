import React from 'react';
import { Router, Route, IndexRoute, hashHistory } from 'react-router';

import Full from './containers/full/'
import Devices from './views/devices/'

export default (
  <Router history={hashHistory}>
    <Route path="/" name="Home" component={Full}>
      <IndexRoute component={Devices}/>
      <Route path="dashboard" name="Devices" component={Devices}/>
    </Route>
  </Router>
);
