import util from '../util';

class LoginManager {
  constructor() {
    this.baseUrl = "http://172.19.0.10:8000"
  }

  authenticate(login) {
    return util.POST(this.baseUrl + '/auth', login);
  }
}

var loginManager = new LoginManager();
export default loginManager;
