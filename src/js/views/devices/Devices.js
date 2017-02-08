import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import deviceManager from '../../comms/devices/DeviceManager';

import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { Link } from 'react-router'

function TagList (props) {
  const tags = props.tags;
  return (
    <div className="col m6 data">
      { tags.map((tag) => <span key={tag}>{tag}</span>) }
    </div>
  )
}

class ListItem extends Component {
  constructor(props) {
    super(props);

    this.handleEdit = this.handleEdit.bind(this);
    this.handleDetail = this.handleDetail.bind(this);
    this.handleDismiss = this.handleDismiss.bind(this);
  }

  handleDetail(e) {
    e.preventDefault();
    this.props.detailedTemplate(this.props.device.id);
  }

  handleEdit(e) {
    e.preventDefault();
    this.props.editTemplate(this.props.device.id);
  }

  handleDismiss(e) {
    e.preventDefault();
    this.props.detailedTemplate(undefined);
  }

  render() {
    let detail = this.props.detail === this.props.device.id;
    let edit = (this.props.edit === this.props.device.id) && detail;

    console.log("About to render: " + detail + " " + edit);

    const classPrefix = "lst-entry row ";
    const sizeClass = classPrefix + (detail ? "lst-detail" : "");

    return (
      <div className={sizeClass} id={this.props.device.id} onClick={detail ? null : this.handleDetail}>
        {/* <!-- text status area --> */}
        <div className="lst-line col s10">
          <div className="lst-title col s12">
            <span>{this.props.device.label}</span>
          </div>
          <div className="col m12 hide-on-small-only">
            <div className="col m4 data no-padding-left">{this.props.device.id}</div>
            <div className="col m2 data">{this.props.device.type}</div>
            {/* this is col m6 */}
            <TagList tags={this.props.device.tags}/>
          </div>
        </div>

        {/* <!-- icon status area --> */}
        <div className="lst-line col s2" >
          <div className="lst-line lst-icon pull-right">
            { this.props.device.status ? (
              <span className="fa fa-wifi fa-2x"></span>
            ) : (
              <span className="fa-stack">
                <i className="fa fa-wifi fa-stack-2x"></i>
                <i className="fa fa-times fa-stack-1x no-conn"></i>
              </span>
            )}
          </div>
        </div>

        { detail && (
          <span>
          <div className="edit right inline-actions">
            <a className="btn-floating waves-green right" onClick={this.handleDismiss}>
              <i className="fa fa-times"></i>
            </a>
            <a className="btn-floating waves-green right" onClick={this.handleEdit}>
              <i className="material-icons">mode_edit</i>
            </a>
          </div>
          </span>
        )}

        { detail && (
          <div className="detailArea col s12">
            { edit ? (
              <p>Form goes here</p>
            ) : (
              <p>Details will be displayed here</p>
            )}
          </div>
        )}
      </div>
    )
  }
}

function ListRender(props) {
  const deviceList = props.devices;
  return (
    <div>
      { deviceList.map((device) =>
          <ListItem device={device} key={device.id}
                    detail={props.detail}
                    detailedTemplate={props.detailedTemplate}
                    edit={props.edit}
                    editTemplate={props.editTemplate} />
      )}
    </div>
  )
}

function MapRender(props) {
  const deviceList = props.devices;
  return (
    <div>
      <p>map goes here!</p>
    </div>
  )
}

class DeviceList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isDisplayList: true,
      filter: '',
      filteredList: props.devices,
    };

    this.handleViewChange = this.handleViewChange.bind(this);
    this.applyFiltering = this.applyFiltering.bind(this);
    this.detailedTemplate = this.detailedTemplate.bind(this);
    this.editTemplate = this.editTemplate.bind(this);
  }

  handleViewChange(event) {
    this.setState({isDisplayList: ! this.state.isDisplayList})
  }

  detailedTemplate(id) {
    console.log("about to set detail: " + id);
    if (this.state.detail && this.state.edit) {
      console.log("are you sure???");
    }

    let temp = this.state;
    temp.detail = id;
    this.setState(temp);
    return true;
  }

  editTemplate(id) {
    console.log("about to set edit: " + id);
    if (this.state.detail === id) {
      let temp = this.state;
      temp.edit = id;
      this.setState(temp);
      return true;
    }

    return false;
  }

  applyFiltering(event) {
    const filter = event.target.value;
    const idFilter = filter.match(/id:\W*([-a-fA-F0-9]+)\W?/);

    let state = this.state;
    state.filter = filter;
    state.filteredList = this.props.devices.filter(function(e) {
      let result = false;
      if (idFilter && idFilter[1]) {
        result = result || e.id.toUpperCase().includes(idFilter[1].toUpperCase());
      }

      return result || e.label.toUpperCase().includes(filter.toUpperCase());
    });

    this.setState(state);
  }

  render() {
    return (
      <div className="col m10 s12 offset-m1 " >
        {/* header */}
        <div className="row">
          <div className="col s12 m4">
            <div className="switch top-header right-align">
              <label>
                <span className="fa fa-map"></span>
                <input type="checkbox" onChange={this.handleViewChange} checked={this.state.isDisplayList}/>
                <span className="lever"></span>
                <span className="fa fa-list"></span>
              </label>
            </div>
          </div>
          <div className="col s12 col m8">
            <form role="form">
              {/* filter selection  */}
              <div className="input-field">
                <i className="search-icon prefix fa fa-filter"></i>
                <label htmlFor="deviceFiltering">Filter</label>
                <input id="deviceFiltering" type="text" onChange={this.applyFiltering}></input>
              </div>
            </form>
          </div>
        </div>

        { this.state.isDisplayList === false && <MapRender devices={this.state.filteredList}/>  }
        { this.state.isDisplayList && <ListRender devices={this.state.filteredList}
                                                  detail={this.state.detail}
                                                  detailedTemplate={this.detailedTemplate}
                                                  edit={this.state.edit}
                                                  editTemplate={this.editTemplate}/> }

        {/* <!-- footer --> */}
        <div className="col s12"></div>
        <div className="col s12">&nbsp;</div>
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
        <a title="Remove tag" className="btn-item" onClick={this.handleRemove}>
          <i className="fa fa-times" aria-hidden="true"></i>
        </a>
      </div>
    )
  }
}

class NewDevice extends Component {
  constructor(props) {
    super(props);

    this.state = {
      newDevice: {
        id: "",
        label: "asdf - teste",
        type: "",
        tags: ['1', '2', '3']
      },
      tag: "",
      options: [ "MQTT", "CoAP", "Virtual" ]
    }

    this.addTag = this.addTag.bind(this);
    this.updateTag = this.updateTag.bind(this);
    this.removeTag = this.removeTag.bind(this);
    this.createDevice = this.createDevice.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  // this allows us to remove the global script required by materialize as in docs
  componentDidMount() {
    let callback = this.handleChange.bind(this);

    let sElement = ReactDOM.findDOMNode(this.refs.dropdown);
    $(sElement).ready(function() {
      $('select').material_select();
      $('#fld_deviceTypes').on('change', callback);
    });

    let mElement = ReactDOM.findDOMNode(this.refs.modal);
    $(mElement).ready(function() {
      $('.modal').modal();
    })
  }

  updateTag(e) {
    let state = this.state;
    state.tag = e.target.value;
    this.setState(state);
  }

  addTag(e) {
    let temp = this.state.newDevice;
    temp.tags.push(this.state.tag);
    this.setState({ newDevice: temp});
  }

  removeTag(tag) {
    let temp = this.state.newDevice;
    for (let i = 0; i < temp.tags.length; i++) {
      if (temp.tags[i] === tag) {
        temp.tags.splice(i, 1);
      }
    }

    console.log("about to remove elem " + tag, temp, this.state.newDevice);
    this.setState({newDevice: temp});
  }

  createDevice() {
    this.props.createDevice(this.state.newDevice);
  }

  handleChange(event) {
    const target = event.target;
    let state = this.state.newDevice;
    state[target.name] = target.value;
    this.setState({
      newDevice: state
    });
  }

  render() {
    return (
      <div>
        <div id="newDeviceBtn" className="" >
          <button data-target="newDeviceForm" className="btn waves-effect waves-light btn-default" >
            <i className="fa fa-plus fa-2x"></i>
          </button>
        </div>
        <div className="modal" id="newDeviceForm" ref="modal">
          <div className="modal-content">
            <div className="row">
              <h2>New device</h2>
            </div>
            <div className="row">
              <div className="col s10 offset-s1">
                <form role="form">
                  {/* <!-- name --> */}
                  <div className="row">
                    <div className="input-field col s12">
                      <label htmlFor="fld_name">Name</label>
                      <input id="fld_name" type="text"
                             name="label"
                             onChange={this.handleChange}
                             value={this.state.newDevice.label} />
                    </div>
                  </div>
                  {/* <!-- device type --> */}
                  <div className="row">
                    <div className="col s12">
                      <label htmlFor="fld_deviceTypes" >Type</label>
                      <select id="fld_deviceTypes"
                              name="type"
                              ref="dropdown"
                              value={this.state.newDevice.type}
                              onChange={this.handleChange}>
                        <option value="" disabled>Select type</option>
                        {this.state.options.map((type) => <option value={type} key={type}>{type}</option>)}
                      </select>
                    </div>
                  </div>
                  {/* <!-- tags --> */}
                  <div className="row">
                    <div className="col s11">
                      <div className="input-field">
                        <label htmlFor="fld_newTag" >Tag</label>
                        <input id="fld_newTag" type="text"
                                               value={this.state.tag}
                                               onChange={this.updateTag} />
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
                      { this.state.newDevice.tags.map((tag) =>(
                          <DeviceTag key={tag} tag={tag} removeTag={this.removeTag} />
                      ))}
                    </div>
                  </div>
                </form>
              </div>
              <div className="pull-right">
                <a onClick={this.createDevice}
                   className=" modal-action modal-close waves-effect waves-green btn-flat">Create</a>
                <a className=" modal-action modal-close waves-effect waves-red btn-flat">Cancel</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

class Devices extends Component {

  constructor(props) {
    super(props);

    this.state = {
      devices: deviceManager.getDevices(),
      boxes: ['a', 'b', 'c']
    };

    this.createDevice = this.createDevice.bind(this);
    this.addBox = this.addBox.bind(this);
  }

  createDevice(device) {
    const devList = deviceManager.addDevice(device);
    this.setState({devices: devList});
  }

  addBox() {
    console.log('about to add box');
    let state = this.state;
    state.boxes.unshift('t');
    this.setState(state);
  }

  render() {
    return (
      <ReactCSSTransitionGroup
          transitionName="first"
          transitionAppear={true}
          transitionAppearTimeout={500}
          transitionEnterTimeout={500}
          transitionLeaveTimeout={500} >
        <DeviceList devices={this.state.devices}/>
        <NewDevice createDevice={this.createDevice}/>
      </ReactCSSTransitionGroup>
    );
  }
}

import { ViewDevice } from './SingleDevice'
module.exports = { Devices, ViewDevice }
