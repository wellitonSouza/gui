import React, { Component } from 'react';

class Full extends Component {
  render() {
    return (
      <div className="app">
        {/* <Header /> */}
        <nav>
            <div className="nav-wrapper">
              <a href="#" className="brand-logo">Logo</a>
              <ul id="nav-mobile" className="right hide-on-small-only">
                <li><a href="#">Device Types</a></li>
                <li><a href="#" className="active-element">Devices</a></li>
              </ul>
            </div>
        </nav>
        <div className="app-body">
          {/* <Sidebar {...this.props}/> */}
          <main className="main">
            <div className="container">
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
