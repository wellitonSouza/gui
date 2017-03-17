import React, { Component } from 'react';
import { Link } from 'react-router'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import AltContainer from 'alt-container';

import MenuActions from '../../actions/MenuActions';
import MenuStore from '../../stores/MenuStore';

function Navbar(props) {
  // TODO: header widgets should be received as children to this (Navbar) node
  return (
    <nav className="nav outer-header line-normal">
      <div className="nav-wrapper">
        <div className="nav-status row">
          {/* TODO: add props for badge indicator */}
          <div className="status-item status-icon fa fa-bell-o"></div>
          <div className="status-item user-area">
              <div className="user-pic">
                <img src="https://www.gravatar.com/avatar/ea4531646bf8ece65e914901535397f3?d=identicon" />
              </div>
              <div className="user-name">{props.userName}</div>
              <div className="">
                <i className="fa fa-caret-down line-normal center-caret" />
              </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

function SidebarItem(props) {
  let isActive = props.router.location.pathname === props.item.target;
  if (!isActive && ('children' in props.item)) {
    props.item.children.map((child) => isActive = isActive || (props.router.location.pathname == child.target));
  }

  // isActive  = true;
  const entryClass = "nav-link" + (isActive ? " active" : "");

  // console.log(props.item.label + " " + isActive + " " + props.router.location.pathname);

  if (props.open) {
    return (
      <li className="nav-item">
        <Link to={props.item.target} className={entryClass} activeClassName="active">
          <div className="nav-title caps">{props.item.label}</div>
          <div className="nav-desc">{props.item.desc}</div>
          <div className="nav-icon">
            <i className={props.item.iconClass} />
          </div>
        </Link>
        {('children' in props.item) && isActive && (
          <ul className="nav-2nd">
            { props.item.children.map((child) =>
              <li className="" key={child.label} >
                <Link to={child.target} className="nav-2nd-item" activeClassName="active" >
                      <span className="caps">{child.label}</span>
                </Link>
              </li>
            )}
          </ul>
        )}
      </li>
    )
  } else {
    return (
      <li className="nav-item">
        <Link to={props.item.target} className={entryClass} activeClassName="active">
          <div className="nav-icon">
            <i className={props.item.iconClass} />
          </div>
          <div className="nav-title caps hide-on-small-only">{props.item.label}</div>
        </Link>
      </li>
    )
  }
}

class Sidebar extends Component {

  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e) {
    e.preventDefault();
    MenuActions.toggleLeft();
  }

  render() {
    // TODO: active entry styling, set target, add responsiveness
    let entries = [
      // TODO change this icon
      { target: "/deviceManager", iconClass: "material-icons mi-ic-memory", label: "Devices", desc: "Known devices and configuration", children: [
        { target: "/device/list", iconClass: "", label: "device"},
        { target: "/template/list", iconClass: "", label: "template"},
        { target: "", iconClass: "", label: "alarm"}
      ]},
      // TODO change this icon
      { target: "/flows", iconClass: "material-icons mi-device-hub", label: "data flows", desc: "Processing flows to be executed" },
      { target: "/alarm", iconClass: "fa fa-bell-o", label: "alarms", desc: "System events and alarms"},
      { target: "/auth", iconClass: "fa fa-unlock-alt", label: "auth", desc: "User and permissions management", children: [
        { target: "", iconClass: "", label: "users"},
        { target: "", iconClass: "", label: "permissions"}
      ]},
      // TODO change this icon
      { target: "/deploy", iconClass: "fa fa-cogs", label: "deploy", desc: "Application and plugin management", children: [
        { target: "", iconClass: "", label: "plugins"},
        { target: "", iconClass: "", label: "applications"},
        { target: "", iconClass: "", label: "alarm"}
      ]}
    ];

    return (
      <div className="sidebar expand z-depth-5">
        <div className="header">
          {this.props.open && (<span>MENU</span>) }
          <div className="action waves-effect waves-light" onClick={this.handleClick} >
            <i className="fa fa-bars" />
          </div>
        </div>

        <nav className="sidebar-nav line-normal">
          <ul className="nav">
            { entries.map((item) => <SidebarItem item={item} key={item.label} open={this.props.open} router={this.props.router}/> )}
          </ul>
        </nav>
      </div>
    )
  }
}

function Content(props) {
  return (
    <div className={"app-body " + (props.leftSideBar.open ? " open" : " closed") }>
      <Sidebar open={props.leftSideBar.open} router={props.router}/>
      <div className="content expand">
        {props.children}
      </div>
    </div>
  )
}

class Full extends Component {
  render() {
    return (
      <AltContainer store={MenuStore}>
        {/* <Header /> */}
        <Navbar path={this.props.location.pathname} userName="new user"/>
        <Content router={this.props.router}>{this.props.children}</Content>
      </AltContainer>
    );
  }
}

export default Full;
