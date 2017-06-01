import React, { Component } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import alt from '../../alt';
import AltContainer from 'alt-container';
import LoginStore from '../../stores/LoginStore';
import util from '../../comms/util/util';


var DeviceDashboardStore = require('../../stores/DeviceDashboardStore');
var DeviceDashboardActions = require('../../actions/DeviceDashboardActions');

class DeviceItem extends Component {
  constructor (props) {
    super(props);
  }

  render() {
    let uptime = this.props.data.attrs.uptime;
    if (uptime == undefined)
      uptime = '-';

    return (
      <div className='main-div'>
        <div className="item">
          <div className="col s6 name-info">
                {this.props.data.label}
          </div>
          <div className="col s6 time-info">
                <title>{uptime}</title>
                <span>UPTIME</span>
          </div>
          <div className={'item-hovered no-padding color-'+this.props.data._status}>
          <div className="col s4 name-info">
                {this.props.data.label}
          </div>
          <div className="col s4 time-info">
                <title>{util.timestamp_to_date(this.props.data.updated)}</title>
                <span>LAST UPDATE</span>
          </div>
          <div className="col s4 time-info upper">
                <title>{status}</title>
                <span>STATUS</span>
          </div>
          </div>
        </div>
      </div>
    )
  }
}


class TemplateItem extends Component {
  constructor (props) {
    super(props);
  }

  render() {
    let used_by = this.props.data.attrs.used_by;
    if (used_by == undefined)
      used_by = '0';

    return (
      <div className='main-div'>
        <div className="item">
          <div className="col s6 name-info">
                {this.props.data.label}
          </div>
          <div className="col s6 time-info">
                <title>{util.timestamp_to_date(this.props.data.created)}</title>
                <span>CREATED AT</span>
          </div>
          <div className={'item-hovered no-padding bg-black'}>
          <div className="col s6 name-info">
                {this.props.data.label}
          </div>
          <div className="col s6 time-info upper">
                <title>{used_by} device(s)</title>
                <span>Used by</span>
          </div>
          </div>
        </div>
      </div>
    )
  }
}

class ElementList extends Component {
  constructor(props) {
    super(props);
  }

  //@TODO this is like a dict, I think would be better isolate it
  getInfoByType(type) {
    if (type == "devices"){
      return {
          img_url: 'images/chip-shadow-material.png',
          color: 'pink',
          subtitle: 'Last added',
          title: 'Devices'
      }
    } else {
      return {
        img_url: 'images/templates-shadow-material.png',
        color: 'ciano',
        subtitle: 'Created',
        title: 'Templates'
      }
    }
  }

  listItems(type){
    if (this.props.list.length > 0) {
      if (type == "devices") {
        return (
          <div className="col s12 no-padding">
              {
                 this.props.list.map((it) =>
                 <DeviceItem key={it.id} data={it} />)
               }
          </div>
        )
      }
      else {
        return (
          <div className="col s12 no-padding">
              {
                 this.props.list.map((it) =>
                 <TemplateItem key={it.id} data={it} />)
               }
          </div>
        )
      }
    }
    else {
      return (
          <div className="col s12 no-items-box">
            <span className="background-info">No items.</span>
          </div>
      )
    }
  }

  render() {
    const info = this.getInfoByType(this.props.type);
    let tam = 0;
    if (this.props.list)
      tam = this.props.list.length;

    return (
        <div className="col box" >
            <div className={"box-title bg-"+info.color}>
              <img className="icon" src={info.img_url}/>
              <label className='number'>{tam}</label>
              <label className='subtitle'>{info.subtitle}</label>
              <label className='title'>{info.title}</label>
              <i className="fa fa-menu"></i>
            </div>
            <div className="box-content">
              { this.listItems(this.props.type) }
            </div>
        </div>
    )
  }
  }




class MainPainel extends Component {
    constructor(props) {
      super(props);
    }

    render() {
      console.log("Reloading MainPainel");
      return (
        <div className="right-painel-info">
          <ElementList type='devices' list={this.props.devices} />
          <ElementList type='templates' list={this.props.templates} />
        </div>
      )
  }
}

class LeftPainel extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    let main_stats = [];
    let side_stats = [];
    if (this.props.stats.mainStats)
      main_stats = this.props.stats.mainStats;
    if (this.props.stats.sideStats)
      side_stats = this.props.stats.sideStats;

    return (
        <div className="left-painel-info" >
          <div className="main-header col s12">
            <div className="photo-big" >
              <div className="circle-after">
                <img className="w100p h100p" src="images/big-chip.png"/>
              </div>
            </div>
            <label className='col s12 title'> {this.props.mainTitle} </label>
            <label className='col s12 subtitle'> {this.props.subtitle} </label>
          </div>

          <div className="box-stats col s12">
            <p className='main-title'><label>{this.props.stats.title}</label></p>
            <div className='stats'>
            { main_stats.map((stat) =>
              <div key={stat.key} className="lst-item col s12">
              <p className="key"> {stat.key}</p>
              <p className="value"> {stat.value}</p>
              </div>
            )}
            { side_stats.map((stat) =>
              <div key={stat.key} className="lst-item sub col s6">
              <p className="key"> {stat.key}</p>
              <p className="value"> {stat.value}</p>
              </div>
            )}
            </div>
        </div>
      </div>
    )
  }
}


class DeviceDashboard extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <AltContainer store={LoginStore}>
        <DeviceDashboardImpl {...this.props} />
      </AltContainer>
    )
  }
}


class DeviceDashboardImpl extends Component {
  constructor(props) {
    super(props);

    this.state = {
      stats : {},
      last_devices : [],
      last_templates : []
    };

    this.state = DeviceDashboardStore.getState();
    this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {
    DeviceDashboardStore.listen(this.onChange);
    DeviceDashboardActions.fetchAll(this.props.user.service);
  }

  componentWillUnmount() {
    DeviceDashboardStore.unlisten(this.onChange);
  }

  onChange() {
    this.setState(DeviceDashboardStore.getState());
    console.log("dashboard container component - onChange", this.state);
  }

  render() {
    return (
      <ReactCSSTransitionGroup
      transitionName="first"
      transitionAppear={true}
      transitionAppearTimeout={500}
      transitionEnterTimeout={500}
      transitionLeaveTimeout={500} >
      <div className="row col s12 main-painel">
       <LeftPainel id='div_devices' mainTitle="Devices" subtitle="Dashboard" stats={this.state.stats} />
        <MainPainel devices={this.state.last_devices} templates={this.state.last_templates} />
      </div>
      </ReactCSSTransitionGroup>
    );
  }
}

export default DeviceDashboard;
