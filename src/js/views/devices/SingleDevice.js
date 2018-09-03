import React, { Component } from 'react';

export class ViewDevice extends Component {
    constructor(props) {
        super(props);

        this.selectedDevice = deviceManager.getDeviceById(this.props.params.deviceId);

        this.state = {
            device: {
                id: this.selectedDevice.id,
                label: this.selectedDevice.label,
                type: this.selectedDevice.type,
                tags: this.selectedDevice.tags,
            },
            options: ['MQTT', 'CoAP', 'Virtual'],
        };
    }

    handleChange(event) {
    }

    render() {
        return (
            <page>
                <div className="view paddingElements">
                    {/* <!-- name --> */}
                    <div className="row">
                        <h4>
                            {' '}
View Device:
                            {this.state.device.label}
                            {' '}

                        </h4>
                    </div>
                    {/* <!-- device type --> */}
                    <div className="row">
                        <div className="col s12">
                            <label htmlFor="fld_deviceTypes">Type</label>
                            <select
                                id="fld_deviceTypes"
                                className="browser-default"
                                disabled
                                name="type"
                                value={this.state.device.type}
                                onChange={this.handleChange}
                            >
                                <option value="" disabled>Select type</option>
                                {this.state.options.map(type => <option value={type} key={type}>{type}</option>)}
                            </select>
                        </div>
                    </div>
                    {/* <!-- tags --> */}
                    <div className="row">
                        <div className="col s12">
                            <div className="input-field">
                                <label htmlFor="fld_newTag">Tag</label>
                                <input id="fld_newTag" type="text" disabled />
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        {this.state.device.tags.map(tag => (
                            <div className="paddingLeft10px" key={tag}>
                                {tag}
                                {' '}
&nbsp;
                                <a title="Remove tag" className="btn-item">
                                    <i className="fa fa-times" aria-hidden="true" />
                                </a>
                            </div>
                        ))}
                    </div>
                    <div className="row">
                        <div className="pull-right">
                            <a href="#/dashboard" className=" modal-action modal-close waves-effect waves-red btn-flat">back</a>
                        </div>
                    </div>
                </div>
            </page>
        );
    }
}
