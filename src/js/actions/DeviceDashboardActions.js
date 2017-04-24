
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

  // @TODO generic data used to valid interfaces, we should remove it
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
    return list;
  }

  updateDevices(list) {
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
      templateManager.getLastTemplates("created")
        .then((data) => {
          console.log("templates webservice done");
          this.updateTemplates(data.templates);
        })
        .catch((error) => {
          this.unknownFailed(error);
        });
    }
  }

  fetchStats() {
    return (dispatch) => {
      // TODO add this back!
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
      deviceManager.getLastDevices("updated")
        .then((data) => {
          console.log("devices webservice done");
          this.updateDevices(data.devices);
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
