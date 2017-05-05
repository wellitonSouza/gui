var alt = require('../alt');
import LoginActions from '../actions/LoginActions';
import Util from '../comms/util/util';

class LoginStore {
  constructor() {

    if (sessionStorage.jwt) {
      this.token = sessionStorage.jwt;
      Util.token = this.token;
      this.authenticated = true;
      this.user = JSON.parse(atob(this.token.split('.')[1]));
    } else {
      this.authenticated = false;
      this.user = null;
      this.token = undefined;
    }

    this.error = null;
    this.loading = false;

    this.bindListeners({
      handleAuthenticate: LoginActions.AUTHENTICATE,
      handleFailure: LoginActions.LOGIN_FAILED,
      handleSuccess: LoginActions.LOGIN_SUCCESS,
      handleLogout: LoginActions.LOGOUT,
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
    this.user = JSON.parse(atob(this.token.split('.')[1]));
    sessionStorage.jwt = login.jwt;
  }

  handleFailure(error) {
    this.error = error;
    this.loading = false;
    this.authenticated = false;
    this.token = null;
    sessionStorage.jwt = null;
  }

  handleLogout() {
    this.error = null;
    this.loading = false;
    this.authenticated = false;
    this.token = null;
    sessionStorage.jwt = null;
  }
}

var _store =  alt.createStore(LoginStore, 'LoginStore');
export default _store;
