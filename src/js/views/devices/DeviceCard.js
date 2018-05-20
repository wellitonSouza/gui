import React, { Component } from 'react';
import { Link } from 'react-router'
import {Loading} from "../../components/Loading";
import ReactCSSTransitionGroup from "react-addons-css-transition-group";
import util from "../../comms/util/util";
import DeviceActions from '../../actions/DeviceActions';
import DeviceStore from '../../stores/DeviceStore';
import TemplateActions from '../../actions/TemplateActions';
import TemplateStore from '../../stores/TemplateStore';

import MaterialInput from "../../components/MaterialInput";
import Materialize from "materialize-css";
import MaterialSelect from "../../components/MaterialSelect";

import { Filter, Pagination } from "../utils/Manipulation";

function SummaryItem(props) {

    let attrs = 0;

    for(let attribute in props.device.attrs) {
        attrs += props.device.attrs[attribute].length;
    }

    return (

      <Link to={"/device/id/" + props.device.id + "/detail"}>
        <div className={"card-size card-hover lst-entry-wrapper z-depth-2 fullHeight"}>
              <div className="lst-entry-title col s12">
                  <img className="title-icon" src={"images/icons/chip-wt.png"}/>
                  <div className="title-text truncate">
                      <span className="text" title={props.device.label}> {props.device.label} </span>
                  </div>
              </div>
              <div className="attr-list">
                  <div className="attr-area light-background">
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
                      <div className={props.device.status} />
                  </div>
              </div>
          </div>
      </Link>
  )}


class DeviceCardList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false
    };
    this.convertDeviceList = this.convertDeviceList.bind(this);
    this.filteredList = [];
  }

  convertDeviceList() {
    this.filteredList = [];
    for (let k in this.props.devices) {
      this.filteredList.push(this.props.devices[k]);
    }
  }

  render() {
    if (this.props.loading) {
      return <Loading />;
    }

    this.convertDeviceList();

    this.metaData = { alias: "device" };

    return <div className="device-card-area">
        <Filter showPainel={this.props.showFilter} metaData={this.metaData} ops={this.props.dev_opex} fields={DevFilterFields} />
        {this.filteredList.length === 0 ? <div className="background-info valign-wrapper full-height">
            <span className="horizontal-center mt30">
              No devices to be shown
            </span>
          </div> : <div className="col s12  lst-wrapper extra-padding">
            {this.filteredList.map(device => (
              <SummaryItem device={device} key={device.id} />
            ))}
          </div>}
      </div>;
  }
}


class DevFilterFields extends Component {
  constructor(props) {
    super(props);

    this.convertTemplateList = this.convertTemplateList.bind(this);
    this.createSelectTemplates = this.createSelectTemplates.bind(this);
    this.templates = [];
}

  convertTemplateList() {
    this.templates = [];
    for (let k in TemplateStore.state.templates) {
      if (TemplateStore.state.templates.hasOwnProperty(k)) {
        this.templates.push(TemplateStore.state.templates[k]);
      }
    }
  }

  createSelectTemplates() {
    let items = [];
    items.push(<option key="select_template" value="">Select Template</option>);
    for (let i = 0; i < this.templates.length; i++) {
      items.push(<option key={this.templates[i].id} value={this.templates[i].id}>
          {this.templates[i].label}
        </option>);
    }
    return items;
  }

  componentDidMount() {
    TemplateActions.fetchTemplates.defer();
  }

  render() {
    console.log("DevFilterFields",this.props);
    if (this.templates.length == 0)
        this.convertTemplateList();
        
    this.opts = this.createSelectTemplates();
    return <div className="col s12 m12">
        <div className="col s5 m5">
          <div className="dev_field_filter">
            <label htmlFor="fld_device_name">Device Name</label>
            <input id="fld_device_name" type="text" className="form-control form-control-lg margin-top-mi7px" placeholder="Device Name" value={this.props.fields.label} name="label" onChange={this.props.onChange} />
          </div>
        </div>
        <div className="col s1 m1" />

        <div className="col s6 m6">
          <div className="col s12">
            <MaterialSelect id="flr_templates" name="templates" label="Templates" value={this.props.fields.templates} onChange={this.props.onChange}>
              {this.opts}
            </MaterialSelect>
          </div>
        </div>
      </div>;
  }
}


export { DeviceCardList };
