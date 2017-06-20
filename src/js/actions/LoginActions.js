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
          // console.error('Caught exception (May be a misusage of defer().)', error);
          this.loginFailed(error);
        })
    }
  }

  loginSuccess(token) {
    return token;
  }

  loginFailed(error) {
    // console.error('auth failed', error, error.data);
    if (error instanceof TypeError) {
      return "No connection to server."
    }

    const data = error.data;
    if ((data.status == 401) || (data.status == 403)) {
      return "Authentication failed.";
    } else if (data.status == 500) {
      return "Internal error. Please try again later."
    } else {
      return "No connection to server."
    }
    return error;
  }

  logout() {
    return true;
  }
}

alt.createActions(LoginActions, exports);
