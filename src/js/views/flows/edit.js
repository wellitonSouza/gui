import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router'

import {PageHeader} from "../../containers/full/PageHeader";
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import FlowActions from '../../actions/FlowActions';
import FlowStore from '../../stores/FlowStore';
import AltContainer from 'alt-container';

class FlowCanvas extends Component {
  constructor(props) {
    super(props);

    this.__updateCanvas = this.__updateCanvas.bind(this);
  }

  componentDidMount() {
    FlowActions.load.defer();
    let dynRED = require('./red.js');
    var RED = dynRED.RED;
    let dynMain = require('./main.js');

    // This is required since the nodes' code are run outside of react's scope
    // Since node-red compatibility is an interesting plus, this workaround is needed
    // TODO this makes me remarkably sad
    window.RED = RED;

    function initNodes() {
      const config = { headers: {'accept': 'application/json'}}
      fetch('mashup/nodes', config)
        .then((response) => { return response.json(); })
        .then((nodes) => {
          RED.nodes.setNodeList(nodes);
          let count = 0;  // used to control the i18n updating call
          // let elem = this.scriptHolder;
          nodes.map((n) => {
            if (n.module !== "node-red") {
              count++;
              RED.i18n.loadCatalog(n.id, function() {
                count--;
                if (count === 0) {
                  // tells i18next to update the page's localization placeholders
                  // jquery makes me sad
                  $(".flows-wrapper").i18n();
                  initDOM();
                }
              });
            }
          })

          if (count === 0) {
            // jquery makes me sad
            $(".flows-wrapper").i18n();
          }
        })
        .catch((error) => { console.error('failed to init nodes config', error); });
    }

    const domEntryPoint = this.scriptHolder;
    function initDOM(dom) {
      const config = { headers: {'accept': 'text/html'}}
      fetch('mashup/nodes', config)
        .then((response) => { return response.text(); })
        .then((dom) => {
          // this makes me *VERY* sad
          $(domEntryPoint).append(dom);
          FlowActions.done();
        })
        .catch((error) => { console.error('failed to fetch nodes dom', error); });
    }

    RED.i18n.init(() => {
      RED.palette.init();
      RED.workspaces.init();
      RED.view.init();
      RED.keyboard.init();
      RED.editor.init();
      RED.typeSearch.init();
      initNodes();
    });
  }

  /**
   * Updates the redered flow when the store finishes loading
   **/
  __updateCanvas() {
    if (this.props.loading == false) {
      if (this.props.flow) {
        if (this.props.flow in this.props.flows) {
          RED.nodes.version(null);
          RED.nodes.import(this.props.flows[this.props.flow].flow);
          RED.nodes.dirty(false);
          RED.view.redraw(true);
          RED.workspaces.show(RED.__currentFlow);
        } else {
          console.error("unknown flow " + this.props.flow);
        }
      } else {
        console.log('new flow');
      }
    }
  }

  componentWillUnmount() {
    // makes sure that ongoing edits are not carried over to the next flow rendering session
    RED.workspaces.remove(null);
    RED.nodes.clear();
    window.RED = null;
    RED = null;
  }

  render() {
    // while not proper rendering per-se, it makes more sense for this to be here
    if ((this.props.canvasLoading == false) && RED) {
      this.__updateCanvas();
    }

    return (
      <div className="flows-wrapper">
        <div id="main-container">
          <div id="workspace">
            <div id="chart" tabIndex="1"></div>
            <div id="workspace-toolbar"></div>
          </div>
          <div id="editor-stack"></div>

          <div id="palette">
            {/* This gets updated on didMount */}
            <img src="mashup/red/images/spin.svg" className="palette-spinner hide"/>
            {/* This gets updated on didMount */}
            {/* <div id="palette-search" className="palette-search hide">
              <input type="text" data-i18n="[placeholder]palette.filter"></input>
            </div> */}
            {/* This gets updated on didMount */}
            <div id="palette-container" className="palette-scroll"></div>
            <div id="palette-footer">
              <a className="palette-button" id="palette-collapse-all" href="#"><i className="fa fa-angle-double-up"></i></a>
              <a className="palette-button" id="palette-expand-all" href="#"><i className="fa fa-angle-double-down"></i></a>
            </div>
            <div id="palette-shade" className="hide"></div>
          </div>
        </div>

        <div id="flows-node-scripts" ref={(elem) => (this.scriptHolder = elem)}>
          {/*
              This will actually hold a number of scripts that handle the individual node's
              configuration forms and client-side validations.
          */}
        </div>

      </div>
    )
  }
}

class FlowForm extends Component {
  render() {
    return (
      <form>
      </form>
    )
  }
}

function handleSave(flowid) {

  // fetch existing data for flow
  const fData = FlowStore.getState();
  let flow = null;
  if (flowid) {
    if (flowid in fData.flows) {
      flow = fData.flows[flowid];
    } else {
      console.error("failed to find flow context");
      return;
    }
  } else {
    // handle flow creation
    flow = fData.newFlow;
  }

  // update flow's actual configuration data
  flow.flow = RED.nodes.createCompleteNodeSet();
  console.log('full flow', flow);
  FlowActions.triggerUpdate(flowid, flow);
}

class EditFlow extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    if (this.props.params.flowid) {
      FlowActions.fetchFlow.defer(this.props.params.flowid);
    }
  }

  render() {
    return (
      <ReactCSSTransitionGroup transitionName="first"
          transitionAppear={true} transitionAppearTimeout={500}
          transitionEnterTimeout={500} transitionLeaveTimeout={500} >
        <PageHeader title="flow manager" subtitle="Flow configuration">
          <div>
            <a className="waves-effect waves-light btn-flat btn-ciano" onClick={() => { handleSave(this.props.params.flowid); }} >save</a>
            <Link to="/flows" className="waves-effect waves-light btn-flat btn-ciano">Dismiss</Link>
          </div>
        </PageHeader>
        <AltContainer store={FlowStore}>
          <FlowCanvas flow={this.props.params.flowid}/>
        </AltContainer>
      </ReactCSSTransitionGroup>
    );
  }
}

export { EditFlow };
