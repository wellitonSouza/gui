var alt = require('../alt');
import LoginActions from '../actions/LoginActions';
import Util from '../comms/util/util';

class LoginStore {
  constructor() {
    this.error = null;
    this.authenticated = false;
    this.token = undefined;
    this.loading = false;
    this.user = null;

    this.bindListeners({
      handleAuthenticate: LoginActions.AUTHENTICATE,
      handleFailure: LoginActions.LOGIN_FAILED,
      handleSuccess: LoginActions.LOGIN_SUCCESS
    });
  }

  handleAuthenticate(login) {
    this.error = null;
    this.authenticated = false;
    this.loading = true;
  }

  handleSuccess(login) {
    this.error = null;
    this.authenticated = true;
    this.token = login.jwt;
    Util.token = login.jwt;
    this.loading = false;
    this.user = JSON.parse(atob(login.jwt.split('.')[1]));
  }

  handleFailure(error) {
    this.error = error;
    this.loading = false;
  }
}

var _store =  alt.createStore(LoginStore, 'LoginStore');
export default _store;
