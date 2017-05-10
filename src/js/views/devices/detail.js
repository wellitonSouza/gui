import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import { PageHeader, ActionHeader } from "../../containers/full/PageHeader";
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { Link, hashHistory } from 'react-router'

import alt from '../../alt';
import AltContainer from 'alt-container';
import DeviceActions from '../../actions/DeviceActions';
import deviceManager from '../../comms/devices/DeviceManager';
import DeviceStore from '../../stores/DeviceStore';
import util from "../../comms/util/util";

class FActions {
  set(args) { return args; }

  fetch(id) {
    return (dispatch) => {
      dispatch();
      deviceManager.getDevice(id)
      .then((d) => { this.set(d); })
      .catch((error) => { console.error('Failed to get device', error); })
    }
  }
}
const FormActions = alt.createActions(FActions);
const AttrActions = alt.generateActions('set');
class FStore {
  constructor() {
    this.device = {};
    this.set();
    this.bindListeners({
      set: FormActions.SET,
      fetch: FormActions.FETCH,
    });
    this.set(null);
  }

  fetch(id) {}

  set(device) {
    if (device === null || device === undefined) {
      this.device = {
        label: "",
        id: "",
        protocol: "",
        templates: [],
        tags: [],
        attrs: [],
        static_attrs: []
      };
    } else {
      if (device.attrs == null || device.attrs == undefined) {
        device.attrs = []
      }

      if (device.static_attrs == null || device.static_attrs == undefined) {
        device.static_attrs = []
      }

      this.device = device;
    }
  }
}
var DeviceFormStore = alt.createStore(FStore, 'DeviceFormStore');

class CreateDeviceActions extends Component {
  constructor(props) {
    super(props);

    this.device = { id: props.deviceid };
    this.remove = this.remove.bind(this);
  }

  remove(e) {
    e.preventDefault();
    DeviceActions.triggerRemoval(this.device, (device) => {
      hashHistory.push('/device/list');
      Materialize.toast('Device removed', 4000);
    });
  }

  render() {
    return (
      <div>
        <a className="waves-effect waves-light btn-flat btn-ciano" tabIndex="-1"><i className="clickable fa fa-code"/></a>
        <Link to={"/device/list?detail=" + this.props.deviceid} className="waves-effect waves-light btn-flat btn-ciano" tabIndex="-1"><i className="clickable fa fa-compress" /></Link>
        <Link to={"/device/id/" + this.props.deviceid + "/edit"} className="waves-effect waves-light btn-flat btn-ciano" tabIndex="-1"><i className="clickable fa fa-pencil" /></Link>
        <a className="waves-effect waves-light btn-flat btn-ciano" onClick={this.remove} tabIndex="-1"><i className="clickable fa fa-trash"/></a>
        <Link to={"/device/list"} className="waves-effect waves-light btn-flat btn-ciano" tabIndex="-1"><i className="clickable fa fa-times" /></Link>
      </div>
    )
  }
}

class AttrCard extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const hasValue = (this.props.value && this.props.value.length > 0);
    const splitSize = "col " + (hasValue ? " s6" : " s12");

    return (
      <div className="col s12 m6 l4">
        <div className="card z-depth-2">
          <div className="card-content row">
            <div className="col s12 main">
              <div className="value title">{this.props.name}</div>
              <div className="label">Name</div>
            </div>
            <div className={splitSize}>
              <div className="value">{this.props.type}</div>
              <div className="label">Type</div>
            </div>
            {(hasValue > 0) && (
              <div className={splitSize}>
                <div className="value">{this.props.value}</div>
                <div className="label">Value</div>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }
}

function TagList (props) {
  const tags = props.tags;
  return (
    <span>
      { (tags.length > 0) ? (
        tags.map((tag) =>
          <span className="tag" key={tag}>
            <i className="fa fa-tag"></i>{tag}
          </span>
        )
      ) : (
        <sapn className="tag">No tags set</sapn>
      )}
    </span>
  )
}

class DeviceForm extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className={"row device" + " " + (this.props.className ? this.props.className : "")}>
        <div className="row detail-header">
          <div className="col s12 m10 offset-m1 valign-wrapper">
            <div className="col s3">
              {/* TODO clickable, file upload */}
              <div className="img">
                <img src="images/ciShadow.svg" />
              </div>
            </div>
            <div className="col s9 pt20px">
              <div>
                <div className="col s12">
                  <div className="title">Name</div>
                    <div className="user-label">{this.props.device.label}</div>
                  </div>
                </div>
                <div className="s12">
                  <div className="col s4" >
                    <div className="title">Protocol</div>
                    <span className="value">{this.props.device.protocol ? this.props.device.protocol : "MQTT"}</span>
                  </div>
                  <div className="col s8" >
                    <div className="title">Tags</div>
                    <TagList tags={this.props.device.tags} />
                  </div>
                </div>
            </div>
          </div>
      </div>

        <div className="row">
          <div className="col s10 offset-s1">
            <div className="title col s12">Attributes</div>
          </div>
        </div>
        <div className="list row">
          <div className="col s10 offset-s1">
            { ((this.props.device.attrs.length > 0) || (this.props.device.static_attrs.length > 0) ) ? (
              <span>
                {this.props.device.attrs.map((attr) =>
                  <AttrCard key={attr.object_id} {...attr}/>
                )}
                {this.props.device.static_attrs.map((attr) =>
                  <AttrCard key={attr.object_id} {...attr}/>
                )}
              </span>
            ) : (
              <div className="padding10 background-info">
                No attributes set
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }
}

class ViewDevice extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    FormActions.fetch(this.props.params.device);
  }

  render() {
    let title = "View device";

    return (
      <div className="full-width full-height">
        <ReactCSSTransitionGroup
          transitionName="first"
          transitionAppear={true} transitionAppearTimeout={500}
          transitionEnterTimeout={500} transitionLeaveTimeout={500} >
          <PageHeader title="device manager" subtitle="Devices" />
          <ActionHeader title={title} store={DeviceFormStore}>
            <CreateDeviceActions deviceid={this.props.params.device}/>
          </ActionHeader>
          <AltContainer store={DeviceFormStore} >
            <DeviceForm />
          </AltContainer>
        </ReactCSSTransitionGroup>
      </div>
    )
  }
}

export { ViewDevice };
