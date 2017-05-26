
class Util {

  getToken() {
    return localStorage.jwt;
  }

  setToken(token) {
    if (token === null || token === undefined) {
      delete localStorage.jwt;
    } else {
      localStorage.jwt = token;
    }
  }

  GET(url) {
    return this._runFetch(url, {
      method: 'get'
    });
  }

  POST(url, payload) {
    return this._runFetch(url, {
      method: 'post',
      headers: new Headers({"content-type": "application/json"}),
      body: new Blob([JSON.stringify(payload)], {type : 'application/json'})
    });
  }

  PUT(url, payload) {
    return this._runFetch(url, {
      method: 'put',
      headers: new Headers({"content-type": "application/json"}),
      body: new Blob([JSON.stringify(payload)], {type : 'application/json'})
    });
  }

  DELETE(url, payload) {
    return this._runFetch(url, { method: 'delete' });
  }

  printTime(ts) {
    let date = new Date(null);
    date.setSeconds(Math.floor(ts));

    const options = { hour12: false };
    return date.toLocaleString(undefined, options);
  }

  _runFetch(url, config) {
    let local = this;

    var authConfig = config;
    authConfig.credentials = 'include';
    if (this.getToken()) {
      if (authConfig) {
        if (authConfig.headers) {
          authConfig.headers.append('Authorization', 'Bearer ' + this.getToken());
        } else {
          authConfig.headers = new Headers();
          authConfig.headers.append('Authorization', 'Bearer ' + this.getToken());
        }
      } else {
        let headers = new Headers();
        headers.append('Authorization', 'Bearer ' + this.getToken());
        authConfig = { headers: headers };
      }
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
      if (response.status == 401) {
        this.setToken(undefined);
      }
      return Promise.reject(new Error(response.statusText));
    }
  }

  _json(response) {
    return response.json();
  }

  sid() {
    return (1 + Math.random()*4294967295).toString(16);
  }

  s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }

  guid() {
    return this.s4() + this.s4() + '-' + this.s4() + '-' + this.s4() + '-' +
      this.s4() + '-' + this.s4() + this.s4() + this.s4();
  }

  // to get formatted date
  timestamp_to_date(timestamp)
  {
      let date = new Date(null);
      date.setSeconds(Math.floor(timestamp));
      return date.toLocaleString();
  }
}

var util = new Util();
export default util;
