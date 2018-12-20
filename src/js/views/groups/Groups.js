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
import toaster from '../../comms/util/materialize';

function GroupCard(obj) {
    return (
        <div
            className="card-size card-hover lst-entry-wrapper z-depth-2 fullHeight"
            id={obj.group.id}
            onClick={obj.onclick}
            role="none"
            tabIndex={obj.group.id}
        >
            <div className="lst-entry-title col s12 ">
                <img className="title-icon" src="images/groups-icon.png" alt="Group" />
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
                            <img src="images/info-icon.png" alt={obj.group.description} />
                        </div>
                        <div className="user-card attr-content" title={obj.group.description}>
                            <TextTruncate
                                line={2}
                                truncateText="…"
                                text={obj.group.description}
                                containerClassName="description-text"
                            />
                            <div className="subtitle"><Trans i18nKey="groups.description" /></div>
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
                label={<Trans i18nKey="groups.btn.new.text" />}
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
            edit: false,
        };

        this.newGroup = this.newGroup.bind(this);
        this.toggleSideBar = this.toggleSideBar.bind(this);
        this.hideSideBar = this.hideSideBar.bind(this);
        this.showSideBar = this.showSideBar.bind(this);
        this.handleUpdate = this.handleUpdate.bind(this);
    }

    componentDidMount() {
        GroupActions.fetchGroups.defer();
        GroupPermissionActions.fetchPermissionsForGroups(null);
    }

    toggleSideBar() {
        this.setState(prevState => ({
            showSideBar: !prevState.showSideBar,
        }));
    }

    hideSideBar() {
        this.setState({
            showSideBar: false,
            edit: false,
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
        this.setState({
            showSideBar: true,
            edit: false,
        });
    }

    handleUpdate(e) {
        e.preventDefault();
        const { id: groupIdClick } = e.currentTarget;
        // this condition  will be change/removed
        if (groupIdClick === '1') {
            toaster.warning('This group can not be change');
        } else {
            GroupActions.getGroupById(groupIdClick);
            GroupPermissionActions.fetchPermissionsForGroups(groupIdClick);
            this.setState({
                showSideBar: true,
                edit: true,
            });
        }
    }

    render() {
        const {
            showSideBar,
            edit,
        } = this.state;

        return (
            <div id="groups-wrapper">
                <AltContainer store={GroupStore}>
                    <NewPageHeader title={<Trans i18nKey="groups.title" />} icon="groups">
                        <OperationsHeader newGroup={this.newGroup} />
                    </NewPageHeader>
                    <GroupList handleUpdate={this.handleUpdate} />
                    {showSideBar ? (
                        <GroupsSideBar
                            handleShowSideBar={this.showSideBar}
                            handleHideSideBar={this.hideSideBar}
                            edit={edit}
                        />
                    ) : <div />}
                </AltContainer>
            </div>
        );
    }
}

export default translate()(Groups);
