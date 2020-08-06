/* eslint-disable */
import util from '../util';
import {baseURL} from 'Src/config'

const GQL_LOGIN = (username, passwd) => `
  mutation {
  login(username: "${username}", passwd: "${passwd}") {
    jwt
    user {
      username
      profile
      permissions {
        subject
        actions
      }
    }
  }
}
`;

class LoginManager {


  authenticate(login) {
    const req = {
      query: GQL_LOGIN(login.username, login.password),
    };
    return util.POST(`${baseURL}graphql-auth/`, req);
  }

  setNewPassword(token) {
    return util.POST(`${baseURL}auth/password/resetlink?link=${token.token}`, token);
  }

  resetPassword(username) {
    return util.POST(`${baseURL}auth/password/reset/${username}`);
  }

  updatePassword(data) {
    return util.POST(`${baseURL}auth/password/update/`, data);
  }
}

const loginManager = new LoginManager();
export default loginManager;