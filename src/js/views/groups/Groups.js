import React, { Component } from 'react';
import AltContainer from 'alt-container';
import TextTruncate from 'react-text-truncate';
import { translate, Trans } from 'react-i18next';
import PropTypes from 'prop-types';
import GroupStore from '../../stores/GroupStore';
import GroupActions from '../../actions/GroupActions';
import GroupPermissionActions from '../../actions/GroupPermissionActions';
import { NewPageHeader } from '../../containers/full/PageHeader';
import { DojotBtnLink } from '../../components/DojotButton';
import GroupsSideBar from './GroupsSideBar';
import toaster from '../../comms/util/materialize';
import Can from '../../components/permissions/Can';

function GroupCard(obj) {
    return (
        <div
            className="card-size card-hover lst-entry-wrapper z-depth-2 fullHeight"
            id={obj.group.name}
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
                        key={obj.name}
                        onclick={param.handleUpdate}
                    />
                ))}
            </div>);
    }
}

function OperationsHeader(param) {
    return (
        <div className="col s12 pull-right pt10">
            <Can do="modifier" on="flows">
                <DojotBtnLink
                    responsive="true"
                    onClick={param.newGroup}
                    label={<Trans i18nKey="groups.btn.new.text" />}
                    alt="Create a new group"
                    icon="fa fa-plus"
                    className="w130px"
                />
            </Can>
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
        GroupPermissionActions.fetchGroupPermissions(null);
        GroupPermissionActions.fetchSystemPermissions();
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
        GroupPermissionActions.fetchSystemPermissions();
        GroupActions.fetchGroups.defer();
    }

    showSideBar() {
        this.setState({
            showSideBar: true,
        });
    }

    newGroup() {
        GroupActions.getGroupByName(null);
        GroupPermissionActions.fetchGroupPermissions();
        this.setState({
            showSideBar: true,
            edit: false,
        });
    }

    handleUpdate(e) {
        e.preventDefault();
        const { t } = this.props;
        const { id: groupClick } = e.currentTarget;
        if (groupClick === 'admin') {
            toaster.warning(t('groups.alerts.admin_not_remove'));
        } else {
            GroupActions.getGroupByName(groupClick);
            GroupPermissionActions.fetchGroupPermissions(groupClick);
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

Groups.propTypes = {
    t: PropTypes.func.isRequired,
};
export default translate()(Groups);
