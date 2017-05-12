var alt = require('../alt');
import LoginActions from '../actions/LoginActions';
import Util from '../comms/util/util';

class LoginStore {
  constructor() {

    if (('jwt' in sessionStorage) && (sessionStorage.jwt != null)) {
      try {
        this.token = sessionStorage.jwt;
        this.user = JSON.parse(atob(this.token.split('.')[1]));
        Util.token = this.token;
        this.authenticated = true;
      } catch (e) {
        console.error('invalid session information detected', e);
        this.authenticated = false;
        this.user = null;
        this.token = undefined;
        delete sessionStorage.jwt;
      }
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
    delete sessionStorage.jwt
  }

  handleLogout() {
    this.error = null;
    this.loading = false;
    this.authenticated = false;
    this.token = null;
    delete sessionStorage.jwt
  }
}

var _store =  alt.createStore(LoginStore, 'LoginStore');
export default _store;
