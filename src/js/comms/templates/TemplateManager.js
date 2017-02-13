import util from '../util';

class TemplateManager {
  constructor() {
    this.baseUrl = "http://localhost:5000"
  }

  getDevices() {
    return util.GET(this.baseUrl + '/template');
  }

  getDevice(id) {
    return util.GET(this.baseUrl + "/template/" + id);
  }

  setDevice(detail) {
    return util.PUT(this.baseUrl + "/template/" + detail.id, detail);
  }

  addDevice(d) {
    d.id = util.guid();
    return util.POST(this.baseUrl + "/template", d);
  }

  deleteDevice(id) {
    return util.DELETE(this.baseUrl + "/template/" + id);
  }

  setIcon(id, icon) {
    let data = new FormData();
    data.append('icon', icon);
    let config = {method: 'put', body: data};
    return util._runFetch(this.baseUrl + "/template/" + id + "/icon", config);
  }
}

var templateManager = new TemplateManager();
export default templateManager;
