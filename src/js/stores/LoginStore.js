/* eslint-disable */
import LoginActions from '../actions/LoginActions';
import Util from '../comms/util/util';


const alt = require('../alt');

class LoginStore {
    constructor() {
        this.authenticated = false;
        //this.permissionsLogged = [];
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
            handleLogout: LoginActions.LOGOUT
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
        this.authenticated = false;
        this.loading = true;
    }

    handleSuccess(login) {
        this.error = undefined;
        this.set(login.jwt);
    }

/*    handlePermissions(permissions){
        console.log('handlePermissions',permissions );
        this.error = undefined;
        Util.setToken(permissions);
        this.permissionsLogged = permissions;
    }*/

    handleFailure(error) {
        this.error = error;
        this.reset();
    }

    handleLogout() {
        this.error = undefined;
        this.reset();
    }
}

const _store = alt.createStore(LoginStore, 'LoginStore');
export default _store;
