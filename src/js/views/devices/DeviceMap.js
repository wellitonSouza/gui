/* eslint-disable */
import React, { Component } from 'react';
import { Link } from 'react-router';
import Script from 'react-load-script';
import DivIcon from 'react-leaflet-div-icon';
import Sidebar from '../../components/DeviceRightSidebar';
import * as pins from '../../config'
import { Filter } from "../utils/Manipulation";
import { SmallPositionRenderer } from "../utils/Maps";
import { Loading } from '../../components/Loading';

import TrackingActions from '../../actions/TrackingActions';
import MapPositionActions from "../../actions/MapPositionActions";
import { ContentBlock } from 'material-ui';

let activeTracks = [];

class DeviceMapWrapper extends Component {
    constructor(props) {
        super(props);
        this.didMount = false;
    }

    componentDidMount() {
        let filter = {
            sortBy: 'label',
            page_size: 5000,
            page_num: 1
         };
         MapPositionActions.fetchDevices.defer(filter); 
         this.didMount = true; // I really don't like it, any ideas to change it?
    }

    render() {
        console.log("2.5. <DeviceMapWrapper>.render.", this.props);

        if (!this.didMount || this.props.positions.loading) {
          return <Loading />
        //   return <div className="row full-height relative">
        //       <Loading />
        //     </div>;
        }

        return (
            <DeviceMap Config={this.props.configs} trackedDevices={this.props.measures.tracking} devices={this.props.positions.devicesPos} showFilter={this.props.showFilter} dev_opex={this.props.dev_opex} />
        );
    }
}



class DeviceMap extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isDisplayList: true,
            filter: '',
            displayMap: {},
            selectedDevice: {},
            listOfDevices: [],
            mapquest: false,
        };

        this.handleViewChange = this.handleViewChange.bind(this);
        this.showSelected = this.showSelected.bind(this);
        this.selectedDevice = this.selectedDevice.bind(this);
        this.toggleTracking = this.toggleTracking.bind(this);
        this.countVisibleDevices = this.countVisibleDevices.bind(this);
        this.showAll = this.showAll.bind(this);
        this.hideAll = this.hideAll.bind(this);
        // this.toggleDisplay = this.toggleDisplay.bind(this);
        this.toggleVisibility = this.toggleVisibility.bind(this);

        this.validDevices = [];
        this.staticDevices = [];
        this.dynamicDevices = [];
        this.didMount = false;
    }

    countVisibleDevices() {
        let count = 0;
        for (const k in this.props.devices) {
            if (this.state.displayMap[this.props.devices[k].id]) count++;
        }
        return count;
    }

    componentDidMount() {

        console.log("3.c.componentDidMount");
        this.showAll();

        this.staticDevices = [];
        this.dynamicDevices = [];

        for (const k in this.props.devices) {
            let device = this.props.devices[k];
            if (device.has_dynamic_position) {
                // request dynamic data and allow tracking
                device.allow_tracking = true;
                this.dynamicDevices.push(device);
                TrackingActions.fetch.defer(device.dp_metadata.id,
                    device.dp_metadata.attr_label,1);
            }
            if (device.has_static_position) {
                device.allow_tracking = false;
                this.staticDevices.push(device);
            }
        }
        this.didMount = true;
    }

    handleViewChange() {
        this.setState({ isDisplayList: !this.state.isDisplayList });
    }

    selectedDevice(device) {
        const selectedDevice = this.state.selectedDevice;
        if (selectedDevice.hasOwnProperty(device)) {
            selectedDevice[device] = !selectedDevice[device];
        } else {
            selectedDevice[device] = true;
        }
        this.setState({ selectedDevice });
    }

    toggleVisibility(device_id) {
        // console.log('toggleVisibility', device_id);
        const displayMap = this.state.displayMap;
        displayMap[device_id] = !displayMap[device_id];
        this.setState({ displayMap });
    }

    hideAll() {
        const displayMap = this.state.displayMap;
        for (const k in displayMap) {
            displayMap[k] = false;
        }
        this.setState({ displayMap });
    }

    showAll() {
        const displayMap = {};
        for (const k in this.props.devices) {
            displayMap[this.props.devices[k].id] = true;
        }
        this.setState({ displayMap });
    }
 

    toggleTracking(device_id) {
        console.log("3. toggleTracking");
        if (!this.props.Measure.tracking.hasOwnProperty(device_id)) {
          for (const k in this.props.devices[device_id].attrs) {
            for (const j in this.props.devices[device_id].attrs[k]) {
              if (this.props.devices[device_id].attrs[k][j].value_type === "geo:point") {
                TrackingActions.fetch(device_id, this.props.devices[device_id].attrs[k][j].label);
                this.props.devices[device_id].tracking = true;
                  activeTracks.push(device_id);
                }
            }
          }
        } else {
          TrackingActions.dismiss(device_id);
          this.props.devices[device_id].tracking = false;
            activeTracks = activeTracks.filter(i => i !== device_id);

        }
        console.log("activeTracks", activeTracks);
        console.log("this.props.devices[device_id]", this.props.devices[device_id]);
    }

    showSelected(device) {
        if (this.state.selectedDevice.hasOwnProperty(device)) {
            return this.state.selectedDevice[device];
        }
        return false;
    }

    // toggleDisplay(device) {
    //     let displayMap = this.state.displayMap;
    //     if (displayMap.hasOwnProperty(device)) {
    //         displayMap[device] = !displayMap[device];
    //     } else {
    //         displayMap[device] = false;
    //     }
    //     this.setState({displayMap: displayMap});
    // }


    render() {
        console.log("3. <DeviceMap>. Render. ");
        console.log(" 3.a  this.props.Measure.tracking.", this.props.trackedDevices);
        console.log(" 3.b  this.props.devices", this.props.devices);
        

        if (!this.didMount) 
            return <Loading />

        this.validDevices = this.props.devices;
        const nVisibleDevices = this.countVisibleDevices();
        const displayDevicesCount = `Showing ${nVisibleDevices} of ${this.props.devices.length} device(s)`;
        console.log("displayDevicesCount.", displayDevicesCount);

        for (const k in this.dynamicDevices) {
            const device = this.dynamicDevices[k];
            if (this.props.trackedDevices.hasOwnProperty(device.id) && this.state.displayMap[device.id]) {
                this.dynamicDevices[k].dy_positions = []; 
                this.dynamicDevices[k].dy_positions = this.props.trackedDevices[device.id].map(
                  (e, k) => {
                    const updated = e;
                    updated.id = device.id;
                    updated.unique_key = `${device.id}_${k}`;
                    updated.label = device.label;
                    updated.timestamp = e.timestamp;
                    return updated;
                  }
                );
            }
        }

        this.metaData = { alias: "device" };
        this.props.dev_opex.setFilterToMap();

        // remove or not depending visibility

        for (const k in this.staticDevices) {
            this.staticDevices[k].is_visible = this.state.displayMap[this.staticDevices[k].id];
        }

        for (const k in this.dynamicDevices) {
            this.dynamicDevices[k].is_visible = this.state.displayMap[this.dynamicDevices[k].id];
        }
        
        console.log("this.staticDevices", this.staticDevices);
        console.log("this.dynamicDevices", this.dynamicDevices);

        return <div className="fix-map-bug">
            <div className="flex-wrapper">
              <div className="map-filter-box">
                <Filter showPainel={this.props.showFilter} metaData={this.metaData} ops={this.props.dev_opex} fields={DevFilterFields} />
              </div>

              <div className="deviceMapCanvas deviceMapCanvas-map col m12 s12 relative">
                <SmallPositionRenderer showLayersIcons={true} staticDevices={this.staticDevices} dynamicDevices={this.dynamicDevices} toggleTracking={this.toggleTracking} allowContextMenu={true} showPolyline={true} config={this.props.Config} /> 
                <Sidebar deviceInfo={displayDevicesCount} toggleVisibility={this.toggleVisibility} devices={this.props.devices} hideAll={this.hideAll} showAll={this.showAll} displayMap={this.state.displayMap} />
              </div>
            </div>
          </div>;
    }
}




    // handleGeoDevices() {
    //     console.log("DeviceMapBig: handleGeoDevices", this.props);
    //     this.clusterers = [];
    //     // step 1. Create elements to set on markers
    //     this.props.clusterers.map((element, i1) => {
    //         let clstr = { index: i1, devices: [] };
    //         element.devices.map((element, index) => {
    //             console.log("element.geo.lat", element.geo);
    //             if (element.geo !== undefined) {
    //                 clstr.devices.push({
    //                     id: element.id,
    //                     lat: element.geo.lat,
    //                     lng: element.geo.lng,
    //                     pos: [
    //                         parseFloat("-23.5373"),
    //                         parseFloat("-46.6293")
    //                     ],
    //                     label: element.label,
    //                     timestamp: element.timestamp,
    //                     key: element.id
    //                 });
    //             }
    //         });
    //         this.clusterers.push(clstr);
    //     });
    //     console.log("this.clusterers", this.clusterers);
    //     // this.clusterers = this.splitInClusters();
    // }


class DevFilterFields extends Component {
    constructor(props) {
        super(props);
    }
    
    render() {
        console.log("DevFilterFields - DeviceMaps", this.props);
        return <div className="col s12 m12">
        <div className="col s5 m5">
            <div className="dev_field_filter">
                <label htmlFor="fld_device_name">Device Name</label>
                <input id="fld_device_name" type="text" className="form-control form-control-lg margin-top-mi7px" placeholder="Device Name" value={this.props.fields.label} name="label" onChange={this.props.onChange} />
            </div>
        </div>
        <div className="col s1 m1" />
        </div>;
    }
}

export { DeviceMapWrapper };
