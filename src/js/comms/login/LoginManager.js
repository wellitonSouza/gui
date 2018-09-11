/* eslint-disable */
import util from '../util';

class LoginManager {
    constructor() {
        this.baseUrl = '';
    }

    authenticate(login) {
        return util.POST(`${this.baseUrl}/auth`, login);
    }

    setNewPassword(token) {
        return util.POST(`${this.baseUrl}/auth/password/resetlink?link=${token.token}`, token);
    }

    resetPassword(username) {
        return util.POST(`${this.baseUrl}/auth/password/reset/${username}`);
    }

    updatePassword(data) {
        return util.POST(`${this.baseUrl}/auth/password/update/`, data);
    }
}

const loginManager = new LoginManager();
export default loginManager;
