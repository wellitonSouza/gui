import React from 'react';
import { Router, Route, IndexRoute, Redirect, hashHistory } from 'react-router';

import Login from './containers/login/';
import Dashboard from './views/dashboard/';
import Full from './containers/full/';
import { Devices, ViewDevice, NewDevice }  from './views/devices';
import { TemplateList, NewTemplate } from './views/templates';
import Users from './views/users/';
import { Flows, EditFlow } from './views/flows';

export default (
  <Router history={hashHistory}>
    <Route path="/" component={Full}>
      <IndexRoute component={Dashboard} />
      <Route path="dashboard" name="Home" component={Dashboard} />
      <Route name="Device manager" >
        <Route path="deviceManager" name="Device manager" component={Dashboard} />
        <Route path="device" name="Devices">
          <IndexRoute component={Devices} />
          <Route path="list" name="Device list" component={Devices} />
          <Route path="stats" name="Device Dashboard" component={Dashboard} />
          <Route path="new" name="" component={NewDevice} />
          <Route path="id/:deviceId" name="Device detail" component={ViewDevice} />
          <Route path="id/:deviceId/edit" name="Device detail" component={Dashboard} />
        </Route>
        <Route path="template" name="Templates">
          <IndexRoute component={TemplateList} />
          <Route path="list" name="Template list" component={TemplateList} />
          <Route path="stats" name="Template Dashboard" component={Dashboard} />
          <Route path="new" name="" component={NewTemplate} />
          <Route path="id/:templateId" name="Template detail" component={TemplateList} />
          <Route path="id/:templateId/edit" name="Template detail" component={Dashboard} />
        </Route>
      </Route>
      <Route path="config" name="Settings" component={Dashboard} />

      <Route path="flows" name="Information Flows">
        <IndexRoute component={Flows} />
        <Route path="id/:flowid" name="Flow detail" component={EditFlow} />
      </Route>

      <Route path="alarm" name="Alarm" component={Dashboard} />
      <Route path="auth" name="Authentication">
        <IndexRoute component={Users} />
        <Route path="user" name="User detail" component={Users} />
        <Route path="permissions" name="Permissioning detail" component={Users} />
      </Route>

      <Route path="deploy" name="Deployment" component={Dashboard} >
        <Route path="plugins" name="Template detail" component={Dashboard} />
        <Route path="applications" name="Template detail" component={Dashboard} />
        <Route path="alarm" name="Template detail" component={Dashboard} />
      </Route>
    </Route>
  </Router>
);
