import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import templateManager from '../../comms/templates/TemplateManager';

import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

function TagList (props) {
  const tags = props.tags;
  return (
    <div className="col m6 data">
      { tags.map((tag) => <span key={tag}>{tag}</span>) }
    </div>
  )
}

class ListItem extends Component {
  constructor(props) {
    super(props);

    this.handleEdit = this.handleEdit.bind(this);
    this.handleDetail = this.handleDetail.bind(this);
    this.handleDismiss = this.handleDismiss.bind(this);
  }

  handleDetail(e) {
    e.preventDefault();
    this.props.detailedTemplate(this.props.device.id);
  }

  handleEdit(e) {
    e.preventDefault();
    this.props.editTemplate(this.props.device.id);
  }

  handleDismiss(e) {
    e.preventDefault();
    this.props.detailedTemplate(undefined);
  }

  render() {
    let detail = this.props.detail === this.props.device.id;
    let edit = (this.props.edit === this.props.device.id) && detail;

    if (detail) {
      console.log("about to fetch data");
    }

    return (
      <div className="lst-entry row"
           onClick={detail ? null : this.handleDetail }
           id={this.props.device.id} >
        {/* <!-- text status area --> */}
        <div className="lst-line col s10">
          <div className="lst-title col s12">
            <span>{this.props.device.label}</span>
          </div>
          <div className="col m12 hide-on-small-only">
            <div className="data no-padding-left">{this.props.device.id}</div>
          </div>
        </div>
        {detail && (
          <span>
          {/* <div className="fixed-action-btn horizontal click-to-toggle" id="contextActions">
            <a className="btn-floating btn-large red">
              <i className="material-icons">menu</i>
            </a>
            <ul>
              <li>
                <a className="btn-floating red">
                  <i className="material-icons">insert_chart</i>
                </a>
              </li>
              <li>
                <a className="btn-floating yellow darken-1">
                  <i className="material-icons">format_quote</i>
                </a>
              </li>
              <li>
                <a className="btn-floating green">
                  <i className="material-icons">publish</i>
                </a>
              </li>
              <li>
                <a className="btn-floating blue">
                  <i className="material-icons">attach_file</i>
                </a>
              </li>
            </ul>
          </div> */}

          <div className="edit right inline-actions">
            <a className="btn-floating waves-green right" onClick={this.handleDismiss}>
              <i className="fa fa-times"></i>
            </a>
            <a className="btn-floating waves-green right" onClick={this.handleEdit}>
              <i className="material-icons">mode_edit</i>
            </a>
          </div>
          </span>
        )}

        {detail && (
          <div className="detailArea col s12">
            { edit ? (
              <p>Form goes here</p>
            ) : (
              <p>Details will be displayed here</p>
            )}
          </div>
        )}
      </div>
    )
  }
}

class DeviceList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isDisplayList: true,
      filter: '',
      filteredList: props.devices,
    };

    this.handleViewChange = this.handleViewChange.bind(this);
    this.applyFiltering = this.applyFiltering.bind(this);
    this.detailedTemplate = this.detailedTemplate.bind(this);
    this.editTemplate = this.editTemplate.bind(this);
  }

  detailedTemplate(id) {
    console.log("about to set detail: " + id);
    if (this.state.detail && this.state.edit) {
      console.log("are you sure???");
    }

    let temp = this.state;
    temp.detail = id;
    this.setState(temp);
    return true;
  }

  editTemplate(id) {
    console.log("about to set edit: " + id);
    if (this.state.detail === id) {
      let temp = this.state;
      temp.edit = id;
      this.setState(temp);
      return true;
    }

    return false;
  }

  handleViewChange(event) {
    this.setState({isDisplayList: ! this.state.isDisplayList})
  }

  applyFiltering(event) {
    const filter = event.target.value;
    const idFilter = filter.match(/id:\W*([-a-fA-F0-9]+)\W?/);

    let state = this.state;
    state.filter = filter;
    state.detail = undefined;
    state.filteredList = this.props.devices.filter(function(e) {
      let result = false;
      if (idFilter && idFilter[1]) {
        result = result || e.id.toUpperCase().includes(idFilter[1].toUpperCase());
      }

      return result || e.label.toUpperCase().includes(filter.toUpperCase());
    });

    this.setState(state);
  }

  render() {
    return (
      <div className="col m10 s12 offset-m1 " >
        {/* header */}
        <div className="row">
          <div className="col s12 col m8 right">
            <form role="form">
              {/* filter selection  */}
              <div className="input-field">
                <i className="search-icon prefix fa fa-filter"></i>
                <label htmlFor="deviceFiltering">Filter</label>
                <input id="deviceFiltering" type="text" onChange={this.applyFiltering}></input>
              </div>
            </form>
          </div>
        </div>

        { this.state.filteredList.map((device) =>
            <ListItem device={device}
                      key={device.id}
                      detail={this.state.detail}
                      detailedTemplate={this.detailedTemplate}
                      edit={this.state.edit}
                      editTemplate={this.editTemplate}/>
        )}

        {/* <!-- footer --> */}
        <div className="col s12"></div>
        <div className="col s12">&nbsp;</div>

        <div className="modal" id="infoLostModal" ref="modal">
          <div className="modal-content">
            <p>Are you sure you want to close template?</p>
            <p>Information might be lost.</p>

            <div className="pull-right">
              <a onClick={this.createDevice}
                 className=" modal-action modal-close waves-effect waves-green btn-flat">Discard</a>
              <a className=" modal-action modal-close waves-effect waves-red btn-flat">Cancel</a>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

class NewDevice extends Component {
  constructor(props) {
    super(props);

    this.state = {
      newDevice: {
        id: "",
        label: "",
        attrs: []
      }
    }

    this.addTag = this.addTag.bind(this);
    this.createDevice = this.createDevice.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  // this allows us to remove the global script required by materialize as in docs
  componentDidMount() {
    let callback = this.handleChange.bind(this);

    let sElement = ReactDOM.findDOMNode(this.refs.dropdown);
    $(sElement).ready(function() {
      $('select').material_select();
      $('#fld_deviceTypes').on('change', callback);
    });

    let mElement = ReactDOM.findDOMNode(this.refs.modal);
    $(mElement).ready(function() {
      $('.modal').modal();
    })
  }

  addTag(t) {
    state = this.state.newDevice;
    state.attrs.push(t);
    this.setState({newDevice: state});
  }

  createDevice() {
    this.props.createDevice(this.state.newDevice);
  }

  handleChange(event) {
    const target = event.target;
    let state = this.state.newDevice;
    state[target.name] = target.value;
    this.setState({
      newDevice: state
    });
  }

  render() {
    return (
      <div>
        <div id="newDeviceBtn" className="" >
          <button data-target="newDeviceForm" className="btn waves-effect waves-light btn-default" >
            <i className="fa fa-plus fa-2x"></i>
          </button>
        </div>

        <div className="modal" id="newDeviceForm" ref="modal">
          <div className="modal-content">
            <div className="row">
              <form role="form">
                {/* <!-- name --> */}
                <div className="row">
                  <div className="input-field col s12">
                    <label htmlFor="fld_name">Name</label>
                    <input id="fld_name" type="text"
                           name="label"
                           onChange={this.handleChange}
                           value={this.state.newDevice.label} />
                  </div>
                </div>

                {/* <!-- attrs --> */}
                <div className="row">
                  <div className="col s10">
                    <div className="input-field">
                      <label htmlFor="fld_newTag" >Tag</label>
                      <input id="fld_newTag" type="text"></input>
                    </div>
                  </div>
                  <div className="col s2" >
                    <div title="Add tag" className="btn btn-item btn-floating waves-effect waves-light cyan darken-2" >
                      <i className="fa fa-plus"></i>
                    </div>
                  </div>
                </div>
                <div className="row">
                  {this.state.newDevice.attrs.map((tag) =>(
                    <div>
                      {tag} &nbsp;
                      <a title="Remove tag" className="btn-item">
                        <i className="fa fa-times" aria-hidden="true"></i>
                      </a>
                    </div>
                  ))}
                </div>
              </form>
              <div className="pull-right">
                <a onClick={this.createDevice}
                   className=" modal-action modal-close waves-effect waves-green btn-flat">Create</a>
                <a className=" modal-action modal-close waves-effect waves-red btn-flat">Cancel</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

class Templates extends Component {

  constructor(props) {
    super(props);

    this.state = {
      devices: templateManager.getDevices(),
    };

    this.createDevice = this.createDevice.bind(this);
  }

  createDevice(device) {
    const devList = deviceManager.addDevice(device);
    this.setState({devices: devList});
  }

  render() {
    return (
      <ReactCSSTransitionGroup
          transitionName="first"
          transitionAppear={true}
          transitionAppearTimeout={500}
          transitionEnterTimeout={500}
          transitionLeaveTimeout={500} >
        <DeviceList devices={this.state.devices} />
        <NewDevice createDevice={this.createDevice}/>
      </ReactCSSTransitionGroup>
    );
  }
}

export default Templates;
