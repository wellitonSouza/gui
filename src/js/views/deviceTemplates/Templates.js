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

class DeviceAttributes extends Component {
  constructor(props) {
    super(props);

    this.handleRemove = this.handleRemove.bind(this);
  }

  handleRemove(e) {
    this.props.removeAttribute(this.props.attribute);
  }

  render () {
    return (
      <div key={this.props.attribute.name}>
        {this.props.attribute.name} [{this.props.attribute.type}] &nbsp;
        <a title="Remove Attribute" className="btn-item" onClick={this.handleRemove}>
          <i className="fa fa-times" aria-hidden="true"></i>
        </a>
      </div>
    )
  }
}

class ListItem extends Component {
  constructor(props) {
    super(props);

    this.state = {
      device: {
        id: this.props.device.id,
        label: this.props.device.label,
        attributes: []
      },
      attribute: "",
      typeAttribute: ""
    }

    this.handleEdit = this.handleEdit.bind(this);
    this.handleDetail = this.handleDetail.bind(this);
    this.handleDismiss = this.handleDismiss.bind(this);
    this.addAttribute = this.addAttribute.bind(this);
    this.removeAttribute = this.removeAttribute.bind(this);
    this.handleAttribute = this.handleAttribute.bind(this);
    this.updateDevice = this.updateDevice.bind(this);
    this.deleteDevice = this.deleteDevice.bind(this);
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

  updateDevice(e) {
      e.preventDefault();
      this.props.updateDevice(this.state.device);
  }

  deleteDevice(e) {
      e.preventDefault();
      this.props.deleteDevice(this.state.device.id);
  }

  addAttribute(t) {
    let state = this.state.device;
    state.attributes.push({name: this.state.attribute, type: this.state.typeAttribute});
    this.setState({ device : state});
  }

  removeAttribute(attribute) {
    let state = this.state.device;

    for(var i = 0; i < state.attributes.length; i++) {
        if(state.attributes[i].name === attribute.name) {
           state.attributes.splice(i, 1);
        }
    }

    this.setState({device: state});
  }

  handleAttribute(event) {
    const target = event.target;
    let state = this.state;
    state[target.name] = target.value;
    this.setState(state);
  }


  handleChange(event) {
    const target = event.target;
    let state = this.state.device;
    state[target.name] = target.value;
    this.setState({
      device: state
    });
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
           id={this.props.device.id}>
        <form role="form">
          {/* <!-- text status area --> */}
          {!detail && (
            <div className="lst-line col s12">
              <div className="lst-title col s12">
                <span>{this.props.device.label}</span>
              </div>
              <div className="col m12 hide-on-small-only">
                <div className="data no-padding-left">{this.props.device.id}</div>
              </div>
            </div>
          )}
          {detail && (
            <div className="lst-line col s12">
              { edit ? (
                <div className="col s12">
                  <div className="input-field col s10">
                    <label htmlFor="fld_name">Name</label>
                    <input id="fld_name" type="text"
                           name="label"
                           autoFocus
                           onChange={this.handleChange.bind(this)}
                           value={this.state.device.label} />
                  </div>
                  <div className="col s2">
                    <div className="edit right inline-actions">
                      <a className="btn-floating waves-green right" onClick={this.handleDismiss}>
                        <i className="fa fa-times"></i>
                      </a>
                      <a className="btn-floating waves-green right red" onClick={this.deleteDevice}>
                        <i className="fa fa-trash-o"></i>
                      </a>
                    </div>
                  </div>
                  <div className="col m12 hide-on-small-only">
                    <div className="data no-padding-left">{this.props.device.id}</div>
                  </div>
                </div>
              ) : (
                <div className="lst-line col s12">
                  <div className="lst-title col s10">
                    <span>{this.props.device.label}</span>
                  </div>
                  <div className="col s2">
                    <div className="edit right inline-actions">
                      <a className="btn-floating waves-green right" onClick={this.handleDismiss}>
                        <i className="fa fa-times"></i>
                      </a>
                      <a className="btn-floating waves-green right" onClick={this.handleEdit}>
                        <i className="material-icons">mode_edit</i>
                      </a>
                    </div>
                  </div>
                  <div className="col m12 hide-on-small-only">
                    <div className="data no-padding-left">{this.props.device.id}</div>
                  </div>
                </div>
              )}
            </div>
          )}

          {detail && (
            <div className="detailArea col m12">
              { edit ? (
                <div className="row">
                  {/* <!-- attributes --> */}
                  <div className="row">
                    <div className="col s6">
                      <div className="input-field">
                        <label htmlFor="fld_Attributes" >Attributes</label>
                        <input id="fld_Attributes"
                               type="text"
                               name="attribute"
                               value={this.state.attribute}
                               key="attributeName"
                               onChange={this.handleAttribute}></input>
                      </div>
                    </div>
                    <div className="col s4">
                      <div className="input-field">
                        <label htmlFor="fld_Type_Attributes" >Type</label>
                        <input id="fld_Type_Attributes"
                               type="text"
                               name="typeAttribute"
                               value={this.state.typeAttribute}
                               key="attributeName"
                               onChange={this.handleAttribute}></input>
                      </div>
                    </div>
                    <div className="col s2" >
                      <div title="Add Attribute"
                           className="btn btn-item btn-floating waves-effect waves-light cyan darken-2"
                           onClick={this.addAttribute}>
                        <i className="fa fa-plus"></i>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col s12" >
                      <div className="align-list">
                        {this.state.device.attributes.map((attribute) =>(
                          <DeviceAttributes attribute={attribute} removeAttribute={this.removeAttribute} key={attribute.name} />
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="col s12">
                    <div className="pull-right">
                      <a onClick={this.updateDevice}
                         className=" modal-action modal-close waves-effect waves-green btn-flat">Send
                      </a>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="row">
                  <div className="lst-title col s12">
                    <span>Attributes</span>
                  </div>
                  <div className="col s12">
                    <div className="col s2">
                      <span>Name</span>
                    </div>
                    <div className="col s2">
                      <span>Type</span>
                    </div>
                    <div className="col s8">
                    </div>
                  </div>
                  <div className="col s12">
                    {this.state.device.attributes.map((attribute) =>(
                      <div key={attribute.name}>
                          <div className="col s2">
                            <i className="fa fa-caret-right" aria-hidden="true"></i> {attribute.name} &nbsp;
                          </div>
                          <div className="col s2">
                            <i className="fa fa-caret-right" aria-hidden="true"></i> {attribute.type} &nbsp;
                          </div>
                          <div className="col s8">
                            &nbsp;
                          </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </form>
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
    this.updateDevice = this.updateDevice.bind(this);
    this.deleteDevice = this.deleteDevice.bind(this);
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

  updateDevice(device) {
      this.props.updateDevice(device);

      let state = this.state;
      state.edit = undefined;
      this.setState(state);
  }

  deleteDevice(id) {
      this.props.deleteDevice(id);

      let state = this.state;
      state.edit = undefined;
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
                      editTemplate={this.editTemplate}
                      updateDevice={this.updateDevice}
                      deleteDevice={this.deleteDevice}/>
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
    this.updateDevice = this.updateDevice.bind(this);
    this.deleteDevice = this.deleteDevice.bind(this);
  }

  createDevice(device) {
    const devList = deviceManager.addDevice(device);
    this.setState({devices: devList});
  }

  updateDevice(device) {
    const devList = templateManager.setDevice(device.id, device);
    this.setState({devices: devList});
  }

  deleteDevice(id) {
    const devList = templateManager.deleteDevice(id);
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
        <DeviceList devices={this.state.devices} updateDevice={this.updateDevice} deleteDevice={this.deleteDevice}/>
        <NewDevice createDevice={this.createDevice}/>
      </ReactCSSTransitionGroup>
    );
  }
}

export default Templates;
