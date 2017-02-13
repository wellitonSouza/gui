import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Dropzone from 'react-dropzone'
import templateManager from '../../comms/templates/TemplateManager';

var TemplateStore = require('../../stores/TemplateStore');
var TemplateActions = require('../../actions/TemplateActions');

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
      <div>
        {this.props.attribute.name} [{this.props.attribute.type}] &nbsp;
        <a title="Remove Attribute" className="btn-item" onClick={this.handleRemove}>
          <i className="fa fa-times" aria-hidden="true"></i>
        </a>
      </div>
    )
  }
}

class DeviceImageUpload extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selection: ""
    }

    this.onDrop = this.onDrop.bind(this);
    this.upload = this.upload.bind(this);
  }

  // this allows us to remove the global script required by materialize as in docs
  componentDidMount() {
    let mElement = ReactDOM.findDOMNode(this.refs.modal);
    $(mElement).ready(function() {
      $('.modal').modal();
    })
  }

  onDrop(acceptedFiles) {
    console.log("got files", acceptedFiles);
    this.setState({selection: acceptedFiles[0]});
  }

  upload(e) {
    console.log("about to upload", this.state.selection.name);
    templateManager.setIcon(this.props.targetDevice, this.state.selection)
      .then(function(data) {
        console.log("done");
      })
      .catch(function(error) {
        console.log("Failed to update icon");
      })
  }

  render() {
    return (
      <div className="modal" id="imageUpload" ref="modal">
        <div className="modal-content">
          <div className="row">
            <Dropzone onDrop={this.onDrop} className="dropbox">
              <div className="dropbox-help">Try dropping some files here, or click to select files to upload.</div>
            </Dropzone>
          </div>
          { this.state.selection ? (
            <div className="row fileSelection">
              <span className="label">Selected file</span>
              <span className="data">{this.state.selection.name}</span>
            </div>
          ) : (
            <div className="row fileSelection">
              <span className="data">No file selected</span>
            </div>
          )}
          <div className="pull-right padding-bottom">
            <a onClick={this.upload}
               className=" modal-action modal-close waves-effect waves-green btn-flat">Create</a>
            <a className=" modal-action modal-close waves-effect waves-red btn-flat">Cancel</a>
          </div>
        </div>
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
    console.log("will dismiss - " + this.state.device.id);
  }

  updateDevice(e) {
      e.preventDefault();
      TemplateActions.triggerUpdate(this.state.device);
      console.log("will update - " + this.state.device.id);
  }

  deleteDevice(e) {
      e.preventDefault();
      TemplateActions.triggerRemoval(this.state.device);
  }

  addAttribute(t) {
    let state = this.state.device;
    state.attributes.push({name: this.state.attribute, type: this.state.typeAttribute});
    this.state.attribute = '';
    this.state.typeAttribute = '';
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
    console.log("will render - " + this.state.device.id);
    let detail = this.props.detail === this.props.device.id;
    let edit = (this.props.edit === this.props.device.id) && detail;

    console.log("about to check for icon: " + this.props.device.id + " " + this.props.device.has_icon);
    let labelSize = this.props.device.has_icon ? "lst-title col s10" : "lst-title col s12";
    let iconUrl = "http://localhost:5000/devices/" + this.props.device.id + "/icon";

    return (
      <div className="lst-entry row"
           onClick={detail ? null : this.handleDetail }
           id={this.props.device.id}>
        <form role="form">
          {/* <!-- text status area --> */}
          {!detail && (
            <div className="lst-line col s12">
              <div className={labelSize}>
                <span>{this.props.device.label}</span>
              </div>
              {/* { this.props.device.has_icon && (
                <div className="col s2">
                  <img src={iconUrl} alt="this should be an icon" />
                </div>
              )} */}
              <div className="col m12 hide-on-small-only">
                <div className="data no-padding-left">{this.props.device.id}</div>
              </div>
            </div>
          )}
          {detail && (
            <div className="lst-line col s12">
              { edit ? (
                <div className="col s12">
                  <div className="input-field col s8">
                    <label htmlFor="fld_name">Name</label>
                    <input id="fld_name" type="text"
                           name="label"
                           autoFocus
                           onChange={this.handleChange.bind(this)}
                           value={this.state.device.label} />
                  </div>
                  <div className="col s4">
                    <div className="edit right inline-actions">
                      <a className="btn-floating waves-green right" onClick={this.handleDismiss}>
                        <i className="fa fa-times"></i>
                      </a>
                      <a className="btn-floating waves-green right red" onClick={this.deleteDevice}>
                        <i className="fa fa-trash-o"></i>
                      </a>
                      <button data-target="imageUpload" className="btn-floating waves-effect waves-light right" >
                        <i className="fa fa-file-image-o"></i>
                      </button>
                      {/* <a className="btn-floating waves-green right" onClick={this.deleteDevice}>
                      </a> */}
                    </div>
                  </div>
                  <div className="col m12 hide-on-small-only">
                    <div className="data no-padding-left">{this.props.device.id}</div>
                  </div>

                  <DeviceImageUpload targetDevice={this.props.device.id}/>
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
      filter: ''
    };

    this.handleSearchChange = this.handleSearchChange.bind(this);
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
    if (this.state.detail === id) {
      let temp = this.state;
      temp.edit = id;
      this.setState(temp);
      return true;
    }

    return false;
  }

  handleSearchChange(event) {
    const filter = event.target.value;
    let state = this.state;
    state.filter = filter;
    state.detail = undefined;
    this.setState(state);
  }

  applyFiltering(list) {
    const filter = this.state.filter;
    const idFilter = filter.match(/id:\W*([-a-fA-F0-9]+)\W?/);
    return this.props.devices.filter(function(e) {
      let result = false;
      if (idFilter && idFilter[1]) {
        result = result || e.id.toUpperCase().includes(idFilter[1].toUpperCase());
      }

      return result || e.label.toUpperCase().includes(filter.toUpperCase());
    });
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

    const filteredList = this.applyFiltering(this.props.devices);
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
                <input id="deviceFiltering" type="text" onChange={this.handleSearchChange}></input>
              </div>
            </form>
          </div>
        </div>

        { filteredList.length > 0 ? (
          <span>
            { filteredList.map((device) =>
                <ListItem device={device}
                          key={device.id}
                          detail={this.state.detail}
                          detailedTemplate={this.detailedTemplate}
                          edit={this.state.edit}
                          editTemplate={this.editTemplate}
                          updateDevice={this.updateDevice}
                          deleteDevice={this.deleteDevice}/>
            )}
          </span>
        ) : (
          <div className="col s12">
            <span className="background-info">No templates</span>
          </div>
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
    TemplateActions.addTemplate(JSON.parse(JSON.stringify(this.state.newDevice)));
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

    this.state = TemplateStore.getState();
    this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {
    TemplateStore.listen(this.onChange);
    TemplateActions.fetchTemplates();
  }

  componentWillUnmount() {
    TemplateStore.unlisten(this.onChange);
  }

  onChange(newState) {
    this.setState(TemplateStore.getState());
    console.log("container component - onChange", this.state);
  }

  render() {
    return (
      <ReactCSSTransitionGroup
          transitionName="first"
          transitionAppear={true}
          transitionAppearTimeout={500}
          transitionEnterTimeout={500}
          transitionLeaveTimeout={500} >
        <DeviceList devices={this.state.templates} />
        <NewDevice createDevice={this.createDevice}/>
      </ReactCSSTransitionGroup>
    );
  }
}

export default Templates;
