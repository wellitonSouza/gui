import React from 'react';
import ReactDOM from 'react-dom';
import { Router, hashHistory } from 'react-router';

import routes from './routes';

require ('../sass/app.scss');
require ('../components/font-awesome/scss/font-awesome.scss')

ReactDOM.render(
  <Router routes={routes} history={hashHistory} />, document.getElementById('app')
);
