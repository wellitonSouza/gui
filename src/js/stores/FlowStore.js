var alt = require('../alt');
import FlowActions from '../actions/FlowActions';

class FlowStore {
  constructor() {
    this.error = null;  // general error

    this.loading = false;       // list pending request indicator
    this.flows = {};            // list of known flows

    this.newFlow = {};

    this.bindListeners({
      fail: FlowActions.FAIL,
      fetch: FlowActions.FETCH,
      setFlows: FlowActions.SET,
      // triggerUpdate: FlowActions.TRIGGER_UPDATE,
      // update: FlowActions.UPDATE,
    });
  }

  fetch() {
    this.error = null;
    this.flows = {};
    this.loading = true;
  }

  setFlows(flows) {
    this.error = null;
    this.loading = false;

    this.flows = {};
    flows.map((i) => {
      this.flows[i.id] = i;
    })
  }

  // triggerUpdate() {
  //   this.error = null;
  //   this.loading = true;
  // }
  //
  // update(flow) {
  //   this.error = null;
  //   this.loading = false;
  //   for(let i = 0; i < this.flows.length; i++) {
  //     if (this.flows[i].id === flow.id) {
  //       this.flows[i] = JSON.parse(JSON.stringify(flow));
  //     }
  //   }
  // }

  fail(error) {
    this.error = error;
    this.loading = false;
  }
}

var _store =  alt.createStore(FlowStore, 'FlowStore');
export default _store;
