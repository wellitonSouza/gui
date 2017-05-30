import React from 'react';
import ReactDOM from 'react-dom';
import { Router, hashHistory } from 'react-router';

import routes from './routes';
import Gatekeeper from './containers/login/Gatekeeper.js';


import AltContainer from 'alt-container';
import LoginStore from './stores/LoginStore';

require ('../sass/app.scss');
require ('../components/font-awesome/scss/font-awesome.scss');

function Main(props) {
  return (
      <Gatekeeper>
        <Router routes={routes} history={hashHistory} />
      </Gatekeeper>
  )
}

/*
 * TODO This is not nice, and makes me really sad
 * Currently there are two alternatives to this - the first is to properly
 * implement the input fields from materialize on react, thus removing the need
 * to Materialize.updateTextFields() on componentDidMount() on a number of forms.
 * The second is to include materialize's javascript as a js dependency, thus
 * guaranteeing that it is loaded before this runs. This has the side effect of
 * making the already huge devices.js assembled file even larger.
 */
$(document).ready(() => {
  ReactDOM.render(<Main/>, document.getElementById('app'));
})
