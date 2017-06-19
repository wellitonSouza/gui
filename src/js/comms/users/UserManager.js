import util from '../util';

class UserManager {
  constructor() {
    this.baseUrl = "/auth/user"
  }

  getUsers() {
    return util.GET(this.baseUrl);
  }

  getUser(id) {
    return util.GET(this.baseUrl + "/" + id);
  }

  setUser(detail) {
    return util.PUT(this.baseUrl + "/" + detail.id, detail);
  }

  addUser(d) {
    d.id = util.guid();
    return util.POST(this.baseUrl, d);
  }

  deleteUser(id) {
    return util.DELETE(this.baseUrl + "/" + id);
  }

  setIcon(id, icon) {
    let data = new FormData();
    data.append('icon', icon);
    let config = {method: 'put', body: data};
    return util._runFetch(this.baseUrl + "/user/" + id + "/icon", config);
  }
}

var userManager = new UserManager();
export default userManager;
