import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import deviceManager from '../../comms/devices/DeviceManager';

function TagList (props) {
  const tags = props.tags;
  return (
    <div className="col m6 data">
      { tags.map((tag) => <span key={tag}>{tag}</span>) }
    </div>
  )
}

function ListItem(props) {
  return (
    <div className="lst-entry row" id={props.device.id}>
      {/* <!-- text status area --> */}
      <div className="lst-line col s10">
        <div className="lst-title col s12">
          <span>{props.device.label}</span>
        </div>
        <div className="col m12 hide-on-small-only">
          <div className="col m4 data no-padding-left">{props.device.id}</div>
          <div className="col m2 data">{props.device.type}</div>
          {/* this is col m6 */}
          <TagList tags={props.device.tags}/>
        </div>
      </div>

      {/* <!-- icon status area --> */}
      <div className="lst-line col s2" >
        <div className="lst-line lst-icon pull-right">
          { props.device.status ? (
            <span className="fa fa-wifi fa-2x"></span>
          ) : (
            <span className="fa-stack">
              <i className="fa fa-wifi fa-stack-2x"></i>
              <i className="fa fa-times fa-stack-1x no-conn"></i>
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

function ListRender(props) {
  const deviceList = props.devices;
  return (
    <div>
      { deviceList.map((device) => <ListItem device={device} key={device.id} /> ) }
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
  }

  handleViewChange(event) {
    this.setState({isDisplayList: ! this.state.isDisplayList})
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
        { this.state.isDisplayList && <ListRender devices={this.state.filteredList}/> }

        {/* <!-- footer --> */}
        <div className="col s12"></div>
        <div className="col s12">&nbsp;</div>
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
        label: "",
        type: "",
        tags: []
      },
      options: [ "MQTT", "CoAP", "Virtual" ]
    }

    this.addTag = this.addTag.bind(this);
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

  addTag(t) {
    state = this.state.newDevice;
    state.tags.push(t);
    this.setState({newDevice: state});
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
                  <div className="col s10">
                    <div className="input-field">
                      <label htmlFor="fld_newTag" >Tag</label>
                      <input id="fld_newTag" type="text"></input>
                    </div>
                  </div>
                  <div className="col s2" >
                    <div title="Add tag" className="btn btn-item btn-floating waves-effect waves-light cyan darken-2" >
                      <i className="fa fa-plus"></i>
                    </div>
                  </div>
                </div>
                <div className="row">
                  {this.state.newDevice.tags.map((tag) =>(
                    <div>
                      {tag} &nbsp;
                      <a title="Remove tag" className="btn-item">
                        <i className="fa fa-times" aria-hidden="true"></i>
                      </a>
                    </div>
                  ))}
                </div>
              </form>
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
      devices: deviceManager.getDevices()
    };

    this.createDevice = this.createDevice.bind(this);
  }

  createDevice(device) {
    const devList = deviceManager.addDevice(device);
    this.setState({devices: devList});
  }

  render() {
    return (
      <page>
        <DeviceList devices={this.state.devices}/>
        <NewDevice createDevice={this.createDevice}/>
      </page>
    );
  }
}

export default Devices;
