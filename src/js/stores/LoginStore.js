var alt = require('../alt');
import LoginActions from '../actions/LoginActions';
import Util from '../comms/util/util';

class LoginStore {
  constructor() {
    this.error = null;
    this.authenticated = false;
    this.token = undefined;

    this.bindListeners({
      handleAuthenticate: LoginActions.AUTHENTICATE,
      handleFailure: LoginActions.LOGIN_FAILED,
      handleSuccess: LoginActions.LOGIN_SUCCESS
    });
  }

  handleAuthenticate(login) {
    this.error = null;
    this.authenticated = false;
  }

  handleSuccess(login) {
    this.error = null;
    this.authenticated = true;
    this.token = login.jwt;
    Util.token = login.jwt;
  }

  handleFailure(error) {
    this.error = error;
  }
}

var _store =  alt.createStore(LoginStore, 'LoginStore');
export default _store;
