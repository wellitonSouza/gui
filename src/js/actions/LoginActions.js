import loginManager from '../comms/login/LoginManager';
import Materialize from "materialize-css";
import {browserHistory} from "react-router";

let alt = require('../alt');

class LoginActions {

    authenticate(login) {
        return (dispatch) => {
            dispatch();
            loginManager.authenticate(login)
                .then((response) => {
                    browserHistory.push('/#/');
                    this.loginSuccess(response);
                })
                .catch((error) => {
                    this.loginFailed(error);
                })
        }
    }

    logout() {
        return true;
    }

    setPassword(login) {
        return (dispatch) => {
            dispatch();
            loginManager.setNewPassword(login)
                .then(() => {
                    browserHistory.push('/#/login');
                    window.location.reload();
                })
                .catch((error) => {
                    this.loginFailed(error);
                })
        }
    }

    updatePassword(data){
        return (dispatch) => {
            dispatch();
            loginManager.updatePassword(data)
                .then((reply) => {
                    console.log("REPLY: ", reply);
                    console.log("Password updated");
                })
                .catch((error) => {
                    console.log(error);
                })
        }
    }

    resetPassword(username){
        return (dispatch) => {
            dispatch();
            loginManager.resetPassword(username);
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

        Materialize.toast(error.message, 4000);
        const data = error.data;
        if ((data.status === 401) || (data.status === 403)) {
            return "Authentication failed.";
        } else if (data.status === 500) {
            return "Internal error. Please try again later."
        } else {
            return "No connection to server."
        }
        return error;
    }
}

let _login = alt.createActions(LoginActions, exports);
export default _login;
