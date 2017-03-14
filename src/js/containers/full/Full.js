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
  if (props.open) {
    return (
      <li className="">
        <div className="nav-item">
          <Link to={props.item.target} className="nav-link" activeClassName="active">
            <div className="nav-title caps">{props.item.label}</div>
            <div className="nav-desc">{props.item.desc}</div>
            <div className="nav-icon">
              <i className={props.item.iconClass} />
            </div>
          </Link>
          { 'children' in props.item && (
            <ul className="nav-2nd"> { props.item.children.map((child) =>
              <li className="nav-2nd-item" key={child.label}>
                <Link to={child.target} className="">
                  <div className="caps">{child.label}</div>
                </Link>
              </li>
            )}</ul>
          )}
        </div>
      </li>
    )
  } else {
    return (
      <li className="">
        <div className="nav-item">
          <Link to={props.item.target} className="nav-link" activeClassName="active">
            <div className="nav-icon">
              <i className={props.item.iconClass} />
            </div>
          </Link>
        </div>
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
      { target: "", iconClass: "fa fa-microchip", label: "Device manager", desc: "Known devices and configuration", children: [
        { target: "", iconClass: "", label: "device"},
        { target: "", iconClass: "", label: "template"},
        { target: "", iconClass: "", label: "alarm"}
      ]},
      // TODO change this icon
      { target: "", iconClass: "fa fa-code-fork", label: "data flows", desc: "Processing flows to be executed" },
      { target: "", iconClass: "fa fa-bell-o", label: "alarms", desc: "System events and alarms"},
      { target: "", iconClass: "fa fa-unlock-alt", label: "authentication", desc: "User and permissions management", children: [
        { target: "", iconClass: "", label: "users"},
        { target: "", iconClass: "", label: "permissions"},
        { target: "", iconClass: "", label: "alarm"}
      ]},
      // TODO change this icon
      { target: "", iconClass: "fa fa-cogs", label: "deployment", desc: "Application and plugin management", children: [
        { target: "", iconClass: "", label: "plugins"},
        { target: "", iconClass: "", label: "applications"},
        { target: "", iconClass: "", label: "alarm"}
      ]}
    ];

    return (
      <div className="sidebar expand">
        <div className="logo">
          { this.props.open && ( <a href="#" className="brand-logo">logo</a> )}
          <i className="fa fa-bars" onClick={this.handleClick}/>
        </div>

        <nav className="sidebar-nav line-normal">
          <ul className="nav">
            { entries.map((item) => <SidebarItem item={item} key={item.label} open={this.props.open}/> )}
          </ul>
        </nav>
      </div>
    )
  }
}

function Content(props) {
  return (
    <div className={"app-body " + (props.leftSideBar.open ? " open" : "") }>
      <Sidebar open={props.leftSideBar.open}/>
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
        <Content>{this.props.children}</Content>
      </AltContainer>
    );
  }
}

export default Full;
