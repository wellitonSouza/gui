import React, { Component } from 'react';

class old_NewTemplate extends Component {
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

function NewTemplate(props) {
  console.log("about to render");
  return (
    <div>This is a template form</div>
  )
}

export { NewTemplate };
