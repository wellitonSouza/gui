import { browserHistory } from 'react-router';
import i18n from 'i18next';
import loginManager from 'Comms/login/LoginManager';
import toaster from 'Comms/util/materialize';
import { AbilityUtil } from 'Components/permissions/ability';

const alt = require('../alt');

const { t } = i18n;

class LoginActions {
    authenticate(login) {
        return (dispatch) => {
            dispatch();
            loginManager.authenticate(login)
                .then((response) => {
                    browserHistory.push('/#/');
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
                    browserHistory.push('/#/login');
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
        if (error === null) { return t('login:errors.not_found'); }

        if (error instanceof TypeError) {
            return t('login:errors.no_connection');
        }

        const { data } = error;
        if ((data.status === 401) || (data.status === 403)) {
            return t('login:errors.auth_failed');
        }
        if (data.status === 500) {
            return t('login:errors.internal_error');
        }
        return t('login:errors.not_found');
    }
}

const _login = alt.createActions(LoginActions, exports);
export default _login;
