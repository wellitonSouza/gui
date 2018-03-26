import React, {Component} from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import {NewPageHeader} from "../../containers/full/PageHeader";
import AlarmStore from '../../stores/AlarmsStore'
import AlarmAction from '../../actions/AlarmsActions'
import AltContainer from 'alt-container';
import util from '../../comms/util/util'


class AlarmsPage extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        // console.log(this.props);
        return (
            <div id={'alarm-main-area'} className={'total-area'}>

                <div id={'alarm-list-header'} className={'alarm-header'}>
                    <div>Showing&nbsp; <span>{this.props.currentAlarms.length}</span> &nbsp;Alarms</div>
                </div>

                <div id={'alarm-list-area'} className={'list-area'}>
                    {this.props.currentAlarms.map((list) =>
                        <AlarmRow {...list}/>
                    )}
                </div>
            </div>
        )
    }
}

function AlarmRow(props) {
    let type = props.severity.toLowerCase();
    console.log(props);
    return (
        <div className={'alarm-row'}>
            <div title={props.severity} id={'alarm-severity-icon'} className={'severity-icon'}>
                <img src={'images/alarm/' + (type) +'.png'}/>
            </div>
            <div id={'alarm-error-type'} className={'error-type'}>
                <div id={''} className={'domain-error ' + (type)}>
                    {props.domain}
                </div>
                <div id={''} className={'error-description'}>
                    {props.additionalData.reason}
                </div>
            </div>
            <div id={'alarm-error-module'} className={'error-module'}>
                <div id={''} className={'module'}>
                    {props.primarySubject.module_name}
                </div>
                <div id={''} className={'service'}>
                    Service
                </div>
            </div>
            <div id={'alarm-error-time'} className={'error-time'}>
                <div id={''} className={'time'}>
                    {util.iso_to_date(props.appearance)}
                </div>
                <div id={''} className={'appearance'}>
                    Appearance Time
                </div>
            </div>
        </div>
    )
}


class Alarms extends Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        AlarmAction.fetchCurrentAlarms.defer();
        // console.log(AlarmStore)
    }

    render() {
        return (
            <ReactCSSTransitionGroup
                transitionName="first"
                transitionAppear={true}
                transitionAppearTimeout={100}
                transitionEnterTimeout={100}
                transitionLeaveTimeout={100}>
                <NewPageHeader title="Alarms" subtitle="Alarms" icon='alarm'>
                </NewPageHeader>
                <AltContainer store={AlarmStore}>
                    <AlarmsPage {...this.state} />
                </AltContainer>
            </ReactCSSTransitionGroup>
        );
    }
}

export {Alarms};