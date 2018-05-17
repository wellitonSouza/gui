import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import ReactResizeDetector from 'react-resize-detector';
import { Link } from 'react-router'

class ListItem extends Component {
  constructor(props) {
    super(props);
    this.toggleDevice = this.toggleDevice.bind(this);
  }

  toggleDevice() {
    this.props.toggleVisibility(this.props.device.id);
  }

  render() {
    const name = this.props.device.label;
    const protocol = this.props.device.protocol;

    return <div className="lst-entry-title col s12">
        <div className="user-label truncate col s7">{name}</div>
        <div className="col s5 options">
          {this.props.is_showing ? <div className="searchBtn operations" onClick={this.toggleDevice} title="Hide Device">
              <i className="fa fa-eye" />
            </div> : <div className="searchBtn operations" onClick={this.toggleDevice} title="Show Device">
              <i className="fa fa-eye-slash" />
            </div>}
            <Link to={"/device/id/" + this.props.device.id + "/detail"} title="View details">
          <div className="searchBtn operations" title="View device information">
              <i className="fa fa-info-circle" />
          </div>
            </Link>
        </div>
      </div>;
  }
}


class ListRender extends Component {
  constructor(props){
    super(props);
    // this.applyFiltering = this.applyFiltering.bind(this);
  }

  // applyFiltering(devices) {
  //   let list = [];
  //   for (let k in devices) {
  //     list.push(devices[k]);
  //   }
  //   return list;
  // }

  render(){

    // const deviceList = this.applyFiltering(this.props.devices);
    const deviceList = this.props.devices;

    if (deviceList.length > 0) {
      return <div className="row">
          {deviceList.map((device, idx) => (
            <ListItem
              toggleVisibility={this.props.toggleVisibility}
              device={device}
              is_showing={this.props.displayMap[device.id]}
              key={device.id}
            />
          ))}
        </div>;
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
    this.hideDevices = this.hideDevices.bind(this);
    this.showDevices = this.showDevices.bind(this);
  }

  hideDevices(){
    this.props.hideAll();
  }

  showDevices(){
    this.props.showAll();
  }

  render(){

    return <div className="list-of-devices">
        <div className="row device-list">
          <div className="col s12 info-header">
            <div className="col s1 " />
            <div className="col s5 subtitle">DEVICES</div>
            <div className="col s6 device-list-actions">
              <div className="col s6 action-hide">
                <a className="waves-effect waves-light" onClick={this.hideDevices}>
                  HIDE ALL
                </a>
              </div>
              <div className="col s6 action-show">
                <a className="waves-effect waves-light" onClick={this.showDevices}>
                  SHOW ALL
                </a>
              </div>
            </div>
          </div>
          <div className="deviceCanvas">
          <ListRender toggleVisibility={this.props.toggleVisibility} devices={this.props.devices} displayMap={this.props.displayMap} />
          </div>
        </div>
      </div>;
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
  }

  toggleSideBar() {
    const last = this.state.sideBarOpened;
    this.setState({sideBarOpened: !last});
  }

  render(){
    const btnSideBarClass = "fa fa-chevron-" + (this.state.sideBarOpened ? "right" : "left");

    return <div className="col m12">
        <div className={"col m12 div-btn-side-painel " + (this.state.sideBarOpened ? "push-left" : "no-left")}>
          <button type="button" className="btn btn-circle sideBarToggle" onClick={this.toggleSideBar}>
            <i className={btnSideBarClass} aria-hidden="true" />
          </button>
        </div>
        {this.state.sideBarOpened ? <div className="col device-painel full-height">
            <div className="col device-painel-body relative">
               <List toggleVisibility={this.props.toggleVisibility} devices={this.props.devices} hideAll={this.props.hideAll} showAll={this.props.showAll} displayMap={this.props.displayMap}  />
            </div>
          </div> : null}
      </div>;
  }
}

export default Sidebar;
