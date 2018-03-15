import React from 'react';
import ReactDOM from 'react-dom';
import { Router, hashHistory } from 'react-router';
import routes from './routes';
import Gatekeeper from './containers/login/Gatekeeper.js';

require ('materialize-css/dist/css/materialize.min.css');
require ('font-awesome/scss/font-awesome.scss');
require ('../sass/app.scss');


function Main(props) {
  return (
      <Gatekeeper>
        <Router routes={routes} history={hashHistory} />
      </Gatekeeper>
  )
}

ReactDOM.render(<Main/>, document.getElementById('app'));
