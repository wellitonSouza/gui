
class Util {
  constructor() {
    this.token = undefined;
  }

  GET(url) {
    return this._runFetch(url, {
      method: 'get'
    });
  }

  POST(url, payload) {
    return this._runFetch(url, {
      method: 'post',
      body: new Blob([JSON.stringify(payload)], {type : 'application/json'})
    });
  }

  PUT(url, payload) {
    return this._runFetch(url, {
      method: 'put',
      body: new Blob([JSON.stringify(payload)], {type : 'application/json'})
    });
  }

  DELETE(url, payload) {
    return this._runFetch(url, { method: 'delete' });
  }

  _runFetch(url, config) {
    let local = this;

    var authConfig = config;
    authConfig.credentials = 'include';
    if (this.token) {
      if (authConfig) {
        if (authConfig.headers) {
          authConfig.headers.append('Authorization', 'Bearer ' + this.token);
        } else {
          authConfig.headers = new Headers();
          authConfig.headers.append('Authorization', 'Bearer ' + this.token);
        }
      } else {
        headers = new Headers();
        headers.append('Authorization', 'Bearer ' + this.token);
        authConfig = { headers: headers };
      }
    }

    if (authConfig.headers) {
      if (authConfig.headers.has('content-type') == false)
        authConfig.headers.append('content-type', 'application/json');
    } else {
      authConfig.headers = new Headers({'content-type': 'application/json'});
    }

    return new Promise(function(resolve, reject) {
      fetch(url, authConfig)
        .then(local._status)
        .then(local._json)
        .then(function(data) { resolve(data); })
        .catch(function(error) { reject(error); })
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

  guid() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
      s4() + '-' + s4() + s4() + s4();
  }
}

var util = new Util();
export default util;
