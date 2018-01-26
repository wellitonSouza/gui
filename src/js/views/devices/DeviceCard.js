import React, { Component } from 'react';
import { Link } from 'react-router'
import {Loading} from "../../components/Loading";
import util from "../../comms/util/util";

function SummaryItem(props) {

    let attrs = 0;

    for(let attribute in props.device.attrs) {
        attrs += props.device.attrs[attribute].length;
    }

  return (
      <Link to={"/device/id/" + props.device.id + "/detail"}>
          <div className={"card-size lst-entry-wrapper z-depth-2 fullHeight"}>
              <div className="lst-entry-title col s12">
                  <img className="title-icon" src={"images/white-chip.png"}/>
                  <div className="title-text">
                      <span className="text"> {props.device.label} </span>
                  </div>
              </div>
              <div className="attr-list">
                  <div className={"attr-area light-background"}>
                      <div className="attr-row">
                          <div className="icon">
                              <img src={"images/tag.png"}/>
                          </div>
                          <div className={"attr-content"}>
                              <input type="text" value={attrs} disabled={true}/>
                              <span>Properties</span>
                          </div>
                          <div className="center-text-parent material-btn right-side">
                          </div>
                      </div>
                      <div className="attr-row">
                          <div className="icon">
                              <img src={"images/update.png"}/>
                          </div>
                          <div className={"attr-content"}>
                              <input type="text" value={util.iso_to_date(props.device.created)} disabled={true}/>
                              <span>Last update</span>
                          </div>
                          <div className="center-text-parent material-btn right-side">
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </Link>
  )}


class DeviceCard extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    if (this.props.loading) {
      return (<Loading />);
    }

    // TODO refactor this away
    let filteredList = [];
    if ((this.props.devices !== undefined) && (this.props.devices !== null)) {
      for (let k in this.props.devices) {
        if (this.props.devices.hasOwnProperty(k)){
          filteredList.push(this.props.devices[k]);
        }
      }
    }

    const device_icon  = (<img src='images/icons/chip.png' />);
    const header = (<div className="row z-depth-2 devicesSubHeader p0" id="inner-header">
        <div className="col s4 m4 main-title">List of Devices</div>
        <div className="col s8 m8 header-info hide-on-small-only">
          <div className="title"># Devices</div>
          <div className="subtitle">{filteredList.length}</div>
        </div>
  </div>);

    if (filteredList.length > 0) {
      return (
       <div> {header}
        <div className = "flex-wrapper bg-light-gray">
          <div className="deviceMapCanvas col m12 s12 relative">
            <div className="row">
              <div className="col s12  lst-wrapper extra-padding">
                { filteredList.map((device, idx) => <SummaryItem device={device} key={device.id}/>) }
              </div>
            </div>
          </div>
        </div>
         </div>
      )
    } else {
      return  (
        <div> {header}
        <div className="background-info valign-wrapper full-height relative">
          <span className="horizontal-center">No configured devices</span>
        </div> </div>
      )
    }
  }
}

export { DeviceCard };
