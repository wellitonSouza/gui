import { hashHistory } from 'react-router';
import { t } from 'i18next';
import loginManager from 'Comms/login/LoginManager';
import toaster from 'Comms/util/materialize';
import { AbilityUtil } from 'Components/permissions/ability';

const alt = require('../alt');

class LoginActions {
    authenticate(login) {
        return (dispatch) => {
            dispatch();
            loginManager.authenticate(login)
                .then((response) => {
                    hashHistory.push('/');
                    if (response.data.login === null) {
                        this.loginFailed(response.data.login);
                    } else {
                        this.loginPermissions(response.data.login.user.permissions);
                        this.loginSuccess(response.data.login);
                    }
                })
                .catch((error) => {
                    this.loginFailed(error);
                });
        };
    }

    logout() {
        AbilityUtil.logoff();
        return true;
    }

    setPassword(login) {
        return (dispatch) => {
            dispatch();
            loginManager.setNewPassword(login)
                .then(() => {
                    hashHistory.push('/login');
                    window.location.reload();
                })
                .catch((error) => {
                    this.loginFailed(error);
                });
        };
    }

    updatePassword(data) {
        return (dispatch) => {
            dispatch();
            loginManager.updatePassword(data)
                .then(() => {
                    toaster.success(t('text.password_updated'));
                })
                .catch((error) => {
                    toaster.error(error.message);
                });
        };
    }

    resetPassword(username) {
        return (dispatch) => {
            dispatch();
            loginManager.resetPassword(username);
        };
    }

    loginSuccess(token) {
        return token;
    }

    loginPermissions(permissions) {
        AbilityUtil.loginPermissions(permissions);
        return permissions;
    }

    loginFailed(error) {
        let errMsg = '';

        if (error === null) {
            errMsg = t('login:errors.not_found');
        } else if (error instanceof TypeError) {
            errMsg = t('login:errors.no_connection');
        } else {
            const status = (error.data.status) ? error.data.status : error.data.data.status;
            if (status === 401 || status === 403) {
                errMsg = t('login:errors.auth_failed');
            } else if (status === 500) {
                errMsg = t('login:errors.internal_error');
            } else if (error.message) {
                errMsg = error.message;
            }
        }

        if (errMsg === '') {
            errMsg = t('login:errors.not_found');
        }

        toaster.error(errMsg);

        return errMsg;
    }
}

const _login = alt.createActions(LoginActions, exports);
export default _login;
