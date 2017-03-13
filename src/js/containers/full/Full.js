import React, { Component } from 'react';
import { Link } from 'react-router'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';


function Navbar(props) {
  // TODO: header widgets should be received as children to this (Navbar) node
  return (
    <nav>
      <div className="nav-wrapper">
        <div className="nav-logo">
          <a href="#" className="brand-logo">logo</a>
          <i className="fa fa-bars" />
        </div>
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

class Sidebar extends Component {

  handleClick(e) {
    e.preventDefault();
    e.target.parentElement.classList.toggle('open');
  }

  activeRoute(routeName) {
    return this.props.location.pathname.indexOf(routeName) > -1 ? 'nav-item nav-dropdown open' : 'nav-item nav-dropdown';
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
      <div className="sidebar">
        <nav className="sidebar-nav">
          <ul className="nav">
            { entries.map((item) =>
              <li className="nav-item">
                <Link to={item.target} className="nav-link" activeClassName="active">
                  <div className="nav-title caps">{item.label}</div>
                  <div className="nav-desc">{item.desc}</div>
                  <div className="nav-icon">
                    <i className={item.iconClass} />
                  </div>
                </Link>
                { 'children' in item && (
                  <ul> { item.children.map((child) =>
                    <li className="nav-2nd">
                      <Link to={child.target} className="">
                        <div className="caps">{child.label}</div>
                      </Link>
                    </li>
                  )}</ul>
                )}
              </li>
            )}
          </ul>
        </nav>
      </div>
    )
  }
}

class Full extends Component {
  render() {
    return (
      <div className="app">
        {/* <Header /> */}
        <Navbar path={this.props.location.pathname} userName="new user"/>
        <div className="app-body">
          <main className="main">
            <Sidebar />
            <div className="container">
              {this.props.children}
            </div>
          </main>
        </div>
      </div>
    );
  }
}

export default Full;
