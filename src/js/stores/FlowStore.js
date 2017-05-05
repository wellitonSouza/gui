var alt = require('../alt');
import FlowActions from '../actions/FlowActions';

class FlowStore {
  constructor() {
    this.error = null;  // general error

    this.loading = false;       // list pending request indicator
    this.flows = {};            // list of known flows

    this.newFlow = {};
    this.canvasLoading = true;

    this.bindListeners({
      fail: FlowActions.FAIL,
      fetch: FlowActions.FETCH,
      setFlows: FlowActions.SET,

      fetchFlow: FlowActions.FETCH_FLOW,
      setSingle: FlowActions.SET_SINGLE,

      done: FlowActions.DONE,
      load: FlowActions.LOAD

      // triggerUpdate: FlowActions.TRIGGER_UPDATE,
      // update: FlowActions.UPDATE,
    });
  }

  done() {
    this.canvasLoading = false;
  }

  load() {
    this.canvasLoading = true;
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
      this.flows[i.id] = JSON.parse(JSON.stringify(i));
    })
  }

  fetchFlow() {
    this.error = null;
    this.loading = true;
  }

  setSingle(flow) {
    this.error = null;
    this.loading = false;
    this.flows[flow.flow.id] = JSON.parse(JSON.stringify(flow.flow));
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
