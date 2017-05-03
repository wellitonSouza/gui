import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import { PageHeader, ActionHeader } from "../../containers/full/PageHeader";
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { Link } from 'react-router'

import alt from '../../alt';
import AltContainer from 'alt-container';
import DeviceActions from '../../actions/DeviceActions';
import deviceManager from '../../comms/devices/DeviceManager';
import DeviceStore from '../../stores/DeviceStore';
import util from "../../comms/util/util";

class FActions {
  set(args) { return args; }
  update(args) { return args; }

  fetch(id) {
    return (dispatch) => {
      dispatch();
      deviceManager.getDevice(id)
      .then((d) => { this.set(d); })
      .catch((error) => { console.error('Failed to get device', error); })
    }
  }

  addTag(args) { return args; }
  removeTag(args) { return args; }
  setTag(args) { return args; }
}

const FormActions = alt.createActions(FActions);
const AttrActions = alt.generateActions('set', 'update', 'add');
class FStore {
  constructor() {
    this.device = {}; this.set();
    this.newTag = "";
    this.newAttr = {}; this.setAttr();
    this.bindListeners({
      set: FormActions.SET,
      updateDevice: FormActions.UPDATE,
      fetch: FormActions.FETCH,

      addTag: FormActions.ADD_TAG,
      removeTag: FormActions.REMOVE_TAG,
      setTag: FormActions.SET_TAG,

      setAttr: AttrActions.SET,
      updAttr: AttrActions.UPDATE,
      addAttr: AttrActions.ADD,
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

  updateDevice(diff) {
    this.device[diff.f] = diff.v;
  }

  setTag(tagName) {
    this.newTag = tagName;
  }

  addTag() {
    this.device.tags.push(this.newTag);
    this.newTag = "";
  }

  removeTag(tag) {
    this.device.tags = this.device.tags.filter((i) => {return i !== tag});
  }

  setAttr(attr) {
    if (attr) {
      this.newAttr = attr;
    } else {
      this.newAttr = {
        object_id: '',
        name: '',
        type: '',
        value: ''
      };
    }
  }

  updAttr(diff) {
    this.newAttr[diff.f] = diff.v;
  }

  addAttr() {
    this.newAttr.object_id = util.sid();
    if (this.newAttr.type === "") { this.newAttr.type = 'string'; }
    if (this.newAttr.value.length > 0) {
      this.device.static_attrs.push(JSON.parse(JSON.stringify(this.newAttr)));
    } else {
      delete this.newAttr.value;
      this.device.attrs.push(JSON.parse(JSON.stringify(this.newAttr)));
    }
    this.setAttr();
  }
}
var DeviceFormStore = alt.createStore(FStore, 'DeviceFormStore');

class CreateDeviceActions extends Component {
  constructor(props) {
    super(props);

    this.save = this.save.bind(this);
  }

  save(e) {
    e.preventDefault();
    this.props.operator(JSON.parse(JSON.stringify(DeviceFormStore.getState().device)));
  }

  render() {
    return (
      <div>
        <a className="waves-effect waves-light btn-flat btn-ciano" onClick={this.save} tabIndex="-1">save</a>
        <Link to="/device/list" className="waves-effect waves-light btn-flat btn-ciano" tabIndex="-1">dismiss</Link>
      </div>
    )
  }
}

class DeviceTag extends Component {
  constructor(props) {
    super(props);

    this.handleRemove = this.handleRemove.bind(this);
  }

  handleRemove(e) {
    this.props.removeTag(this.props.tag);
  }

  render() {
    return (
      <div key={this.props.tag}>
        {this.props.tag} &nbsp;
        <a title="Remove tag" className="btn-item clickable" onClick={this.handleRemove}>
          <i className="fa fa-times" aria-hidden="true"></i>
        </a>
      </div>
    )
  }
}

class AttrCard extends Component {
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

class NewAttr extends Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.dismiss = this.dismiss.bind(this);
    this.submit = this.submit.bind(this);
  }

  componentDidMount() {
    // materialize jquery makes me sad
    let modalElement = ReactDOM.findDOMNode(this.refs.modal);
    $(modalElement).ready(function() {
      $('.modal').modal();
    })
  }

  handleChange(event) {
    event.preventDefault();
    AttrActions.update({f: event.target.name, v: event.target.value});
  }

  dismiss(event) {
    event.preventDefault();
    let modalElement = ReactDOM.findDOMNode(this.refs.modal);
    $(modalElement).modal('close');
  }

  submit(event) {
    event.preventDefault();
    AttrActions.add();
    let modalElement = ReactDOM.findDOMNode(this.refs.modal);
    $(modalElement).modal('close');
  }

  render() {
    return (
      <span>
        <button data-target="newAttrsForm" className="btn-flat waves waves-light">new</button>
        <div className="modal" id="newAttrsForm" ref="modal">
          <div className="modal-content full">
            <div className="title row">New Attribute</div>
            <form className="row" onSubmit={this.submit}>
              <div className="row">
                <div className="input-field col s12" >
                  <label htmlFor="fld_name">Name</label>
                  <input id="fld_name" type="text"
                          name="name" value={this.props.newAttr.name}
                          key="protocol" onChange={this.handleChange} />
                </div>
                <div className="input-field col s4" >
                  <label htmlFor="fld_type">Type</label>
                  <input id="fld_type" type="text"
                        name="type" value={this.props.newAttr.type}
                        key="protocol" onChange={this.handleChange} />
                </div>
                <div className="input-field col s8" >
                  <label htmlFor="fld_value">Default value</label>
                  <input id="fld_value" type="text"
                        name="value" value={this.props.newAttr.value}
                        key="protocol" onChange={this.handleChange} />
                </div>
              </div>

              <div className="row">
                <div className="col s6 text-left">
                  <button type="button" className="btn waves waves-light" onClick={this.dismiss}>dismiss</button>
                </div>
                <div className="col s6 text-right">
                  <button type="submit" className="btn waves waves-light">save</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </span>
    )
  }
}

class DeviceForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      options: [ "MQTT", "CoAP", "Virtual" ]
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleTagChange = this.handleTagChange.bind(this);
  }

  componentWillUnmount() {
    FormActions.set(null);
  }

  componentDidMount() {
    Materialize.updateTextFields();
  }

  componentDidUpdate() {
    Materialize.updateTextFields();
  }

  handleChange(event) {
    event.preventDefault();
    const f = event.target.name;
    const v = event.target.value;
    FormActions.update({f: f, v: v});
  }

  handleTagChange(event) {
    event.preventDefault();
    FormActions.setTag(event.target.value);
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
                <div className="input-field large col s12 ">
                  <label htmlFor="fld_label">Name</label>
                  <input id="fld_label" type="text"
                         name="label" value={this.props.device.label}
                         key="label" onChange={this.handleChange} />
                </div>

                <div className="col s12">
                  <div className="input-field col s4" >
                      <label htmlFor="fld_prot">Protocol</label>
                      <input id="fld_prot" type="text"
                             name="protocol" value={this.props.device.protocol}
                             key="protocol" onChange={this.handleChange} />
                  </div>

                  <div className="col s8" >
                    <div className="row">
                      <div className="col s11">
                        <div className="input-field">
                          <label htmlFor="fld_newTag" >Add a new tag</label>
                          <input id="fld_newTag" type="text"
                                 value={this.props.newTag} onChange={this.handleTagChange} />
                        </div>
                      </div>
                      <div className="col s1" >
                        <div title="Add tag"
                             className="btn btn-item btn-floating waves-effect waves-light cyan darken-2"
                             onClick={FormActions.addTag}>
                          <i className="fa fa-plus"></i>
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="wrapping-list">
                        { this.props.device.tags.map((tag) =>(
                            <DeviceTag key={tag} tag={tag} removeTag={FormActions.removeTag} />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col s10 offset-s1">
            <div className="title col s11">Attributes</div>
            <div className="col s1">
              <NewAttr {...this.props}/>
            </div>
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

class NewDevice extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const edit = this.props.params.device;
    if (edit) {
      FormActions.fetch(edit);
    }
  }

  render() {
    let title = "New device";
    let ops = DeviceActions.addDevice;
    if (this.props.params.device) {
      title = "Edit device";
      ops = DeviceActions.triggerUpdate;
    }

    return (
      <div className="full-width full-height">
        <ReactCSSTransitionGroup
          transitionName="first"
          transitionAppear={true} transitionAppearTimeout={500}
          transitionEnterTimeout={500} transitionLeaveTimeout={500} >
          <PageHeader title="device manager" subtitle="Devices" />
          <ActionHeader title={title}>
            <CreateDeviceActions operator={ops}/>
          </ActionHeader>
          <AltContainer store={DeviceFormStore} >
            <DeviceForm />
          </AltContainer>
        </ReactCSSTransitionGroup>
      </div>
    )
  }
}

export { NewDevice };
