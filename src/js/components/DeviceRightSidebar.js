/* eslint-disable */
import React, { Component } from 'react';
import { Link } from 'react-router';
import { withNamespaces } from 'react-i18next';

class ListItem extends Component {
    constructor(props) {
        super(props);
        this.toggleDevice = this.toggleDevice.bind(this);
    }

    toggleDevice() {
        this.props.toggleVisibility(this.props.device.id);
    }

    render() {
        const name = this.props.device.label;
        const { t } = this.props;
        return (
            <div className="lst-entry-title col s12">
                <div className="user-label truncate col s7">{name}</div>
                <div className="col s5 options">
                    {this.props.is_showing ? (
                        <div className="searchBtn operations" onClick={this.toggleDevice}
                             title={`${t('text.hide')} ${t('text.all')}`}>
                            <i className="fa fa-eye"/>
                        </div>
                    ) : (
                        <div className="searchBtn operations" onClick={this.toggleDevice}
                             title={`${t('text.show')} ${t('text.all')}`}>
                            <i className="fa fa-eye-slash"/>
                        </div>
                    )}
                    <Link to={`/device/id/${this.props.device.id}/detail`} title="View details">
                        <div className="searchBtn operations"
                             title={t('devices:alerts.view_device_information')}>
                            <i className="fa fa-info-circle"/>
                        </div>
                    </Link>
                </div>
            </div>
        );
    }
}


class ListRender extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { t } = this.props;
        const deviceList = this.props.devices;

        if (deviceList.length > 0) {
            return (
                <div className="row">
                    {deviceList.map((device, idx) => (
                        <ListItem
                            toggleVisibility={this.props.toggleVisibility}
                            device={device}
                            is_showing={this.props.displayMap[device.id]}
                            key={device.id}
                            t={t}
                        />
                    ))}
                </div>
            );
        }
        return (
            <div className="background-info valign-wrapper full-height">
                <span className="horizontal-center">{t('text.no_data')}</span>
            </div>
        );
    }
}


class List extends Component {
    constructor(props) {
        super(props);
        this.hideDevices = this.hideDevices.bind(this);
        this.showDevices = this.showDevices.bind(this);
    }

    hideDevices() {
        this.props.hideAll();
    }

    showDevices() {
        this.props.showAll();
    }

    render() {
        const { t } = this.props;
        return (
            <div className="list-of-devices">
                <div className="row device-list">
                    <div className="col s12 info-header">
                        <div className="col s6 subtitle">{this.props.deviceInfo}</div>
                        <div className="col s6 device-list-actions">
                            <div className="col s6 action-hide">
                                <a className="waves-effect waves-light" onClick={this.hideDevices}>
                                    {`${t('text.hide')} ${t('text.all')}`}
                                </a>
                            </div>
                            <div className="col s6 action-show">
                                <a className="waves-effect waves-light" onClick={this.showDevices}>
                                    {`${t('text.show')} ${t('text.all')}`}
                                </a>
                            </div>
                        </div>
                    </div>
                    <div className="deviceCanvas">
                        <ListRender toggleVisibility={this.props.toggleVisibility}
                                    devices={this.props.devices}
                                    displayMap={this.props.displayMap} t={t}/>
                    </div>
                </div>
            </div>
        );
    }
}

class Sidebar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            click: false,
            sideBarOpened: false,
        };

        this.toggleSideBar = this.toggleSideBar.bind(this);
    }

    toggleSideBar() {
        const last = this.state.sideBarOpened;
        this.setState({ sideBarOpened: !last });
    }


    render() {
        const btnSideBarClass = `fa fa-chevron-${this.state.sideBarOpened ? 'right' : 'left'}`;
        const { t } = this.props;
        return (
            <div className="col m12">
                <div
                    className={`col m12 div-btn-side-painel ${this.state.sideBarOpened ? 'push-left' : 'no-left'}`}>
                    <button type="button" className="btn btn-circle sideBarToggle"
                            onClick={this.toggleSideBar}>
                        <i className={btnSideBarClass} aria-hidden="true"/>
                    </button>
                </div>
                {this.state.sideBarOpened ? (
                    <div className="col device-painel full-height">
                        <div className="col device-painel-body relative">
                            <List deviceInfo={this.props.deviceInfo}
                                  toggleVisibility={this.props.toggleVisibility}
                                  devices={this.props.devices} hideAll={this.props.hideAll}
                                  showAll={this.props.showAll} displayMap={this.props.displayMap}
                                  t={t}/>
                        </div>
                    </div>
                ) : null}
            </div>
        );
    }
}

export default withNamespaces()(Sidebar);
