

class TemplateManager {
  constructor() {
    this.baseUrl = "http://localhost:5000"
  }

  GET(url) {
    return this._runFetch(url);
  }

  POST(url, payload) {
    return this._runFetch(url, {
      method: 'post',
      headers: { 'content-type': 'application/json'},
      body: new Blob([JSON.stringify(payload)], {type : 'application/json'})
    });
  }

  PUT(url, payload) {
    return this._runFetch(url, {
      method: 'put',
      headers: { 'content-type': 'application/json'},
      body: new Blob([JSON.stringify(payload)], {type : 'application/json'})
    });
  }

  DELETE(url, payload) {
    return this._runFetch(url, { method: 'delete' });
  }

  _runFetch(url, config) {
    let local = this;
    return new Promise(function(resolve, reject) {
      fetch(url, config)
        .then(local._status)
        .then(local._json)
        .then(function(data) {
          resolve(data);
        })
        .catch(function(error) {
          console.log("fetch has failed", error);
        })
    })
  }

  _status(response) {
    if (response.status >= 200 && response.status < 300) {
      return Promise.resolve(response);
    } else {
      return Promise.reject(new Error(response.statusText));
    }
  }

  _json(response) {
    return response.json();
  }

  getDevices() {
    return this.GET(this.baseUrl + '/devices');
  }

  getDevice(id) {
    return this.GET(this.baseUrl + "/devices/" + id);
  }

  setDevice(detail) {
    return this.PUT(this.baseUrl + "/devices/" + detail.id, detail);
  }

  addDevice(d) {
    function guid() {
      function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
          .toString(16)
          .substring(1);
      }
      return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
    }

    d.id = guid();

    return this.POST(this.baseUrl + "/devices", d);
  }

  deleteDevice(id) {
    return this.DELETE(this.baseUrl + "/devices/" + id);
  }
}

var templateManager = new TemplateManager();

export default templateManager;
