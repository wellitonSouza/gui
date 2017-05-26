var alt = require('../alt');
import LoginActions from '../actions/LoginActions';
import Util from '../comms/util/util';

class LoginStore {
  constructor() {

    const token = Util.getToken();
    if (token) {
      this.set(token);
    } else {
      this.reset();
    }

    this.bindListeners({
      handleAuthenticate: LoginActions.AUTHENTICATE,
      handleFailure: LoginActions.LOGIN_FAILED,
      handleSuccess: LoginActions.LOGIN_SUCCESS,
      handleLogout: LoginActions.LOGOUT,
    });
  }

  set(token) {
    try {
      this.user = JSON.parse(atob(token.split('.')[1]));
      Util.setToken(token);
      this.authenticated = true;
      this.loading = false;
    } catch (e) {
      console.error('invalid session information detected', e);
      this.reset();
    }
  }

  reset() {
    this.authenticated = false;
    this.user = undefined;
    this.loading = false;
    this.authenticated = false;
    Util.setToken(undefined);
  }

  handleAuthenticate(login) {
    this.error = null;
    this.authenticated = false;
    this.loading = true;
  }

  handleSuccess(login) {
    this.error = undefined;
    this.set(login.jwt);
  }

  handleFailure(error) {
    this.error = error;
    this.reset();
  }

  handleLogout() {
    this.error = undefined;
    this.reset();
  }
}

var _store =  alt.createStore(LoginStore, 'LoginStore');
export default _store;
