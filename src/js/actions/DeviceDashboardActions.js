
import deviceManager from '../comms/devices/DeviceManager';
import templateManager from '../comms/templates/TemplateManager';

var alt = require('../alt');

// TODO remove this
function fakeFetch() {
  return new Promise(function(resolve, reject) {
    setTimeout(function() {
      resolve();
    }, 250);
  });
}

class DeviceDashboardActions {

  updateStats(data) {
    return {
          'title': 'Communication Stats',
          'mainStats':[{'key':'# RECEIVED MESSAGES','value':'12'},{'key':'# SENT MESSAGES','value':'32'}],
          'sideStats':[
            {'key':'AVG TIME FOR MESSAGE','value':'2 ms'},
            {'key':'AVG UPSTREAM FOR MESSAGE','value':'32 ms'},
            {'key':'AVG DOWNSTREAM FOR MESSAGE','value':'12 ms'}
          ]};
    return data;
  }

  updateTemplates(list) {
    return [
      {id: "0",  name: "EEG templates", last_update:"27/04/2017", used_by: '3'},
      {id: "1",  name: "Wearable style", last_update:"27/04/2017", used_by: '2'},
      {id: "2",  name: "Smartphone configs", last_update:"27/04/2017", used_by: '4'}
    ]
    return list;
  }

  updateDevices(list) {
    return [
      {id: "0",  name: "EEG", uptime: "1:23:56", last_update:"27/04/2017", status:"online"},
      {id: "1",  name: "Foc.us", uptime: "1:52:56", last_update:"22/04/2017", status:"offline"},
      {id: "2",  name: "TDCs", uptime: "0:40:56", last_update:"21/04/2017", status:"disabled"},
      {id: "3", name: "Biofeedback", uptime: "3:23:56", last_update:"19/04/2017", status:"online"}
    ]
    return list;
  }


  fetchAll() {
    console.log("fetchAll")
    this.fetchDevices();
    this.fetchTemplates();
    this.fetchStats();
  }

  fetchTemplates() {
    return (dispatch) => {
      // TODO add this back!
      // userManager.getUsers()
      fakeFetch()
      // templateManager.getLastTemplates()
        .then((templateList) => {
          console.log("templates webservice done");
          this.updateTemplates(templateList);
        })
        .catch((error) => {
          this.unknownFailed(error);
        });
    }
  }

  fetchStats() {
    return (dispatch) => {
      // TODO add this back!
      // userManager.getUsers()
      fakeFetch()
      // deviceManager.getStats()
        .then((stats) => {
          console.log("stats webservice done");
          this.updateStats(stats);
        })
        .catch((error) => {
          this.unknownFailed(error);
        });
    }
  }

  fetchDevices() {
    return (dispatch) => {
      // TODO add this back!
      // userManager.getUsers()
      fakeFetch()
      // deviceManager.getLastDevices()
        .then((deviceList) => {
          console.log("devices webservice done");
          this.updateDevices(deviceList);
        })
        .catch((error) => {
          this.unknownFailed(error);
        });
    }
  }

  unknownFailed(error) {
    console.log("error", error);
    return error;
  }

}

alt.createActions(DeviceDashboardActions, exports);
