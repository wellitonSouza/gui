import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import deviceManager from '../../comms/devices/DeviceManager';
import DeviceStore from '../../stores/DeviceStore';
import MeasureStore from '../../stores/MeasureStore';
import DeviceActions from '../../actions/DeviceActions';

import MeasureActions from '../../actions/MeasureActions';

import { PageHeader } from "../../containers/full/PageHeader";
import { NewPageHeader } from "../../containers/full/PageHeader";
import AltContainer from 'alt-container';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { Link } from 'react-router'
import { DojotBtnLink } from "../../components/DojotButton";
import {DeviceMap, PositionRenderer} from './DeviceMap';
import {DeviceCard} from './DeviceCard';

// UI elements
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Toggle from 'material-ui/Toggle';


function ToggleWidget(props) {
  return (
    <div className="box-sh">
      <div className='toggle-icon'>
        <img src='images/icons/pin.png' />
      </div>
      <div className='toggle-map'>
        <MuiThemeProvider>
          <Toggle label="" defaultToggled={props.toggleState} onToggle={props.toggle}/>
        </MuiThemeProvider>
      </div>
      <div className='toggle-icon'>
        <i className="fa fa-th-large" aria-hidden="true"></i>
      </div>
    </div>
  )
}

class MapWrapper extends Component {
  constructor(props){
    super(props)
  }

  componentDidMount(){
    let devices = this.props.devices;
    for(let k in devices){
      for(let j in devices[k].attrs){
        for(let i in devices[k].attrs[j]){
          if(devices[k].attrs[j][i].type == "dynamic"){
            if(devices[k].attrs[j][i].value_type == "geo"){
                MeasureActions.fetchPosition.defer(devices[k], devices[k].id, devices[k].templates, devices[k].attrs[j][i].label, 10);
            }
          }
        }
      }
    }

  }
  render(){
    return(
      <AltContainer store={MeasureStore}>
        <DeviceMap devices={this.props.devices}/>
      </AltContainer>
    )
  }
}

class Devices extends Component {

  constructor(props) {
    super(props);
    this.state = {displayList: true};

    this.filterChange = this.filterChange.bind(this);
    this.toggleDisplay = this.toggleDisplay.bind(this);
  }

  componentDidMount() {
    DeviceActions.fetchDevices.defer();
  }

  filterChange(newFilter) {
  }

  toggleDisplay() {
    const last = this.state.displayList;
    this.setState({displayList: !last});
  }

  render() {
    const detail = ('detail' in this.props.location.query) ? this.props.location.query.detail : null;
    const displayToggle = (<ToggleWidget toggleState={this.state.displayList} toggle={this.toggleDisplay} />)

    return (<ReactCSSTransitionGroup transitionName="first" transitionAppear={true} transitionAppearTimeout={500} transitionEnterTimeout={500} transitionLeaveTimeout={500}>
        <NewPageHeader title="Devices" subtitle="" icon="device">
          {/* <Filter onChange={this.filterChange} /> */}
          {/*<Link to="/device/new" title="Create a new device" className="btn-item btn-floating waves-effect waves-light cyan darken-2">
            <i className="fa fa-plus"/>
          </Link> */}
          <div className='pt10'>
            <DojotBtnLink linkto="/device/new" label="New Device" alt="Create a new device" icon="fa fa-plus" />
            {displayToggle}
          </div>
        </NewPageHeader>
        <AltContainer store={DeviceStore}>
          {this.state.displayList ? (
            <DeviceCard deviceid={detail} toggle={displayToggle} />
          ) : (
            <MapWrapper deviceid={detail} toggle={displayToggle} />
          )}
        </AltContainer>
      </ReactCSSTransitionGroup>);
  }
}

export { Devices };
