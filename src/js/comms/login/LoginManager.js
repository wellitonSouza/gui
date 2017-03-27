import util from '../util';

class LoginManager {
  constructor() {
    this.baseUrl = ""
  }

  authenticate(login) {
    return util.POST(this.baseUrl + '/auth', login);
  }
}

var loginManager = new LoginManager();
export default loginManager;
