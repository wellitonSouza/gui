import React from 'react'
import { Router, hashHistory } from 'react-router';
import routes from './routes';
import Gatekeeper from './containers/login/Gatekeeper';

import PropTypes from 'prop-types'
import createClass from 'create-react-class'
import { hot } from 'react-hot-loader'

Object.assign(React, {
  PropTypes,
  createClass
})


require ('materialize-css/dist/css/materialize.min.css');
require ('font-awesome/scss/font-awesome.scss');
require ('../sass/app.scss');

const App = () => (
  <div>
    <Gatekeeper>
        <Router routes={routes} history={hashHistory} />
    </Gatekeeper>
    </div>
)

export default hot(module)(App)
