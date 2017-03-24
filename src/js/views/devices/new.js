import React, { Component } from 'react';
import ReactDOM from 'react-dom';

// import deviceManager from '../../comms/devices/DeviceManager';
// import DeviceStore from '../../stores/DeviceStore';
// import DeviceActions from '../../actions/DeviceActions';
// import TemplateStore from '../../stores/TemplateStore';
// import TemplateActions from '../../actions/TemplateActions';

import PageHeader from "../../containers/full/PageHeader";
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { Link } from 'react-router'

import alt from '../../alt';
import AltContainer from 'alt-container';
import DeviceActions from '../../actions/DeviceActions';


const FormActions = alt.generateActions('set', 'update');
class FStore {
  constructor() {
    this.device = {};
    this.bindListeners({
      set: FormActions.SET,
      update: FormActions.UPDATE
    });
    this.set(null);
  }

  set(device) {
    if (device === null || device === undefined) {
      this.device = {
        label: "",
        id: "",
        protocol: "",
        templates: [],
        tags: [],
        attrs: []
      };
    } else {
      this.device = device;
    }
  }

  update(diff) {
    this.device[diff.f] = diff.v;
  }
}
var FormStore = alt.createStore(FStore, 'FormStore');


class CreateDeviceActions extends Component {
  constructor(props) {
    super(props);

    this.save = this.save.bind(this);
  }

  save(e) {
    console.log('about to save', FormStore.getState().device);
    e.preventDefault();
    DeviceActions.addDevice(JSON.parse(JSON.stringify(FormStore.getState().device)));
  }

  render() {
    return (
      <div>
        <a className="waves-effect waves-light btn" onClick={this.save} tabIndex="-1">save</a>
        <Link to="/device/list" className="waves-effect waves-light btn" tabIndex="-1">dismiss</Link>
        {/* <i className="fa fa-save"></i>
        <i className="fa fa-times"></i> */}
      </div>
    )
  }
}

function ActionHeader(props) {
  return (
    <div className="inner-header">
      <div className="title">{props.title}</div>
      <div className="actions">{props.children}</div>
    </div>
  )
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
        <a title="Remove tag" className="btn-item" onClick={this.handleRemove}>
          <i className="fa fa-times" aria-hidden="true"></i>
        </a>
      </div>
    )
  }
}

class TemplateForm extends Component {
  constructor(props) {
    super(props);

    this.state = {}
    this.handleChange = this.handleChange.bind(this);
    this.submit = this.submit.bind(this);
  }

  handleChange(event) {
    let upd = this.state;
    upd[target.name] = event.target.value;
    this.setState(upd);
  }

  submit(event) {
    event.preventDefault();
    this.props.submit(this.state);
  }

  render() {
    return (
      <span></span>
    )
  }
}

class AttrForm extends Component {
  constructor(props) {
    super(props);

    this.state = {}
    this.handleChange = this.handleChange.bind(this);
    this.submit = this.submit.bind(this);
  }

  handleChange(event) {
    let upd = this.state;
    upd[target.name] = event.target.value;
    this.setState(upd);
  }

  submit(event) {
    event.preventDefault();
    this.props.submit(this.state);
  }

  render() {
    return (
      <form>

      </form>
    )
  }
}

class DeviceForm extends Component {
  constructor(props) {
    super(props);

    // TODO this will actually be empty
    this.state = {
      newTag: "",
      options: [ "MQTT", "CoAP", "Virtual" ]
    };

    this.handleChange = this.handleChange.bind(this);
    this.addTag = this.addTag.bind(this);
    this.updateTag = this.updateTag.bind(this);
    this.removeTag = this.removeTag.bind(this);
    this.t_import = this.t_import.bind(this);
    this.t_detail = this.t_detail.bind(this);
    this.t_remove = this.t_remove.bind(this);
    this.a_edit = this.a_edit.bind(this);
    this.a_remove = this.a_remove.bind(this);
    this.a_highlight = this.a_highlight.bind(this);
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
    // let state = this.state.device;
    // state[target.name] = event.target.value;
    // this.setState({ device: state });
    event.preventDefault();
    const f = event.target.name;
    const v = event.target.value;
    FormActions.update({f: f, v: v});
  }

  updateTag(e) {
    this.setState({ newTag: e.target.value });
  }

  addTag(e) {
    let temp = this.state.device;
    temp.tags.push(this.state.newTag);
    this.setState({ device: temp });
  }

  removeTag(tag) {
    let temp = this.state.device;
    for (let i = 0; i < temp.tags.length; i++) {
      if (temp.tags[i] === tag) {
        temp.tags.splice(i, 1);
      }
    }
    this.setState({ device: temp });
  }

  create(e) {
    e.preventDefault();
    DeviceActions.addDevice(JSON.parse(JSON.stringify(this.state.newDevice)));
  }

  dismiss() {
    // TODO send user back to device list (with filters? - filter store)
  }

  t_import(template) {
    // TODO implement
    console.log("about to import", template);
  }

  t_detail(template) {
    // TODO implement
    console.log('about to detail', template);
  }

  t_remove(template) {
    // TODO implement
    console.log('about to remove', template);
  }

  a_edit(a){}
  a_remove(a){}
  a_highlight(t, a){}

  render() {
    return (
      <div className={"row device" + " " + this.props.className}>
            <div className="row detail-header">
              <div className="col s12 m10 offset-m1">
                <div className="col s3">
                  {/* TODO clickable, file upload */}
                  <div className="img">
                    <img src="images/ciShadow.svg" />
                  </div>
                </div>
                <div className="col s9">
                  <div className="input-field large col s12">
                    <label htmlFor="fld_name">Name</label>
                    <input id="fld_name" type="text"
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
                            <label htmlFor="fld_newTag" >Tag</label>
                            <input id="fld_newTag" type="text"
                                   value={this.props.newTag} onChange={this.updateTag} />
                          </div>
                        </div>
                        <div className="col s1" >
                          <div title="Add tag"
                               className="btn btn-item btn-floating waves-effect waves-light cyan darken-2"
                               onClick={this.addTag}>
                            <i className="fa fa-plus"></i>
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="wrapping-list">
                          { this.props.device.tags.map((tag) =>(
                              <DeviceTag key={tag} tag={tag} removeTag={this.removeTag} />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* TODO form for attribute and parent selection */}
            <div className="row">
              <div className="row col s12 m10 offset-m1 title-row valign-wrapper">
                <div className="title col s11">Templates used</div>
                <a className="col s1 clickable btn waves-light waves-effect">add</a>
              </div>

              <div className="row col s12 m10 offset-m1 table">
                <div className="col s12 header">
                  <div className="col s4">Name</div>
                  <div className="col s4 center-align"># Attributes</div>
                  <div className="col s2 right center-align">Actions</div>
                </div>
                <div className="col s12 body">
                  {this.props.device.templates.map((t) =>
                    <span key={t.id} className="row">
                      <div className="col s4">{t.name}</div>
                      <div className="col s4 center-align">{t.attrs.length}</div>
                      <div className="col s2 right action-container center-align">
                        <i className="clickable action fa fa-clone"  onClick={() => this.t_import(t)}/>
                        <i className="clickable action fa fa-search" onClick={() => this.t_detail(t)}/>
                        <i className="clickable action fa fa-times"  onClick={() => this.t_remove(t)}/>
                      </div>
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="row">
              <div className="row col s12 m10 offset-m1 title-row">
                <div className="title col s11">Known attributes</div>
                <a className="col s1 clickable btn waves-light waves-effect">add</a>
              </div>
              <div className="row table col s12 m10 offset-m1">
                <div className="col s12 header">
                  <div className="col s3">Name</div>
                  <div className="col s3">Type</div>
                  <div className="col s3">Value</div>
                  <div className="col s2 center-align right">Actions</div>
                </div>

                <div className="col s12 body">
                  { this.props.device.attrs.map((a) =>
                    <span key={a.id} className="row">
                      <div className="col s3">{a.label}</div>
                      <div className="col s3">{a.type}</div>
                      <div className="col s3">{a.value ? a.value : ""}</div>
                      <div className="col s2 right center-align action-container">
                        <i className="clickable action fa fa-pencil"  onClick={() => this.a_edit(a)}/>
                        <i className="clickable action fa fa-trash"  onClick={() => this.a_remove(a)}/>
                      </div>
                    </span>
                  )}

                  { this.props.device.templates.map((t) =>
                    t.attrs.map((a) =>
                      <span key={a.id} className="row">
                        <div className="col s3">{a.label}</div>
                        <div className="col s3">{a.type}</div>
                        <div className="col s3">{a.value ? a.value : ""}</div>
                        <div className="col s2 right center-align action-container">
                          <i className="clickable action fa fa-search"  onClick={() => this.a_highlight(t, a)}/>
                        </div>
                      </span>
                    )
                  )}
                </div>
              </div>
            </div>
      </div>
    )
  }
}

function NewDevice(props) {
  return (
    <div className="full-width">
      <ReactCSSTransitionGroup
        transitionName="first"
        transitionAppear={true} transitionAppearTimeout={500}
        transitionEnterTimeout={500} transitionLeaveTimeout={500} >
        <PageHeader title="device manager" subtitle="Devices" />
        <ActionHeader title="New device">
          <CreateDeviceActions />
        </ActionHeader>
        <AltContainer store={FormStore} >
          <DeviceForm className="inner-content"/>
        </AltContainer>
      </ReactCSSTransitionGroup>
    </div>
  )
}

export { NewDevice };
