class ListItem extends Component {
    constructor(props) {
        super(props);

        this.state = {
            device: {
                id: this.props.device.id,
                label: this.props.device.label,
                attributes: [],
            },
            attribute: '',
            typeAttribute: '',
        };

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
        const device = this.state.device;
        device.has_icon = this.props.device.has_icon;
        TemplateActions.triggerUpdate(this.state.device);
    }

    deleteDevice(e) {
        e.preventDefault();
        TemplateActions.triggerRemoval(this.state.device);
    }

    addAttribute(t) {
        const state = this.state.device;
        state.attributes.push({ name: this.state.attribute, type: this.state.typeAttribute });
        this.state.attribute = '';
        this.state.typeAttribute = '';
        this.setState({ device: state });
    }

    removeAttribute(attribute) {
        const state = this.state.device;

        for (let i = 0; i < state.attributes.length; i++) {
            if (state.attributes[i].name === attribute.name) {
                state.attributes.splice(i, 1);
            }
        }

        this.setState({ device: state });
    }

    handleAttribute(event) {
        const target = event.target;
        const state = this.state;
        state[target.name] = target.value;
        this.setState(state);
    }

    handleChange(event) {
        const target = event.target;
        const state = this.state.device;
        state[target.name] = target.value;
        this.setState({
            device: state,
        });
    }

    render() {
        const detail = this.props.detail === this.props.device.id;
        const edit = (this.props.edit === this.props.device.id) && detail;

        // let labelSize = this.props.device.has_icon ? "lst-title col s10" : "lst-title col s12";
        // let iconUrl = "http://localhost:5000/template/" + this.props.device.id + "/icon";

        return (
            <div className="lst-entry col s12 m4" id={this.props.device.id} onClick={detail ? null : this.handleDetail}>
                {/* { detail && edit && (
          <EditWrapper device={this.props.device} handleRemove={this.handleRemove} handleDismiss={this.handleDismiss}/>
        )}
        { detail && !edit && (
          <DetailItem device={this.props.device} handleEdit={this.handleEdit} handleDismiss={this.handleDismiss}/>
        )} */}
                { !detail && (
                    <SummaryItem template={this.props.device} />
                )}
            </div>
        );


        return (
            <div
                className="lst-entry row"
                onClick={detail ? null : this.handleDetail}
                id={this.props.device.id}
            >
                <div className="col s1 icon">
                    { this.props.device.has_icon ? (
                        <img
                            src={`http://localhost:5000/template/${this.props.device.id}/icon?extra=${this.props.device.toggle}`}
                            alt="this should be an icon"
                        />
                    ) : (
                        <i className="fa fa-microchip" />
                    )}
                </div>
                <form role="form">
                    {/* <!-- text status area --> */}
                    {!detail && (
                        <div className="lst-line col s11">
                            <div className={labelSize}>
                                <span>{this.props.device.label}</span>
                            </div>
                            <div className="col m12 hide-on-small-only">
                                <div className="data no-padding-left">{this.props.device.id}</div>
                            </div>
                        </div>
                    )}
                    {detail && (
                        <div className="lst-line col s11">
                            { edit ? (
                                <div className="col s12">
                                    <div className="input-field col s8">
                                        <label htmlFor="fld_name">Name</label>
                                        <input
                                            id="fld_name"
                                            type="text"
                                            name="label"
                                            autoFocus
                                            onChange={this.handleChange.bind(this)}
                                            value={this.state.device.label}
                                        />
                                    </div>
                                    <div className="col s4">
                                        <div className="edit right inline-actions">
                                            <a className="btn-floating waves-green right" onClick={this.handleDismiss}>
                                                <i className="fa fa-times" />
                                            </a>
                                            <a className="btn-floating waves-green right red" onClick={this.deleteDevice}>
                                                <i className="fa fa-trash-o" />
                                            </a>
                                            <button data-target="imageUpload" className="btn-floating waves-effect waves-light right">
                                                <i className="fa fa-file-image-o" />
                                            </button>
                                            {/* <a className="btn-floating waves-green right" onClick={this.deleteDevice}>
                      </a> */}
                                        </div>
                                    </div>
                                    <div className="col m12 hide-on-small-only">
                                        <div className="data no-padding-left">{this.props.device.id}</div>
                                    </div>

                                    <DeviceImageUpload targetDevice={this.props.device.id} />
                                </div>
                            ) : (
                                <div className="lst-line col s12">
                                    <div className="lst-title col s10">
                                        <span>{this.props.device.label}</span>
                                    </div>
                                    <div className="col s2">
                                        <div className="edit right inline-actions">
                                            <a className="btn-floating waves-green right" onClick={this.handleDismiss}>
                                                <i className="fa fa-times" />
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
                                                <label htmlFor="fld_Attributes">Attributes</label>
                                                <input
                                                    id="fld_Attributes"
                                                    type="text"
                                                    name="attribute"
                                                    value={this.state.attribute}
                                                    key="attributeName"
                                                    onChange={this.handleAttribute}
                                                />
                                            </div>
                                        </div>
                                        <div className="col s4">
                                            <div className="input-field">
                                                <label htmlFor="fld_Type_Attributes">Type</label>
                                                <input
                                                    id="fld_Type_Attributes"
                                                    type="text"
                                                    name="typeAttribute"
                                                    value={this.state.typeAttribute}
                                                    key="attributeName"
                                                    onChange={this.handleAttribute}
                                                />
                                            </div>
                                        </div>
                                        <div className="col s2">
                                            <div
                                                title="Add Attribute"
                                                className="btn btn-item btn-floating waves-effect waves-light cyan darken-2"
                                                onClick={this.addAttribute}
                                            >
                                                <i className="fa fa-plus" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col s12">
                                            <div className="align-list">
                                                {this.state.device.attributes.map(attribute => (
                                                    <DeviceAttributes attribute={attribute} removeAttribute={this.removeAttribute} key={attribute.name} />
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col s12">
                                        <div className="pull-right">
                                            <a
                                                onClick={this.updateDevice}
                                                className=" modal-action modal-close waves-effect waves-green btn-flat"
                                            >
Send
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
                                        <div className="col s8" />
                                    </div>
                                    <div className="col s12">
                                        {this.state.device.attributes.map(attribute => (
                                            <div key={attribute.name}>
                                                <div className="col s2">
                                                    <i className="fa fa-caret-right" aria-hidden="true" />
                                                    {' '}
                                                    {attribute.name}
                                                    {' '}
&nbsp;
                                                </div>
                                                <div className="col s2">
                                                    <i className="fa fa-caret-right" aria-hidden="true" />
                                                    {' '}
                                                    {attribute.type}
                                                    {' '}
&nbsp;
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
        );
    }
}
