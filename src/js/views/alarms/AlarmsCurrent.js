/* eslint-disable */
import React, { Component } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { Loading } from '../../components/Loading';
import AlarmStore from '../../stores/AlarmsStore';
import AlarmAction from '../../actions/AlarmsActions';
import util from '../../comms/util/util';


function AlarmListHeader(props) {
    return (
        <div id="alarm-list-header" className="alarm-header">
            <div>
Showing&nbsp;
                <span>{props.quantity}</span>
                {' '}
&nbsp;Alarms
            </div>
        </div>
    );
}

function AlarmList(props) {
    return (
        <div id="alarm-list-area" className="list-area">
            <ReactCSSTransitionGroup
                transitionName="first"
                transitionLeave
                transitionAppear
                transitionAppearTimeout={100}
                transitionEnterTimeout={100}
                transitionLeaveTimeout={100}
            >
                {props.filteredList.map(list => <AlarmRow {...list} key={list._id} />)}
            </ReactCSSTransitionGroup>
        </div>
    );
}

function SideMenu(props) {
    return (
        <div id="menu-area" className="side-menu">
            <div id="menu-header" className="header-row">
                <span>severity</span>
            </div>
            <div
                id="warning-row"
                className={`menu-row warning ${props.active.warning ? 'row-selected' : ''}`}
                onClick={props.changeStatus.bind(this, 'warning')}
            >
                <div id="warning-color-bar" className="color-bar bg-warning" />
                <div id="warning-text-area" className="text-area">
                    <div id="side-menu-title-warning" className="title warning">Warning</div>
                    <div id="side-menu-subtitle-warning" className="subtitle">Alarms</div>
                </div>
                <div id="warning-alarm-quantity" className="value-area">{props.Warning}</div>
            </div>

            <div
                id="minor-row"
                className={`menu-row minor ${props.active.minor ? 'row-selected' : ''}`}
                onClick={props.changeStatus.bind(this, 'minor')}
            >
                <div id="minor-color-bar" className="color-bar bg-minor" />
                <div id="minor-text-area" className="text-area">
                    <div id="side-menu-title-minor" className="title minor">Minor</div>
                    <div id="side-menu-subtitle-minor" className="subtitle">Alarms</div>
                </div>
                <div id="minor-alarm-quantity" className="value-area">{props.Minor}</div>
            </div>
            <div
                id="major-row"
                className={`menu-row major ${props.active.major ? 'row-selected' : ''}`}
                onClick={props.changeStatus.bind(this, 'major')}
            >
                <div id="major-color-bar" className="color-bar bg-major" />
                <div id="major-text-area" className="text-area">
                    <div id="side-menu-title-major" className="title major">Major</div>
                    <div id="side-menu-subtitle-major" className="subtitle">Alarms</div>
                </div>
                <div id="major-alarm-quantity" className="value-area">{props.Major}</div>
            </div>
            <div
                id="critical-row"
                className={`menu-row critical ${props.active.critical ? 'row-selected' : ''}`}
                onClick={props.changeStatus.bind(this, 'critical')}
            >
                <div id="critical-color-bar" className="color-bar bg-critical" />
                <div id="critical-text-area" className="text-area">
                    <div id="side-menu-title-critical" className="title critical">Critical</div>
                    <div id="side-menu-subtitle-critical" className="subtitle">Alarms</div>
                </div>
                <div id="critical-alarm-quantity" className="value-area">{props.Critical}</div>
            </div>
        </div>
    );
}

function AlarmRow(props) {
    const type = props.severity.toLowerCase();
    return (
        <div className="alarm-row">
            <div title={props.severity} id="alarm-severity-icon" className="severity-icon">
                <img src={`images/alarm/${type}.png`} />
            </div>
            <div id="alarm-error-type" className="error-type">
                <div id="alarm-error-domain" className={`domain-error ${type}`}>
                    {props.domain}
                </div>
                <div id="alarm-error-reason" className="error-description" title={props.additionalData.reason}>
                    {props.additionalData.reason}
                </div>
            </div>
            <div id="alarm-error-module" className="error-module">
                <div id="alarm-error-module-name" className="module" title={props.primarySubject.module_name}>
                    {props.primarySubject.module_name}
                </div>
                <div id="alarm-error-module-service" className="service">
                    Service
                </div>
            </div>
            <div id="alarm-error-time" className="error-time">
                <div id="alarm-error-time-field" className="time">
                    {util.iso_to_date(props.appearance)}
                </div>
                <div id="alarm-error-time-appearance" className="appearance">
                    Appearance Time
                </div>
            </div>
        </div>
    );
}

class AlarmsCurrent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            active: {
                warning: true,
                minor: true,
                major: true,
                critical: true,
            },
            filteredList: [],
            firstTimeLoad: true,
        };

        this.handleChangeStatus = this.handleChangeStatus.bind(this);
        this.filterResults = this.filterResults.bind(this);
    }

    filterResults() {
        const severityList = [];

        this.state.active.warning ? severityList.push('warning') : '';
        this.state.active.minor ? severityList.push('minor') : '';
        this.state.active.major ? severityList.push('major') : '';
        this.state.active.critical ? severityList.push('critical') : '';

        const result = this.props.currentAlarms.filter(f => severityList.includes(f.severity.toLowerCase()));
        this.setState({ filteredList: result, firstTimeLoad: false });
    }

    handleChangeStatus(status) {
        const tmp = this.state;
        tmp.active[status] = !tmp.active[status];
        this.setState(tmp);
        this.filterResults();
    }

    componentDidUpdate() {
        if (this.state.firstTimeLoad && !AlarmStore.getState().loading) {
            this.filterResults();
        }
    }

    componentWillUnmount() {
        AlarmAction.alarmsLoad();
    }


    render() {
        if (AlarmStore.getState().loading) {
            return (<Loading />);
        }
        return (
            <div className="full-content-space" id="current-alarm-page">
                <SideMenu {...this.props.metaData} active={this.state.active} changeStatus={this.handleChangeStatus} />
                <div id="alarm-content-area" className="content-area">
                    <AlarmListHeader quantity={this.state.filteredList.length} />
                    <AlarmList filteredList={this.state.filteredList} />
                </div>
            </div>
        );
    }
}

export { AlarmsCurrent };
