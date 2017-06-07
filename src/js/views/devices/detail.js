import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import { PageHeader, ActionHeader } from "../../containers/full/PageHeader";
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { Link, hashHistory } from 'react-router'

import alt from '../../alt';
import AltContainer from 'alt-container';
import MeasureStore from '../../stores/MeasureStore';
import MeasureActions from '../../actions/MeasureActions';
import DeviceActions from '../../actions/DeviceActions';
import DeviceStore from '../../stores/DeviceStore';
import deviceManager from '../../comms/devices/DeviceManager';
import util from "../../comms/util/util";

import { Line } from 'react-chartjs-2';
import { Map, Marker, Popup, TileLayer } from 'react-leaflet';

class DeviceUserActions extends Component {
  constructor(props) {
    super(props);

    this.device = { id: props.deviceid };
    this.remove = this.remove.bind(this);
  }

  remove(e) {
    e.preventDefault();
    DeviceActions.triggerRemoval(this.device, (device) => {
      hashHistory.push('/device/list');
      Materialize.toast('Device removed', 4000);
    });
  }

  render() {
    return (
      <div>
        <a className="waves-effect waves-light btn-flat btn-ciano" tabIndex="-1">
          <i className="clickable fa fa-code"/>
        </a>
        <Link to={"/device/list?detail=" + this.props.deviceid} className="waves-effect waves-light btn-flat btn-ciano" tabIndex="-1">
          <i className="clickable fa fa-compress" />
        </Link>
        <Link to={"/device/id/" + this.props.deviceid + "/edit"} className="waves-effect waves-light btn-flat btn-ciano" tabIndex="-1">
          <i className="clickable fa fa-pencil" />
        </Link>
        <a className="waves-effect waves-light btn-flat btn-ciano" onClick={this.remove} tabIndex="-1">
          <i className="clickable fa fa-trash"/>
        </a>
        <Link to={"/device/list"} className="waves-effect waves-light btn-flat btn-ciano" tabIndex="-1">
          <i className="clickable fa fa-times" />
        </Link>
      </div>
    )
  }
}

// TODO move this to its own component
class Graph extends Component{
  constructor(props) {
    super(props);
  }

  render() {
    let labels = [];
    let values = [];
    this.props.data.map((i) => {
      if (i.attrValue.trim().length > 0) {
        labels.push(util.printTime(Date.parse(i.recvTime)/1000));
        if (i.attrType.toLowerCase() === 'integer') {
          values.push(parseInt(i.attrValue));
        } else if (i.attrType.toLowerCase() === 'float') {
          values.push(parseFloat(i.attrValue));
        } else {
          console.error('unknown field type');
          values.push(parseInt(i.attrValue));
        }
      }
    })

    if (values.length == 0) {
      return (
        <div className="valign-wrapper full-height background-info">
          <div className="full-width center">No data available</div>
        </div>
      )
    }

    let filteredLabels = labels.map((i,k) => {
      if ((k == 0) || (k == values.length - 1)) {
        return i;
      } else {
        return "";
      }
    })

    const data = {
      labels: labels,
      xLabels: filteredLabels,
      datasets: [
        {
          label: 'Device data',
          fill: false,
          lineTension: 0.1,
          backgroundColor: 'rgba(75,192,192,0.4)',
          borderColor: 'rgba(75,192,192,1)',
          borderCapStyle: 'butt',
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: 'miter',
          pointBorderColor: 'rgba(75,192,192,1)',
          pointBackgroundColor: '#fff',
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: 'rgba(75,192,192,1)',
          pointHoverBorderColor: 'rgba(220,220,220,1)',
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10,
          data: values
        }
      ]
    }

    const options = {
      maintainAspectRatio: false,
      legend: { display: false },
      scales: {
        xAxes: [
          { display: false },
          { ticks: { autoSkip: true, maxRotation: 0, minRotation: 0 }}
        ],
      }
    }

    return (
      <Line data={data} options={options}/>
    )
  }
}

// TODO move this to its own component
class PositionRenderer extends Component {
  render() {
    function NoData() {
      return (
        <div className="full-height valign-wrapper background-info subtle relative graph">
          <div className="horizontal-center">
            <i className="material-icons">report_problem</i>
            <div>No position data available</div>
          </div>
        </div>
      )
    }

    if (this.props.value.attrValue == null) {
      return (<NoData />);
    }

    let pos = this.props.value.attrValue;
    let parsed = pos.match(/^([+-]?\d+(\.\d+)?)\s*[,]\s*([+-]?\d+(\.\d+)?)$/)

    if (parsed == null) {
      return (<NoData />)
    }

    const position = [parseFloat(parsed[1]),parseFloat(parsed[3])];

    return (
      <div className="map">
        <Map center={position} zoom={19}>
          <TileLayer
            url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          />
          <Marker position={position}></Marker>
        </Map>
      </div>
    )
  }
}

// TODO move this to its own component
class Position extends Component {
  constructor(props) {
    super(props);
  }

  render () {
    let value = undefined;

    if (this.props.data.length > 0) {
      value = this.props.data[this.props.data.length - 1];
    }

    return (
      <PositionRenderer deviceId={this.props.device.id} value={value}/>
    )
  }
}

// TODO move this to its own component
function HistoryList(props) {
  let trimmedList = props.data.filter((i) => {
    return i.attrValue.trim().length > 0
  })
  trimmedList.reverse();

  if (trimmedList.length > 0) {
    return (
      <div className="full-height scrollable history-list">
        {trimmedList.map((i,k) =>
          <div className={"row " + (k % 2 ? "alt-row" : "")} key={i.recvTime}>
            <div className="col s12 value">{i.attrValue}</div>
            <div className="col s12 label">{util.printTime(Date.parse(i.recvTime)/1000)}</div>
          </div>
        )}
      </div>
    )
  } else {
    return (
      <div className="full-height background-info valign-wrapper center">
        <div className="center full-width">No data available</div>
      </div>
    )
  }
}

// TODO move this to its own component
function Attr(props) {
  const known = {
    'integer': Graph,
    'float': Graph,
    'string': HistoryList,
    'geo': Position,
    'default': HistoryList
  }

  const Renderer = props.type in known ? known[props.type] : known['default'];
  return (
    <Renderer {...props} />
  )
}


class DetailAttrs extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.device.attrs.map((i) => {
      MeasureActions.fetchMeasures.defer(this.props.device.id, this.props.device.protocol, i);
    })
  }

  render() {
    const device = this.props.device;

    let filteredStatics = this.props.device.static_attrs.filter((a) => { return (a.type.toLowerCase() != "geo")});

    function AttrList(props) {
      return (
        <span>
          { device.attrs.map((i, k) =>
              <div className={"col s12 m6 l6 metric-card full-height mt10"} key={i.object_id} >
                {(props.devices[device.id] && props.devices[device.id][i.name] &&
                  (props.devices[device.id][i.name].loading == false)) ? (
                  <div className="graphLarge z-depth-2 full-height">
                    <div className="title ">
                      <span>{i.name}</span>
                      <span className="right"
                            onClick={() => MeasureActions.fetchMeasures(device.id, device.protocol, i)}>
                        <i className="fa fa-refresh" />
                      </span>
                    </div>
                    <div className="contents">
                      <Attr device={device} type={props.devices[device.id][i.name].type} data={props.devices[device.id][i.name].data}/>
                    </div>
                  </div>
                ) : (
                  <div className="graphLarge z-depth-2 full-height">
                    <span className="title">{i.name}</span>
                    <div className="contents">
                      <div className="background-info valign-wrapper full-height relative bg-gray">
                        <i className="fa fa-circle-o-notch fa-spin fa-fw horizontal-center"/>
                      </div>
                    </div>
                  </div>
                )}
              </div>
          )}
        </span>
      )
    }

    if (filteredStatics.length > 0) {
      return (
        <span>
          <div className="row">
            {filteredStatics.map((i, k) =>
              (i.type.toLowerCase() != "geo") && (
                <div className="col s12 m3 l3">
                  <div className="card z-depth-2">
                    <div className="card-content row">
                      <div className="col s12 main">
                        <div className="value title">{i.name}</div>
                        <div className="label">Name</div>
                      </div>
                      <div className="col s12">
                        <div className="value">{i.value}</div>
                        <div className="label">Value</div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            )}
            </div>
            <AttrList devices={this.props.devices} />
        </span>
      )
    } else {
      return (
        <div className="row half-height">
          <AttrList devices={this.props.devices} />
        </div>
      )
    }
  }
}

function TagList (props) {
  const tags = props.tags;
  return (
    <span>
      { (tags.length > 0) ? (
        tags.map((tag) =>
          <span className="tag" key={tag}>
            <i className="fa fa-tag"></i>{tag}
          </span>
        )
      ) : (
        <sapn className="tag">No tags set</sapn>
      )}
    </span>
  )
}

class DeviceDetail extends Component {
  render() {
    if (this.props.deviceid == null || !this.props.devices.hasOwnProperty(this.props.deviceid)) {
      console.error('Failed to load device attribute data', this.props.deviceid, this.props.devices);
      return (
        //  TODO This appears so many times it might be worth making it a component on its own
        <div className="background-info valign-wrapper full-height relative bg-gray">
          <i className="fa fa-circle-o-notch fa-spin fa-fw horizontal-center"/>
        </div>
      )
    }

    const device = this.props.devices[this.props.deviceid];
    if (device.loading) {
      return (
        //  TODO This appears so many times it might be worth making it a component on its own
        <div className="background-info valign-wrapper full-height relative bg-gray">
          <i className="fa fa-circle-o-notch fa-spin fa-fw horizontal-center"/>
        </div>
      )
    }

    let position = null;
    function getPosition(i) {
      if (i.type == "geo") {
        position = i;
      }
    }
    device.static_attrs.map((i) => {getPosition(i)})
    if (position === null) {
      device.attrs.map((i) => {getPosition(i)})
    }

    return (
      <div className={"lst-entry-wrapper col s12 auto-height " + device._status}>
        <div className="row detail-header">
          <div className="title">
            <div className="label">{device.label}</div>
            <div className="id">ID {device.id}</div>
          </div>
          <div className="status">{status}</div>
        </div>
        <div className="row device">
          <div className="row detail-header">
            <div className="col s12 m10 offset-m1 valign-wrapper">
              <div className="col s3">
                {/* TODO clickable, file upload */}
                <div className="img">
                  <img src="images/ciShadow.svg" />
                </div>
              </div>
              <div className="col s9 detail-body-full-view">
                <div className="metrics col s9">
                  <div className="metric fullPage col s4">
                    <span className="label">Attributes</span>
                    <span className="value">{device.attrs.length + device.static_attrs.length}</span>
                  </div>
                  <div className="metric fullPage col s4">
                    <span className="label">Last update</span>
                    <span className="value">{util.printTime(device.updated)}</span>
                  </div>
                  <div className="metric fullPage ol s4">
                    <span className="label">Uptime</span>
                    <span className="value">N/A</span>
                  </div>
                </div>

                <div className="metrics col s9">
                  <div className="metric fullPage col s4" >
                    <span className="label">Protocol</span>
                    <span className="value">{device.protocol ? device.protocol : "MQTT"}</span>
                  </div>
                  <div className="metric fullPage col s8" >
                    <span className="label">Tags</span>
                    <TagList tags={device.tags} />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col s12 detail-attributes-full-view" >
            <div className="title col s12 paddingTop10">Attributes</div>
            <AltContainer store={MeasureStore} inject={{device: device}} >
              <DetailAttrs />
            </AltContainer>
          </div>
        </div>
      </div>
    )
  }
}

class ViewDevice extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    function loadValues(device) {
      device.attrs.map((i) => {
        MeasureActions.fetchMeasures.defer(device.id, device.protocol, i);
      })
    }

    DeviceActions.fetchSingle.defer(this.props.params.device, loadValues);
  }

  render() {
    let title = "View device";

    return (
      <div className="full-width full-height">
        <ReactCSSTransitionGroup
          transitionName="first"
          transitionAppear={true} transitionAppearTimeout={500}
          transitionEnterTimeout={500} transitionLeaveTimeout={500} >
          <PageHeader title="device manager" subtitle="Devices" />
          <ActionHeader title={title}>
            <DeviceUserActions deviceid={this.props.params.device}/>
          </ActionHeader>
          <AltContainer store={DeviceStore} >
            <DeviceDetail deviceid={this.props.params.device}/>
          </AltContainer>
        </ReactCSSTransitionGroup>
      </div>
    )
  }
}

export { ViewDevice };
