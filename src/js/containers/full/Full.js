import React, { Component } from 'react';
// import Header from '../../components/Header/';
// import Sidebar from '../../components/Sidebar/';
// import Aside from '../../components/Aside/';
// import Footer from '../../components/Footer/';

import Breadcrumbs from 'react-breadcrumbs';

class Full extends Component {
  render() {
    return (
      <div className="app">
        {/* <Header /> */}
        <nav>
            <div className="nav-wrapper">
              <a href="#" className="brand-logo">Logo</a>
              <ul id="nav-mobile" className="right hide-on-small-only">
                <li><a href="#">Devices</a></li>
              </ul>
            </div>
        </nav>
        <div className="app-body">
          {/* <Sidebar {...this.props}/> */}
          <main className="main">
            <div className="">
              {this.props.children}
            </div>
          </main>
          {/* <Aside /> */}
        </div>
        {/* <Footer /> */}
      </div>
    );
  }
}

export default Full;
