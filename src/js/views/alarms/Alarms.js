import React, {Component} from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import {NewPageHeader} from "../../containers/full/PageHeader";
import AlarmStore from '../../stores/AlarmsStore'
import AlarmAction from '../../actions/AlarmsActions'
import AltContainer from 'alt-container';
import {AlarmsCurrent} from './AlarmsCurrent';
import {AlarmsHistory} from './AlarmsHistory';
import LoginStore from "../../stores/LoginStore";
import AutheticationFailed from "../../components/AuthenticationFailed";


class AlarmsPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            tab: 'current'
        };
        this.handleChangeTab = this.handleChangeTab.bind(this);
    }

    handleChangeTab(status) {
        let tmpState = this.state;
        tmpState.tab = status;
        this.setState(tmpState);

        status === 'current' ? AlarmAction.fetchCurrentAlarms.defer() : AlarmAction.fetchAlarmsHistory.defer();

    }

    render() {
        return (
            <div id={'alarm-main-area'} className={'total-area'}>
                <AlarmTabs changeTab={this.handleChangeTab} {...this.state}/>
                {this.state.tab === 'current' ?
                    <AlarmsCurrent  {...this.props}/> :
                    <AlarmsHistory  {...this.props}/>
                }
            </div>
        )
    }
}

function AlarmTabs(props) {
    return (
        <div id={'tabs-area'} className={'alarms-tabs-area'}>
            <div id={'tab-current'} className={'tab-area ' + (props.tab === 'current' ? 'selected' : '')}
                 onClick={props.changeTab.bind(this, 'current')}>
                <div id={'current-tab'} className={'text-area'}>Current</div>
            </div>
            <div id={'tab-current'} className={'tab-area ' + (props.tab === 'history' ? 'selected' : '')}
                 onClick={props.changeTab.bind(this, 'history')}>
                <div id={'history-tab'} className={'text-area'}>History</div>
            </div>
        </div>
    )
}


class Alarms extends Component {

    constructor(props) {
        super(props);
    }

    componentWillMount() {
        AlarmAction.fetchCurrentAlarms.defer();
    }

    render() {
        if (LoginStore.getState().user.profile === "admin") {
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
                        <AlarmsPage />
                    </AltContainer>
                </ReactCSSTransitionGroup>
            );
        } else {
            return (
                <span id="userMain" className="flex-wrapper">
                    <AutheticationFailed />
                </span>
            );
        }
    }
}

export {Alarms};