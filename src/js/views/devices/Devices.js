import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import deviceManager from '../../comms/devices/DeviceManager';

import util from "../../comms/util/util";
import DeviceStore from '../../stores/DeviceStore';
import DeviceActions from '../../actions/DeviceActions';
import TemplateStore from '../../stores/TemplateStore';
import TemplateActions from '../../actions/TemplateActions';
import MeasureStore from '../../stores/MeasureStore';
import MeasureActions from '../../actions/MeasureActions';

import { PageHeader } from "../../containers/full/PageHeader";

import AltContainer from 'alt-container';

import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { Link } from 'react-router'

import { Line } from 'react-chartjs-2';
import { Map, Marker, Popup, TileLayer, Tooltip, ScaleControl } from 'react-leaflet';

import ReactResizeDetector from 'react-resize-detector';

class PositionRenderer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isTerrain: true,
      selectedPin: true
    }

    this.setTiles = this.setTiles.bind(this);
  }

  setTiles(isMap) {
    this.setState({isTerrain: isMap});
  }

  render() {

    var selectedPin = L.icon({
      iconUrl: 'images/mapMarker.png',
      iconSize: [40, 40]
    });
    
    var defaultPin = L.icon({
      iconUrl: 'images/defaultMapMarker.png',
      iconSize: [30, 30]
    });

    function getPin(device){
      if(device.select == true){
        return selectedPin;
      } else {
        return defaultPin;
      }
    }

    let parsedEntries = this.props.devices.reduce((result,k) => {
      if(!k.hide){
        result.push({
          id: k.id,
          type: k.static_attrs[0].type,
          pos: k.static_attrs[0].value,
          name: k.label,
          pin: getPin(k),
          key: k.id
        });
      }
      return result;
    }, []);


    const mapCenter = [-23.5420, -46.6370];

    const tileURL = this.state.isTerrain ? (
      'https://api.mapbox.com/styles/v1/mapbox/streets-v10/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiY2ZyYW5jaXNjbyIsImEiOiJjajhrN3VlYmowYXNpMndzN2o2OWY1MGEwIn0.xPCJwpMTrID9uOgPGK8ntg'
    ) : (
      'https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v9/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoiZm1lc3NpYXMiLCJhIjoiY2o4dnZ1ZHdhMWg5azMycDhncjdqMTg1eiJ9.Y75W4n6dTd9DOpctpizPrQ'
    )
    const attribution = '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> and Mapbox contributors';

    return (
      <Map center={mapCenter} zoom={7}>
        <TileLayer
          url={tileURL}
          attribution={attribution}
        />
        <div className="mapOptions col s12">
          <div className="mapView" onClick = {() => this.setTiles(true)}>Terrain</div>
          <div className="satelliteView" onClick = {() => this.setTiles(false)}>Satellite</div>
        </div>
        {parsedEntries.map((k) => {
        return (
          <Marker
            position={k.pos.split(",")} key={k.key} icon={k.pin}>
            <Tooltip>
              <span>{k.id} : {k.name}</span>
            </Tooltip>
          </Marker>
        )})}
        <ScaleControl />
      </Map>
    )
  }
}

class DeviceList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isDisplayList: true,
      filter: '',
      displayMap:{},
      selectedDevice:{},
      listOfDevices:[]
    };

    this.handleViewChange = this.handleViewChange.bind(this);
    this.applyFiltering = this.applyFiltering.bind(this);
    this.shouldShow = this.shouldShow.bind(this);
    this.showSelected = this.showSelected.bind(this);

    this.showAll = this.showAll.bind(this);
    this.hideAll = this.hideAll.bind(this);

    this.selectedDevice = this.selectedDevice.bind(this);
  }

  handleViewChange(event) {
    this.setState({isDisplayList: ! this.state.isDisplayList})
  }


  selectedDevice(device){
    let selectedDevice = this.state.selectedDevice;
    if (selectedDevice.hasOwnProperty(device)) {
      selectedDevice[device] = !selectedDevice[device];
    } else {
      selectedDevice[device] = true;
    }
    this.setState({selectedDevice: selectedDevice});
  }

  hideAll(){
    let displayMap = this.state.displayMap;
    for(let k in this.props.devices){
      let device = this.props.devices[k];
      displayMap[device.id] = false;
    }
    this.setState({displayMap:displayMap});
  }

  showAll(){
    let displayMap = this.state.displayMap;
    for(let k in this.props.devices){
      let device = this.props.devices[k];
      displayMap[device.id] = true;
    }
    this.setState({displayMap:displayMap});
  }

  applyFiltering(deviceMap) {
    // turns the stored device map into a list
    let list = [];
    for (let k in deviceMap) {
      if(deviceMap[k].static_attrs[0] !== undefined){
          if(deviceMap[k].static_attrs[0].type == "geo:point"){
            deviceMap[k].hide = !this.shouldShow(k);
            deviceMap[k].select = this.showSelected(k);
            list.push(deviceMap[k]);
          }
        }
    }

    // TODO ordering should be defined by the user
    list.sort((a,b) => {
      if (a.updated > b.updated) {
        return 1;
      } else {
        return -1;
      }
    })

    return list;
  }

  shouldShow(device) {
    if (this.state.displayMap.hasOwnProperty(device)) {
      return this.state.displayMap[device];
    }
    return true;
  }

  showSelected(device){
    if(this.state.selectedDevice.hasOwnProperty(device)){
      return this.state.selectedDevice[device];
    }
    return false;
  }

  //receiveSelectedDevice(device){
    //this.setState({listOfDevices:this.props.devices});
  //}

  render() {
    const filteredList = this.applyFiltering(this.props.devices);

    return (
        <div className = "flex-wrapper">
          <div className="row z-depth-2 devicesSubHeader p0" id="inner-header">
            <div className="col s4 m4 main-title">List of Devices</div>
            <div className= "col s2 m2 header-info hide-on-small-only">
              <div className= "title"># Devices</div>
              <div className= "subtitle">{filteredList.length}</div>
            </div>
            <Link to="/device/new" title="Create a new device" className="waves-effect waves-light btn-flat">
              New Device
            </Link>
          </div>
          <div className="deviceMapCanvas deviceMapCanvas-map col m12 s12 relative">
            <PositionRenderer devices={filteredList} listOfDevices={this.state.listOfDevices}/>
            <Sidebar devices={filteredList} hideAll={this.hideAll} showAll={this.showAll} selectedDevice={this.selectedDevice}/>
          </div>
        </div>
    )
  }
}


class ListItem extends Component {
  constructor(props){
    super(props);
    this.state = {
      selectedDevice: null,
    }

    this.selectedDevice = this.selectedDevice.bind(this);
  }


  selectedDevice(event){
    //this.props.devices.select = !this.props.devices.select;
    //console.log("DEVICES2: ", e.target);
    //this.props.select(this.props.devices.select);
    this.props.selectedDevice(this.props.devices.id)

  }

  render(){
    const name = this.props.devices.label;
    const protocol = this.props.devices.protocol;

    return(
      <div className="lst-entry-title col s12" id={this.props.devices.id} title="See details" onClick={this.selectedDevice}>
        <div className="img col s3" id="img-chip">
          <img src="images/chip.png" />
        </div>
        <div className="user-label truncate col s6">{name}</div>
        {/*<div className="label col s6">{protocol}</div>*/}
        <div className="col s3 img" id="device-view">
          {/*<a className="">
            <i className="fa fa-eye-slash" aria-hidden="true"/>
          </a>
          */}
        </div>
      </div>
    )
  }
}


class ListRender extends Component {
  constructor(props){
    super(props);
    //this.state = {
      //selectedDevice:
    //}

    this.applyFiltering = this.applyFiltering.bind(this);
    //this.receiveSelectedDevice = this.receiveSelectedDevice.bind(this);
  }

  //receiveSelectedDevice(device){
    //this.props.select(this.props.devices);
  //}

  applyFiltering(devices) {
    // transforms the map of the stored device into a list
    let list = [];
    for (let k in devices) {
      list.push(devices[k]);
    }

    // TODO ordering should be defined by the user
    list.sort((a,b) => {
      if (a.updated > b.updated) {
        return 1;
      } else {
        return -1;
      }
    })

    return list;
  }


  render(){

    const deviceList = this.applyFiltering(this.props.devices);

    if (deviceList.length > 0) {
      return (
        <div className="row">
        { deviceList.map((device, idx) =>
        <ListItem devices={device} key={device.id} selectedDevice={this.props.selectedDevice}/>
      )}
        </div>
      )
    } else {
      return  (
        <div className="background-info valign-wrapper full-height">
          <span className="horizontal-center">No configured devices</span>
        </div>
      )
    }
  }
}


class List extends Component {
  constructor(props){
    super(props);
    this.state = {
      selectedDevice: false
    };
    //this.receiveSelectedDevice = this.receiveSelectedDevice.bind(this);
    this.hideDevices = this.hideDevices.bind(this);
    this.showDevices = this.showDevices.bind(this);
  }

  //receiveSelectedDevice(device){
    //console.log("DEVICES: ", device);
    //this.props.select(this.props.devices)
  //}

  hideDevices(){
    this.props.hideAll();
  }

  showDevices(){
    this.props.showAll();
  }

  render(){

    return(
      <div className="list-of-devices">
        <div className="row device-list">
          <div className="col s12 main-title center-align">Devices</div>
            <div className="col s12 info-header">
              <div className="col s1 subtitle"></div>
              <div className="col s5 title">Devices</div>
              <div className="col s6 device-list-actions">
                <div className="col s6 action-hide">
                  <a className="waves-effect waves-light" onClick={this.hideDevices}>HIDE ALL</a>
                </div>
                <div className="col s6 action-show">
                  <a className="waves-effect waves-light" onClick={this.showDevices}>SHOW ALL</a>
                </div>
              </div>
            </div>
            <div className="deviceCanvas">
              <ListRender devices={this.props.devices} selectedDevice={this.props.selectedDevice}/>
            </div>
        </div>
      </div>

    )
  }
}

class Sidebar extends Component {
  constructor(props){
    super(props);
    this.state = {
      click: false,
      sideBarOpened: false,
    };

    this.toggleSideBar = this.toggleSideBar.bind(this);
    //this.receiveSelectedDevice = this.receiveSelectedDevice.bind(this);
    //this.changeSideBar = this.changeSideBar.bind(this);

  }

  toggleSideBar() {
    const last = this.state.sideBarOpened;
    this.setState({sideBarOpened: !last});
  }

  render(){
    const btnSideBarClass = "fa fa-chevron-" + (this.state.sideBarOpened ? "right" : "left");

    //console.log("DEVICES1: ", this.props.devices[0].select);
    return(
      <div className="col m12">
        <div className="col m12 div-btn-side-painel" >
          <button type="button" className='btn btn-circle sideBarToggle' onClick={this.toggleSideBar}>
            <i className={btnSideBarClass} aria-hidden="true"></i>
          </button>
        </div>
        { this.state.sideBarOpened ? (
          <div className="col device-painel full-height">
            <div className="col device-painel-body relative">
              <List devices={this.props.devices} hideAll={this.props.hideAll} showAll={this.props.showAll}
                            selectedDevice={this.props.selectedDevice}/>
            </div>
          </div>
        ) : (
          null
        )}
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
  }


  render() {
    const detail = ('detail' in this.props.location.query) ? this.props.location.query.detail : null;

    return (
      <ReactCSSTransitionGroup
        transitionName="first"
        transitionAppear={true}
        transitionAppearTimeout={500}
        transitionEnterTimeout={500}
        transitionLeaveTimeout={500} >
        <PageHeader title="device manager" subtitle="Devices" shadow='true'>
          {/* <Filter onChange={this.filterChange} /> */}
          {/*<Link to="/device/new" title="Create a new device" className="btn-item btn-floating waves-effect waves-light cyan darken-2">
            <i className="fa fa-plus"/>
          </Link> */}
        </PageHeader>
        <AltContainer store={DeviceStore}>
          <DeviceList deviceid={detail} />
        </AltContainer>
        {/* <NewDevice /> */}
      </ReactCSSTransitionGroup>
    );
  }
}

export { Devices };
