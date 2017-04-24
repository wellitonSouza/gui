import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import deviceManager from '../../comms/devices/DeviceManager';

import DeviceStore from '../../stores/DeviceStore';
import DeviceActions from '../../actions/DeviceActions';
import TemplateStore from '../../stores/TemplateStore';
import TemplateActions from '../../actions/TemplateActions';
import MeasureStore from '../../stores/MeasureStore';
import MeasureActions from '../../actions/MeasureActions';

import { PageHeader } from "../../containers/full/PageHeader";
import Filter from "../utils/Filter";

import AltContainer from 'alt-container';

import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { Link } from 'react-router'

import { Line } from 'react-chartjs-2';
import { Map, Marker, Popup, TileLayer } from 'react-leaflet';

function TagList (props) {
  const tags = props.tags;
  return (
    <span>
      {
        tags.map((tag) =>
          <span className="tag" key={tag}>
            <i className="fa fa-tag"></i>{tag}
          </span>
        )
      }
    </span>
  )
}

function SummaryItem(props) {
  let status = "disabled";
  if (props.device.status) {
    status = "online";
  } else {
    if (('enabled' in props.device) && props.device.enabled) {
      status = "offline";
    }
  }

  return (
    <div className={"clickable lst-entry-wrapper z-depth-2 col s12 " + status}>
      <div className="lst-entry-title col s12">
        <div className="img">
          <img src="images/ciShadow.svg" />
        </div>
        <div className="user-label">{props.device.label}</div>
        <div className="label">device name</div>
        <span className={"badge " + status}>{status}</span>
      </div>

      <div className="lst-entry-body col s12">
        {/* TODO fill those with actual metrics */}
        <div className="col s6 metric">
          <div className="metric-value">{props.device.attrs.length}</div>
          <div className="metric-label">Attributes</div>
        </div>
        <div className="col s6 metric last">
          <div className="metric-value">N/A</div>
          <div className="metric-label">Last update</div>
        </div>
        {/* <div className="col s4 metric last">
          <div className="metric-value">12345</div>
          <div className="metric-label">Uptime</div>
        </div> */}
      </div>
    </div>
  )
}

class Graph extends Component{
  constructor(props) {
    super(props);
  }

  render() {
    const data = {
      labels: ['', '', '', '', '', '', ''],
      datasets: [
        {
          label: 'Device data',
          fill: false,
          lineTension: 0.1,
          backgroundColor: 'rgba(75,192,192,0.4)',
          borderColor: 'rgba(75,192,192,1)',
          borderCapStyle: 'butt',
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: 'miter',
          pointBorderColor: 'rgba(75,192,192,1)',
          pointBackgroundColor: '#fff',
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: 'rgba(75,192,192,1)',
          pointHoverBorderColor: 'rgba(220,220,220,1)',
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10,
          data: [23.1, 23.0, 22.6, 22.7, 23.3, 22.9, 22.8]
        }
      ]
    }

    const options = {
      maintainAspectRatio: false,
      legend: { display: false },
      scales: {
        xAxes: [{ display: false }]
      }
    }

    return (
      <Line data={data} options={options}/>
    )
  }
}

function Position(props) {
  const position = [-22.8132384,-47.0448855];
  return (
    <Map center={position} zoom={19}>
      <TileLayer
        url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      />
      <Marker position={position}></Marker>
    </Map>
  )
}

class DetailItem extends Component {
  constructor(props) {
    super(props);

    this.props.device.tags = ["cpqd", "bld11", "temp"];
    const status = props.device.status ? 'online' : 'offline';

    this.state =  {
      measures: MeasureStore.getState().measures
    }

    this.onChange = this.onChange.bind(this);
    this.remove = this.remove.bind(this);
    this.edit = this.edit.bind(this);
    this.detail = this.detail.bind(this);
  }

  onChange(state) {
    this.setState(state);
  }

  componentDidMount() {
    MeasureStore.listen(this.onChange);
    MeasureActions.fetchMeasures("temperature");
  }

  componentWillUnmount() {
    MeasureStore.unlisten(this.onChange);
  }

  remove(e) {
    e.preventDefault();
    DeviceActions.triggerRemoval(this.props.device);
    this.props.handleDismiss();
  }

  edit(e) {
    e.preventDefault();
  }

  detail(e) {
    e.preventDefault();
  }

  render() {
    let status = "disabled";
    if (this.props.device.status) {
      status = "online";
    } else {
      if (('enabled' in this.props.device) && this.props.device.enabled) {
        status = "offline";
      }
    }

    return (
      <div className={"lst-entry-wrapper z-depth-2 col s12 " + status}>

        <div className="row detail-header">
          <div className="title">
            <div className="label">{this.props.device.label}</div>
            <div className="id">ID {this.props.device.id}</div>
          </div>
          <div className="actions">
            <div><i className="clickable fa fa-code" /></div>
            <div><i className="clickable fa fa-expand" /></div>
            <Link to={"/device/id/" + this.props.device.id + "/edit"} >
              <div><i className="clickable fa fa-pencil" /></div>
            </Link>
            <div><i className="clickable fa fa-trash" onClick={this.remove}/></div>
            <div><i className="clickable fa fa-times" onClick={this.props.handleDismiss}/></div>
          </div>
          <div className="status">{status}</div>
        </div>

        <div className="row detail-body">
          <div className="row content">
            <div className="col s9 full-height">
              <div className="row half-height">
                <div className="col s3 full-height">
                  <div className="img full-height">
                    <img src="images/ciShadow.svg" />
                  </div>
                </div>
                <div className="col s9">
                  <div className="metrics col s12">
                    <div className="metric col s4">
                      <span className="label">Attributes</span>
                      <span className="value">4</span>
                      {/* <span className="value">{this.props.device.attrs.length}</span> */}
                    </div>
                    <div className="metric col s4">
                      <span className="label">Last update</span>
                      <span className="value">2017/03/29 10:42:27</span>
                    </div>
                    <div className="metric col s4">
                      <span className="label">Uptime</span>
                      <span className="value">N/A</span>
                    </div>
                  </div>

                  <div className="metrics col s12">
                    <div className="metric col s4" >
                      <span className="label">Protocol</span>
                      <span className="value">{this.props.device.protocol ? this.props.device.protocol : "MQTT"}</span>
                    </div>
                    <div className="metric col s8" >
                      <span className="label">Tags</span>
                      <TagList tags={this.props.device.tags} />
                    </div>
                  </div>
                </div>
              </div>
              <div className="row half-height">
                <div className="col s4 full-height">
                  <div className="text-info full-height">
                    <div className="title">Attributes</div>
                    <div className="">
                      <ul>
                        <li>
                          {/* TODO get this from store */}
                          <span className="col s6 label">Manufacturer</span>
                          <span className="col s6 value">CPqD</span>
                        </li>
                        <li>
                          {/* TODO get this from store */}
                          <span className="col s6 label">Software version</span>
                          <span className="col s6 value">0.0.0</span>
                        </li>
                        <li>
                          {/* TODO get this from store */}
                          <span className="col s6 label">Serial number</span>
                          <span className="col s6 value">04b4-11e7-80c1</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="col s4 metric-card full-height">
                  <div className="graph z-depth-2 full-height">
                    <span className="title">Temperature</span>
                    <div className="contents"><Graph /></div>
                  </div>
                </div>
                <div className="col s4 metric-card full-height">
                  <div className="graph z-depth-2 full-height">
                    <span className="title">Metric Name</span>
                    <div className="contents"><Graph /></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col s3 map z-depth-2">
              <Position />
            </div>
          </div>
        </div>
      </div>
    )
  }
}

class ListItem extends Component {
  constructor(props) {
    super(props);

    this.handleDetail = this.handleDetail.bind(this);
    this.handleDismiss = this.handleDismiss.bind(this);
    this.handleRemove = this.handleRemove.bind(this);
  }

  handleDetail(e) {
    e.preventDefault();
    this.props.detailedTemplate({id: this.props.device.id, pos: this.props.position});
  }

  handleDismiss(e) {
    if (e) {
      e.preventDefault();
    }
    this.props.detailedTemplate(undefined);
  }

  handleRemove(e) {
    e.preventDefault();
  }

  render() {
    const detail = this.props.detail && (this.props.detail.id === this.props.device.id);
    const edit = false;

    if (detail && !edit) {
      return (
        <div className="lst-entry col s12 detail" id={this.props.device.id} onClick={detail ? null : this.handleDetail}>
          <DetailItem device={this.props.device} handleEdit={this.handleEdit} handleDismiss={this.handleDismiss}/>
        </div>
      )
    }

    if (!detail) {
      return (
        <div className="lst-entry col s12 m6 l4" id={this.props.device.id} onClick={detail ? null : this.handleDetail}>
          <SummaryItem device={this.props.device} />
        </div>
      )
    }
  }
}

function ListRender(props) {
  let deviceList = props.devices;

  if (props.loading) {
    return (
      <div className="background-info valign-wrapper">
        <i className="fa fa-circle-o-notch fa-spin fa-fw"/>
      </div>
    )
  }

  if (deviceList.length > 0) {

    function setPos(a, pos) {
      if (a === undefined || a === null) { return; }
      if (!a.hasOwnProperty('orgPos')) {
        a.orgPos = pos;
      }
    }

    function getPos(device, idx) {
      if (device.hasOwnProperty('orgPos')) { return device.orgPos; }
      return idx;
    }

    // swap positions to push assimetry to the end of the list
    let swapped = false;
    let offset = 0;
    if (props.detail && (offset = props.detail.pos % 3)){
      for (let i = props.detail.pos; i > props.detail.pos - offset; i--){
        setPos(deviceList[i], i);
        setPos(deviceList[i - 1], i - 1);
        let t = deviceList[i];
        deviceList[i] = deviceList[i-1];
        deviceList[i-1] = t;
      }
      swapped = true;
    }

    return (
      <div className="row">
        <div className="col s12  lst-wrapper">
          { deviceList.map((device, idx) =>
            <ListItem device={device} key={device.id}
              detail={props.detail}
              detailedTemplate={props.detailedTemplate}
              edit={props.edit}
              editTemplate={props.editTemplate}
              position={getPos(device, idx)}
            />
          )}
        </div>
      </div>
    )
  } else {
    return  (
      <div className="background-info valign-wrapper">No configured devices</div>
    )
  }
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
    let temp = this.state;

    if (this.state.detail && this.state.edit) {
      console.log("are you sure???");
      if (id === undefined) {
        temp.edit = undefined;
      }
    }

    temp.detail = id;
    this.setState(temp);
    return true;
  }

  editTemplate(id) {
    if (this.state.detail === id) {
      let temp = this.state;
      temp.edit = id;
      this.setState(temp);
      return true;
    }

    return false;
  }

  // handleSearchChange(event) {
  //   const filter = event.target.value;
  //   let state = this.state;
  //   state.filter = filter;
  //   state.detail = undefined;
  //   this.setState(state);
  // }

  applyFiltering(deviceList) {
    const filter = this.state.filter;
    const idFilter = filter.match(/id:\W*([-a-fA-F0-9]+)\W?/);

    return deviceList.filter(function(e) {
      let result = false;
      if (idFilter && idFilter[1]) {
        result = result || e.id.toUpperCase().includes(idFilter[1].toUpperCase());
      }

      return result || e.label.toUpperCase().includes(filter.toUpperCase());
    });
  }

  render() {
    const filteredList = this.applyFiltering(this.props.devices);

    return (
      <div className="col m10 s12 offset-m1 full-height relative">

        { this.state.isDisplayList === false && <MapRender devices={filteredList} loading={this.props.loading}/>  }
        { this.state.isDisplayList && <ListRender devices={filteredList}
                                                  detail={this.state.detail}
                                                  detailedTemplate={this.detailedTemplate}
                                                  edit={this.state.edit}
                                                  editTemplate={this.editTemplate}
                                                  loading={this.props.loading} /> }

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

class Devices extends Component {

  constructor(props) {
    super(props);

    this.filterChange = this.filterChange.bind(this);
  }

  componentDidMount() {
    DeviceActions.fetchDevices.defer();
  }

  filterChange(newFilter) {
    console.log("about to change filter: " + newFilter);
  }

  render() {
    return (
      <ReactCSSTransitionGroup
        transitionName="first"
        transitionAppear={true}
        transitionAppearTimeout={500}
        transitionEnterTimeout={500}
        transitionLeaveTimeout={500} >
        <PageHeader title="device manager" subtitle="Devices">
          {/* <Filter onChange={this.filterChange} /> */}
          <Link to="/device/new" className="waves-effect waves-light btn">
            New Device
          </Link>
        </PageHeader>
        <AltContainer store={DeviceStore}>
          <DeviceList />
        </AltContainer>
        {/* <NewDevice /> */}
      </ReactCSSTransitionGroup>
    );
  }
}
export { Devices };
