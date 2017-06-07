
import deviceManager from '../comms/devices/DeviceManager';
import templateManager from '../comms/templates/TemplateManager';

var alt = require('../alt');

class DeviceDashboardActions {

  updateStats(data, user) {

    let aux = {'incomingTransactions':'-',
      'outgoingTransactions':'-',
      'serviceTime':'-'};
    // step 0. checks if exists metrics for the user
    if (data.services[user] != undefined)
      aux = data.services[user].sum;

    // step 1. Create json with attributes to be filled
    var temp = {'title': 'Communication Stats','mainStats':[],'sideStats':[]};
    // step 2. At first, adds stats related with main indicators.
    // "# RECEIVED MESSAGES"  = incomingTransactions
    // "# SENT MESSAGES"  = outgoingTransactions
    temp.mainStats.push({'key':'# RECEIVED MESSAGES','value':aux.incomingTransactions});
    temp.mainStats.push({'key':'# SENT MESSAGES','value':aux.outgoingTransactions});
    // step 3. After, adds auxiliar stats, i.e., others useful information.
    // "AVG TIME FOR MESSAGE"  = serviceTime
    temp.sideStats.push({'key':'AVG TIME PER MESSAGE','value':aux.serviceTime});
    temp.sideStats.push({'key':'AVG UPSTREAM PER MESSAGE','value':'-'});
    temp.sideStats.push({'key':'AVG DOWNSTREAM PER MESSAGE','value':'-'});
    return temp;
  }

  updateTemplates(list) {
    return list;
  }

  updateDevices(list) {
    return list;
  }


  fetchAll(user) {
    return (dispatch) => {
      dispatch();

      this.fetchDevices();
      this.fetchTemplates();
      this.fetchStats(user);
    }
  }

  fetchTemplates() {
    return (dispatch) => {
      templateManager.getLastTemplates("created")
        .then((data) => {
          this.updateTemplates(data.templates);
        })
        .catch((error) => {
          this.unknownFailed(error);
        });
    }
  }

  fetchStats(user) {
    return (dispatch) => {
      deviceManager.getStats()
        .then((stats) => {
          this.updateStats(stats,user);
        })
        .catch((error) => {
          this.unknownFailed(error);
        });
    }
  }

  fetchDevices() {
    return (dispatch) => {
      deviceManager.getLastDevices("updated")
        .then((data) => {
          this.updateDevices(data.devices);
        })
        .catch((error) => {
          this.unknownFailed(error);
        });
    }
  }

  unknownFailed(error) {
    console.error("error", error);
    return error;
  }

}

alt.createActions(DeviceDashboardActions, exports);
