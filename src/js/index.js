/* global document */
import React from 'react';
import { render } from 'react-dom';
import { IntlProvider } from 'react-intl';
import App from './App';

render(<IntlProvider><App /></IntlProvider>, document.getElementById('app'));
