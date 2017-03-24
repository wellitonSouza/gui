// @TODO actually this could make use of alt's container boilerplate
class EditWrapper extends Component {
  constructor(props) {
    super(props);

    this.state =  {
      device: props.device,
      templates: TemplateStore.getState().templates
    }

    this.onChange = this.onChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleRemove = this.handleRemove.bind(this);
    this.handleFieldChange = this.handleFieldChange.bind(this);
  }

  componentDidMount() {
    TemplateStore.listen(this.onChange);
    TemplateActions.fetchTemplates();
  }

  componentWillUnmount() {
    TemplateStore.unlisten(this.onChange);
  }

  handleSubmit(e) {
    e.preventDefault();
    DeviceActions.triggerUpdate(this.state);
  }

  handleFieldChange(e) {
    let state = this.state;
    state[e.target.name] = e.target.value;
    this.setState(state);
  }

  handleRemove(e) {
    DeviceActions.triggerRemoval(this.props.device);
  }

  onChange(templates) {
    this.setState({device: this.state.device, templates: templates.templates});
  }

  render() {
    return (
      <EditItem device={this.state.device} templates={this.state.templates}
                handleSubmit={this.handleSubmit}
                handleRemove={this.handleRemove}
                handleFieldChange={this.handleFieldChange}
                handleDismiss={this.props.handleDismiss} />
    )
  }
}

class EditItem extends Component {
  constructor (props) {
    super(props);
  }

  componentDidMount() {
    let callback = this.props.handleFieldChange.bind(this);
    let sElement = ReactDOM.findDOMNode(this.refs.dropdown);
    $(sElement).ready(function() {
      $('select').material_select();
      $('#fld_deviceTypes').on('change', callback);
    });

    Materialize.updateTextFields();
  }

  render() {
    const status = this.props.device.status ? 'online' : 'offline'
    return (
      <form>
        <div className="lst-edit" >
          <div className="lst-line col s10">
            <div className="lst-title col s12 input-field">
              <label htmlFor="fld_label">Label</label>
              <input id="fld_label" type="text"
                     name="label" value={this.props.device.label}
                     key="label" onChange={this.props.handleFieldChange} />
            </div>
            <div className="col s12">
              <div className="row">
                <div className="col s12 m4">{this.props.device.id}</div>
                <div className="col s12 m4">{status}</div>
              </div>
              <div className="row">
                <div className="col s12">
                  <label htmlFor="fld_deviceTypes">Template</label>
                  <select id="fld_deviceTypes"
                          name="type"
                          ref="dropdown"
                          value={this.props.device.type}
                          onChange={this.handleChange}>
                    <option value="" disabled>Select type</option>
                    {this.props.templates.map((type) => <option value={type.id} key={type.id}>{type.label}</option>)}
                  </select>
                </div>
              </div>
              {/* @TODO add missing tags field */}
              {/* @TODO add missing custom attrs field */}
            </div>
          </div>

          <div className="col s2">
            <div className="edit right inline-actions">
              <a className="btn-floating waves-green right" onClick={this.props.handleDismiss}>
                <i className="fa fa-times"></i>
              </a>
              <a className="btn-floating waves-light red right" onClick={this.props.handleRemove}>
                <i className="fa fa-trash-o" />
              </a>
            </div>
          </div>
        </div>
        <div className="col s12">
          {/* this should actually be on the top menu, shouldn't it? */}
          <div className="pull-right">
            <a onClick={this.props.handleSubmit}
               className=" modal-action modal-close waves-effect waves-green btn-flat">Send
            </a>
          </div>
        </div>
      </form>
    )
  }
}
