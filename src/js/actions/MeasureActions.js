import measureManager from '../comms/measures/MeasureManager';

var alt = require('../alt');

class MeasureActions {

  updateMeasures(list) {
    return list;
  }

  fetchMeasures(id) {
    return (dispatch) => {
      dispatch();
      measureManager.getMeasures(id).then((measuresList) => {
        console.log("measures webservice done");
        this.updateMeasures(measuresList.data[0].series[0].values);
      })
      .catch((error) => {
        this.measuresFailed(error);
      });
    }
  }

  measuresFailed(error) {
    return error;
  }
}

alt.createActions(MeasureActions, exports);
