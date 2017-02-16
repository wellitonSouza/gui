var alt = require('../alt');
var MeasureActions = require('../actions/MeasureActions');

import util from '../comms/util';

class MeasureStore {
  constructor() {
    this.measures = [];
    this.error = null;

    this.bindListeners({
      handleUpdateMeasures: MeasureActions.UPDATE_MEASURES,
      handleFetchMeasures: MeasureActions.FETCH_MEASURES,
      handleFailure: MeasureActions.MEASURES_FAILED,
    });
  }

  handleUpdateMeasures(measures) {
    this.measures = measures;
    this.error = null;
  }

  handleFetchMeasures(id) {
    this.measures = [];
  }

  handleFailure(error) {
    this.error = error;
  }
}

var _store =  alt.createStore(MeasureStore, 'MeasureStore');
export default _store;
