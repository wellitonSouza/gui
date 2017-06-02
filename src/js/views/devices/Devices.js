import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import deviceManager from '../../comms/devices/DeviceManager';

import util from "../../comms/util/util";
import DeviceStore from '../../stores/DeviceStore';
import DeviceActions from '../../actions/DeviceActions';
import TemplateStore from '../../stores/TemplateStore';
import TemplateActions from '../../actions/TemplateActions';
import MeasureStore from '../../stores/MeasureStore';
import MeasureActions from '../../actions/MeasureActions';

import { PageHeader } from "../../containers/full/PageHeader";
import Filter from "../utils/Filter";

import AltContainer from 'alt-container';

import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { Link } from 'react-router'

import { Line } from 'react-chartjs-2';
import { Map, Marker, Popup, TileLayer } from 'react-leaflet';

import ReactResizeDetector from 'react-resize-detector';

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

class DeviceTag extends Component {
  constructor(props) {
    super(props);

    this.handleRemove = this.handleRemove.bind(this);
  }

  handleRemove(e) {
    this.props.removeTag(this.props.tag);
  }

  render() {
    return (
      <div key={this.props.tag}>
        {this.props.tag} &nbsp;
        <a title="Remove tag" className="btn-item" onClick={this.handleRemove}>
          <i className="fa fa-times" aria-hidden="true"></i>
        </a>
      </div>
    )
  }
}

function SummaryItem(props) {
  return (
    <div className={"clickable lst-entry-wrapper z-depth-2 col s12 " + props.device._status}>
      <div className="lst-entry-title col s12">
        <div className="img">
          <img src="images/ciShadow.svg" />
        </div>
        <div className="user-label truncate">{props.device.label}</div>
        <div className="label">device name</div>
        <span className={"badge " + status}>{status}</span>
      </div>

      <div className="lst-entry-body col s12">
        {/* TODO fill those with actual metrics */}
        <div className="col s3 metric">
          <div className="metric-value">{props.device.attrs.length + props.device.static_attrs.length}</div>
          <div className="metric-label">Attributes</div>
        </div>
        <div className="col s9 metric last">
          <div className="metric-value">{util.printTime(props.device.updated)}</div>
          <div className="metric-label">Last update</div>
        </div>
      </div>
    </div>
  )
}

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

class PositionRenderer extends Component {
  resize() {
    if (this.leafletMap !== undefined) {
      this.leafletMap.leafletElement.invalidateSize();
    }
  }

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

    if ((this.props.attr == null) ||
        (! (this.props.deviceId in this.props.devices)) ||
        (! (this.props.attr in this.props.devices[this.props.deviceId]))) {
      return (<NoData />);
    }

    let pos = this.props.value;
    let parsed = null;
    if (pos === undefined) {
      const posData = this.props.devices[this.props.deviceId][this.props.attr];
      if (!posData.loading) {
        pos = posData.data[posData.data.length - 1].attrValue;
      } else {
        return (
          <div className="background-info valign-wrapper full-height relative bg-gray">
            <i className="fa fa-circle-o-notch fa-spin fa-fw horizontal-center"/>
          </div>
        )
      }
    }

    parsed = pos.match(/^([+-]?\d+(\.\d+)?)\s*[,]\s*([+-]?\d+(\.\d+)?)$/)
    if (parsed == null) {
      return (<NoData />)
    }

    const position = [parseFloat(parsed[1]),parseFloat(parsed[3])];
    return (
      <Map center={position} zoom={19} ref={m => {this.leafletMap = m;}}>
        <ReactResizeDetector handleWidth onResize={this.resize.bind(this)} />
        <TileLayer
          url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={position}></Marker>
      </Map>
    )
  }
}

class Position extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    if ((this.props.position != null) && ('name' in this.props.position)) {
      MeasureActions.fetchMeasures.defer(this.props.device.id, this.props.device.protocol, this.props.position);
    }
  }

  render () {
    let geoAttr = null;
    let value = undefined;
    if ((this.props.position != null) && ('name' in this.props.position)) {
      geoAttr = this.props.position.name;
      value = this.props.position.value;
    }

    return (
      <AltContainer store={MeasureStore}>
        <PositionRenderer deviceId={this.props.device.id} attr={geoAttr} value={value}/>
      </AltContainer>
    )
  }
}

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

function Attr(props) {
  const known = {
    'integer': Graph,
    'float': Graph,
    'string': HistoryList,
    'default': HistoryList
    // TODO to be implemented
    // 'geo': PositionHistory,
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

    let count = 0;
    if (filteredStatics.length > 0) { count++; }
    count += device.attrs.length;
    count = (count > 3 ? 3 : count);

    let horizontalSize = "col s4";
    if (count == 2 && filteredStatics.length > 0) {
      horizontalSize = "col s8";
    } else if (count != 0) {
      horizontalSize = "col s" + (12 / count);
    }

    function AttrList(props) {
      return (
        <span>
          { device.attrs.map((i, k) =>
            ((k < count) && (i.type.toLowerCase() != "geo")) && (
              <div className={horizontalSize + " metric-card full-height"} key={i.object_id} >
                {(props.devices[device.id] && props.devices[device.id][i.name] &&
                  (props.devices[device.id][i.name].loading == false)) ? (
                  <div className="graph z-depth-2 full-height">
                    <div className="title row">
                      <span>{i.name}</span>
                      <span className="right"
                            onClick={() => MeasureActions.fetchMeasures(device.id, device.protocol, i)}>
                        <i className="fa fa-refresh" />
                      </span>
                    </div>
                    <div className="contents">
                      <Attr type={props.devices[device.id][i.name].type} data={props.devices[device.id][i.name].data}/>
                    </div>
                  </div>
                ) : (
                  <div className="graph z-depth-2 full-height">
                    <span className="title">{i.name}</span>
                    <div className="contents">
                      <div className="background-info valign-wrapper full-height relative bg-gray">
                        <i className="fa fa-circle-o-notch fa-spin fa-fw horizontal-center"/>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )
          )}
        </span>
      )
    }

    if (filteredStatics.length > 0) {
      count--;
      return (
        <div className="row half-height">
          <div className="col s4 full-height">
            <div className="text-info full-height">
              <div className="title">Attributes</div>
              <div className="">
                <ul>
                  {filteredStatics.map((i, k) =>
                    (k < 3) && (i.type.toLowerCase() != "geo") && (
                      <li key={i.name}>
                        <span className="col s6 label">{i.name}</span>
                        <span className="col s6 value">{i.value}</span>
                      </li>
                    )
                  )}
                </ul>
              </div>
            </div>
          </div>

          <AttrList devices={this.props.devices} />
        </div>
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

class DetailItem extends Component {
  constructor(props) {
    super(props);
    this.remove = this.remove.bind(this);
  }

  remove(e) {
    e.preventDefault();
    DeviceActions.triggerRemoval(this.props.device, () => {
      Materialize.toast('Device removed', 4000);
    });
    this.props.handleDismiss();
  }

  render() {
    let position = null;
    function getPosition(i) {
      if (i.type == "geo") {
        position = i;
      }
    }
    this.props.device.static_attrs.map((i) => {getPosition(i)})
    if (position === null) {
      this.props.device.attrs.map((i) => {getPosition(i)})
    }

    return (
      <div className={"lst-entry-wrapper z-depth-2 col s12 " + this.props.device._status}>
        <div className="row detail-header">
          <div className="title col title-area">
            <div className="label truncate">{this.props.device.label}</div>
            <div className="id">ID {this.props.device.id}</div>
          </div>
          <div className="col action-area">
            <div className="relative full-width full-height">
              <div className="actions">
                <div><i className="clickable fa fa-code" /></div>
                <Link to={"/device/id/" + this.props.device.id + "/detail"} >
                  <div><i className="clickable fa fa-expand" /></div>
                </Link>
                <Link to={"/device/id/" + this.props.device.id + "/edit"} >
                  <div><i className="clickable fa fa-pencil" /></div>
                </Link>
                <div><i className="clickable fa fa-trash" onClick={this.remove}/></div>
                <div><i className="clickable fa fa-times" onClick={this.props.handleDismiss}/></div>
              </div>
              <div className="status">{status}</div>
            </div>
          </div>
        </div>

        <div className="row detail-body">
          <div className="row content">
            <div className="col s9 full-height">
              <div className="row half-height">
                <div className="col s3 full-height">
                  <div className="img full-height">
                    <img src="images/ciShadow.svg" />
                  </div>
                </div>
                <div className="col s9">
                  <div className="metrics col s12">
                    <div className="metric col s4">
                      <span className="label">Attributes</span>
                      <span className="value">{this.props.device.attrs.length + this.props.device.static_attrs.length}</span>
                      {/* <span className="value">{this.props.device.attrs.length}</span> */}
                    </div>
                    <div className="metric col s4">
                      <span className="label">Last update</span>
                      <span className="value">{util.printTime(this.props.device.updated)}</span>
                    </div>
                    <div className="metric col s4">
                      <span className="label">Uptime</span>
                      <span className="value">N/A</span>
                    </div>
                  </div>

                  <div className="metrics col s12">
                    <div className="metric col s4" >
                      <span className="label">Protocol</span>
                      <span className="value">{this.props.device.protocol ? this.props.device.protocol : "MQTT"}</span>
                    </div>
                    <div className="metric col s8" >
                      <span className="label">Tags</span>
                      <TagList tags={this.props.device.tags} />
                    </div>
                  </div>
                </div>
              </div>
              <AltContainer store={MeasureStore} inject={{device: this.props.device}} >
                <DetailAttrs />
              </AltContainer>
            </div>
            <div className="col s3 map z-depth-2 full-height">
              <Position device={this.props.device} position={position}/>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

class ListItem extends Component {
  constructor(props) {
    super(props);

    this.handleDetail = this.handleDetail.bind(this);
    this.handleDismiss = this.handleDismiss.bind(this);
  }

  handleDetail(e) {
    e.preventDefault();
    this.props.setDetail(this.props.device.id);
  }

  handleDismiss(e) {
    if (e) {
      e.preventDefault();
    }
    this.props.setDetail(null);
  }

  render() {
    const detail = this.props.detail

    if (detail) {
      return (
        <div className="lst-entry col s12 detail" id={this.props.device.id} >
          <DetailItem device={this.props.device} handleDismiss={this.handleDismiss}/>
        </div>
      )
    } else {
      return (
        <div className="lst-entry col s12 m6 l4" id={this.props.device.id} onClick={this.handleDetail}>
          <SummaryItem device={this.props.device} />
        </div>
      )
    }
  }
}

class ListRender extends Component {
  constructor(props) {
    super(props);

    this.state = {detail: props.deviceid};
    this.setDetail = this.setDetail.bind(this);
  }

  setDetail(id) {
    this.setState({detail: id});
  }

  render() {
    if (this.props.loading) {
      return (
        <div className="background-info valign-wrapper full-height">
          <i className="fa fa-circle-o-notch fa-spin fa-fw horizontal-center"/>
        </div>
      )
    }

    // handles reordering of cards to keep horizontal alignment
    const target = this.state.detail;
    const horSize = 3;
    let display_list = JSON.parse(JSON.stringify(this.props.devices));
    display_list.move = function(from, to) {
      this.splice(to, 0, this.splice(from, 1)[0]);
    }
    if (target != null) {
      for (let i = 0; i < display_list.length; i++) {
        if (display_list[i].id == target) {
          display_list.move(i,i - (i % horSize));
          break;
        }
      }
    }

    if (display_list.length > 0) {
      return (
        <div className="row">
          <div className="col s12  lst-wrapper">

            { display_list.map((device, idx) =>
              <ListItem device={device} key={device.id}
                detail={device.id === this.state.detail}
                setDetail={this.setDetail}
              />
            )}


          </div>
        </div>
      )
    } else {
      return  (
        <div className="background-info valign-wrapper full-height">
          <span className="horizontal-center">No configured devices</span>
        </div>
      )
    }
  }
}

function MapRender(props) {
  const deviceList = props.devices;
  return (
    <div>
      <p>map goes here!</p>
    </div>
  )
}

class DeviceList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isDisplayList: true,
      filter: '',
    };

    this.handleViewChange = this.handleViewChange.bind(this);
    this.applyFiltering = this.applyFiltering.bind(this);
  }

  handleViewChange(event) {
    this.setState({isDisplayList: ! this.state.isDisplayList})
  }

  // handleSearchChange(event) {
  //   const filter = event.target.value;
  //   let state = this.state;
  //   state.filter = filter;
  //   state.detail = undefined;
  //   this.setState(state);
  // }

  applyFiltering(deviceList) {
    const filter = this.state.filter;
    const idFilter = filter.match(/id:\W*([-a-fA-F0-9]+)\W?/);

    return deviceList.filter(function(e) {
      let result = false;
      if (idFilter && idFilter[1]) {
        result = result || e.id.toUpperCase().includes(idFilter[1].toUpperCase());
      }

      return result || e.label.toUpperCase().includes(filter.toUpperCase());
    });
  }

  render() {
    const filteredList = this.applyFiltering(this.props.devices);

    return (
      <div className="col m10 s12 offset-m1 relative full-height">

        {(this.state.isDisplayList) ? (
            <ListRender devices={filteredList} loading={this.props.loading} deviceid={this.props.deviceid} />
        ) : (
            <MapRender devices={filteredList} loading={this.props.loading} deviceid={this.props.deviceid} />
        )}

        {/* <!-- footer --> */}
        <div className="col s12"></div>
        <div className="col s12">&nbsp;</div>
      </div>
    )
  }
}

class Devices extends Component {

  constructor(props) {
    super(props);

    this.filterChange = this.filterChange.bind(this);
  }

  componentDidMount() {
    DeviceActions.fetchDevices.defer();
  }

  filterChange(newFilter) {
    console.log("about to change filter: " + newFilter);
  }

  render() {
    const detail = ('detail' in this.props.location.query) ? this.props.location.query.detail : null;
    return (
      <ReactCSSTransitionGroup
        transitionName="first"
        transitionAppear={true}
        transitionAppearTimeout={500}
        transitionEnterTimeout={500}
        transitionLeaveTimeout={500} >
        <PageHeader title="device manager" subtitle="Devices" shadow='true'>
          {/* <Filter onChange={this.filterChange} /> */}
          <Link to="/device/new" className="btn-item btn-floating waves-effect waves-light cyan darken-2">
            <i className="fa fa-plus"/>
          </Link>
        </PageHeader>
        <AltContainer store={DeviceStore}>
          <DeviceList deviceid={detail}/>
        </AltContainer>
        {/* <NewDevice /> */}
      </ReactCSSTransitionGroup>
    );
  }
}

export { Devices };
