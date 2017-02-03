import React, { Component } from 'react';

function TagList (props) {
  const tags = props.tags;
  return (
    <div className="col m6 data">
      { tags.map((tag) => <span key={tag}>{tag}</span>) }
    </div>
  )
}

function ListItem(props) {
  console.log("about to render device", props.device);
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
        <div className="lst-line col m6 s12 lst-icon pull-right">
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
      display: "list",
      devices: [
        { id: '8bc74868-cc15-11e6-a2be-d3f64ba4e9f4', label: 'monitor-000', type: 'MQTT', tags:['AC control'], status: 0 },
        { id: '8bc775a4-cc15-11e6-924e-3bfc19f5a11c', label: 'monitor-001', type: 'CoAP', tags:['flood'], status: 0 },
        { id: '8bc7a736-cc15-11e6-ac37-8be4a5e2628a', label: 'monitor-002', type: 'HTTP', tags:['AC control'], status: 0 },
        { id: '8bc7e7dc-cc15-11e6-b313-0bcbaa788acd', label: 'monitor-003', type: 'MQTT', tags:['freezer'], status: 1 },
        { id: '8bc827d8-cc15-11e6-84e6-b7ab355895e2', label: 'monitor-004', type: 'MQTT', tags:['flood'], status: 0 },
        { id: '8bc8691e-cc15-11e6-b7c2-e34fd524df93', label: 'monitor-005', type: 'MQTT', tags:['flow count'], status: 1 },
        { id: '8bc8a884-cc15-11e6-bdac-8794903d72ea', label: 'monitor-006', type: 'HTTP', tags:['AC control'], status: 0 },
        { id: '8bc8ea42-cc15-11e6-87af-7764fa0701a8', label: 'monitor-007', type: 'MQTT', tags:['flow count'], status: 0 },
        { id: '8bc92930-cc15-11e6-bb29-8b44be05fada', label: 'monitor-008', type: 'HTTP', tags:['AC control'], status: 1 }
      ]
    };
  }

  handleViewChange(event) {
    console.log("got event", event, event.target.value);
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
                <input type="checkbox" onChange={this.handleViewChange}/>
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
                <input id="deviceFiltering" type="text"></input>
              </div>
            </form>
          </div>
        </div>

        { this.state.display === 'map' && <MapRender devices={this.state.devices}/>  }
        { this.state.display === 'list' && <ListRender devices={this.state.devices}/> }

        {/* contents: device list */}
        {/* { this.state.devices.map((device) => <ListItem device={device} key={device.id} />) } */}

        {/* <!-- footer --> */}
        <div className="col s12"></div>
        <div className="col s12">&nbsp;</div>

        {/* <!-- todo: move this to its own component (new device) --> */}
        <div id="newDeviceBtn" className="" >
          <a className="btn waves-effect waves-light btn-default" href="#newDeviceForm">
            <i className="fa fa-plus fa-2x"></i>
          </a>
        </div>
      </div>
    )
  }
}

class Devices extends Component {
  render() {
    return (
      <DeviceList />
    );
  }
}

export default Devices;
