import loginManager from '../comms/login/LoginManager';

var alt = require('../alt');

class LoginActions {

  authenticate(login) {
    return (dispatch) => {
      dispatch();
      loginManager.authenticate(login)
        .then((response) => {
          this.loginSuccess(response);
        })
        .catch((error) => {
          console.error('Caught exception (May be a misusage of defer().)', error);
          this.loginFailed("Login failed");
        })
    }
  }

  loginSuccess(token) {
    return token;
  }

  loginFailed(error) {
    return error;
  }

  logout() {
    return true;
  }
}

alt.createActions(LoginActions, exports);
