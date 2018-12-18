import React, { Component } from 'react';
import AltContainer from 'alt-container';
import TextTruncate from 'react-text-truncate';
import { translate, Trans } from 'react-i18next';
import GroupStore from '../../stores/GroupStore';
import GroupActions from '../../actions/GroupActions';
import GroupPermissionActions from '../../actions/GroupPermissionActions';
import { NewPageHeader } from '../../containers/full/PageHeader';
import { DojotBtnLink } from '../../components/DojotButton';
import GroupsSideBar from './GroupsSideBar';

function GroupCard(obj) {
    return (
        <div
            className="card-size card-hover lst-entry-wrapper z-depth-2 fullHeight"
            id={obj.group.id}
            onClick={obj.onclick}
            group="button"
        >
            <div className="lst-entry-title col s12 ">
                <img className="title-icon" src="images/groups-icon.png" alt="Group"/>
                <div className="title-text truncate" title={obj.group.name}>
                    <span className="text">
                        {obj.group.name}
                    </span>
                </div>
            </div>
            <div className="attr-list">
                <div className="attr-area light-background">
                    <div className="attr-row">
                        <div className="icon">
                            <img src="images/info-icon.png" alt={obj.group.description}/>
                        </div>
                        <div className="user-card attr-content" title={obj.group.description}>
                            <TextTruncate
                                line={2}
                                truncateText="…"
                                text={obj.group.description}
                                containerClassName="description-text"
                            />
                            <div className="subtitle"><Trans i18nKey="groups.description"/></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
}

function GroupList(param) {
    if (param.groups) {
        return (
            <div className="fill">
                {param.groups.map(obj => (
                    <GroupCard
                        group={obj}
                        key={obj.id}
                        onclick={param.handleUpdate}
                    />
                ))}
            </div>);
    }
}

function OperationsHeader(param) {
    return (
        <div className="col s12 pull-right pt10">
            <DojotBtnLink
                responsive="true"
                onClick={param.newGroup}
                label={<Trans i18nKey="groups.btn.new.text"/>}
                alt="Create a new group"
                icon="fa fa-plus"
                className="w130px"
            />
        </div>
    );
}

class Groups extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showSideBar: false,
        };

        this.newGroup = this.newGroup.bind(this);
        this.toggleSideBar = this.toggleSideBar.bind(this);
        this.hideSideBar = this.hideSideBar.bind(this);
        this.showSideBar = this.showSideBar.bind(this);
        this.handleUpdate = this.handleUpdate.bind(this);
    }


    componentWillMount() {
        //console.log('Component WILL MOUNT!');

    }

    componentDidMount() {
        //console.log('Component DID MOUNT!');
        GroupActions.fetchGroups.defer();
        GroupPermissionActions.fetchPermissionsForGroups(null);
        //GroupPermissionActions.loadSystemPermissions.defer();
    }

    componentDidCatch(error, info) {
        //console.log('componentDidCatch 1', error);
        //console.log('componentDidCatch 1', info);
    }

    toggleSideBar() {
        this.setState(prevState => ({
            showSideBar: !prevState.showSideBar,
        }));
    }

    hideSideBar() {
        this.setState({
            showSideBar: false,
        });
        GroupActions.fetchGroups.defer();
    }

    showSideBar() {
        this.setState({
            showSideBar: true,
        });
    }

    newGroup() {
        GroupActions.getGroupById(null);
        GroupPermissionActions.fetchPermissionsForGroups(null);
        this.setState(prevState => ({
            showSideBar: true,
        }));
    }

    handleUpdate(e) {
        e.preventDefault();
        const { id: groupIdClick } = e.currentTarget;
        GroupActions.getGroupById(groupIdClick);
        GroupPermissionActions.fetchPermissionsForGroups(groupIdClick);
        console.log(groupIdClick);
        this.setState(prevState => ({
            showSideBar: true,
        }));
    }

    render() {
        console.log('render groups');
        const {
            showSideBar,
        } = this.state;

        return (
            <div id="groups-wrapper">
                <AltContainer store={GroupStore}>
                    <NewPageHeader title={<Trans i18nKey="groups.title"/>} icon="groups">
                        <OperationsHeader newGroup={this.newGroup}/>
                    </NewPageHeader>
                    <GroupList handleUpdate={this.handleUpdate}/>
                    {showSideBar ? (
                        <GroupsSideBar
                            handleShowSideBar={this.showSideBar}
                            handleHideSideBar={this.hideSideBar}
                        />
                    ) : <div/>}
                </AltContainer>
            </div>
        );
    }
}

export default translate()(Groups);
