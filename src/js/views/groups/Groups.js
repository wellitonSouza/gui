import React, { Component } from 'react';
import AltContainer from 'alt-container';
import TextTruncate from 'react-text-truncate';
import { translate, Trans } from 'react-i18next';
import GroupStore from '../../stores/GroupStore';
import GroupActions from '../../actions/GroupActions';
import GroupPermissionActions from '../../actions/GroupPermissionActions';
import SideBarRight from '../../components/SideBar';
import { NewPageHeader } from '../../containers/full/PageHeader';
import { DojotBtnLink } from '../../components/DojotButton';
import toaster from '../../comms/util/materialize';
import { RemoveModal } from '../../components/Modal';

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

function InputCheckbox(params) {
    const { handleChangeCheckbox } = params;
    return (
        <span>
            <input
                name={params.name}
                id={params.name}
                onChange={handleChangeCheckbox}
                value={params.name}
                checked={!!params.checked}
                type="checkbox"
            />
            <label htmlFor={params.name}>{params.label}</label>
        </span>
    );
}

function InputText(params) {
    return (
        <div className={`input-field ${params.class ? params.class : ''}`}>
            <label
                htmlFor={params.name}
                data-error={params.errorMessage ? params.errorMessage : ''}
                className="active"
            >
                {params.label}
            </label>
            <input
                value={params.value}
                name={params.name}
                onChange={params.onChange ? params.onChange : null}
                maxLength={params.maxLength ? params.maxLength : 40}
                placeholder={params.placeHolder ? params.placeHolder : ''}
                type="text"
            />
        </div>
    );
}

function TableGroupsPermiss(params) {
    const { handleChangeCheckbox, permissionsForm } = params;

    return (
        <table className="striped centered">
            <thead>
            <tr>
                <th>Feature</th>
                <th>Modifier</th>
                <th>Viewer</th>
            </tr>
            </thead>
            <tbody>
            {Object.keys(permissionsForm)
                .map(action => (
                    <tr>
                        <td>
                            {action}
                        </td>
                        {
                            Object.keys(permissionsForm[action])
                                .map(operation => (
                                    <td>
                                        <InputCheckbox
                                            label=""
                                            placeHolder=""
                                            name={`${action}.${operation}`}
                                            checked={permissionsForm[action][operation]}
                                            handleChangeCheckbox={handleChangeCheckbox}
                                        />
                                    </td>
                                ))

                        }
                    </tr>
                ))
            }
            </tbody>
        </table>
    );
}

function Form(params) {
    const {
        handleCharge,
        data,
        handleChangeCheckbox,
        permissionsForm,
    } = params;
    return (
        <form action="#">
            <InputText
                label={<Trans i18nKey="groups.form.input.groupname.label"/>}
                name="name"
                maxLength={30}
                onChange={handleCharge}
                value={data.name}
                errorMessage={<Trans i18nKey="groups.form.input.groupname.error"/>}
            />
            <InputText
                label={<Trans i18nKey="groups.form.input.groupdescription.label"/>}
                name="description"
                maxLength={254}
                onChange={handleCharge}
                value={data.description}
            />
            <TableGroupsPermiss
                permissionsForm={permissionsForm}
                handleChangeCheckbox={handleChangeCheckbox}
            />
        </form>
    );
}

class Groups extends Component {
    constructor(props) {
        super(props);

        this.state = {
            showSideBar: false,
            showDeleteModal: false,
            groupsForm: {
                id: '',
                name: '',
                description: '',
            },
            permissionsForm: {
                devices: {
                    modifier: true,
                    viewer: true,
                },
                alarms: {
                    modifier: true,
                    viewer: true,
                },
            },
            edit: false,
        };

        this.newGroup = this.newGroup.bind(this);
        this.toggleSideBar = this.toggleSideBar.bind(this);
        this.hideSideBar = this.hideSideBar.bind(this);
        this.showSideBar = this.showSideBar.bind(this);
        this.handleInput = this.handleInput.bind(this);
        this.cleangroupsForm = this.cleangroupsForm.bind(this);
        this.discard = this.discard.bind(this);
        this.save = this.save.bind(this);
        this.delete = this.delete.bind(this);
        this.handleModalDelete = this.handleModalDelete.bind(this);
        this.handleUpdate = this.handleUpdate.bind(this);
        this.handleCheckBox = this.handleCheckBox.bind(this);
    }

    componentDidMount() {
        GroupActions.fetchGroups.defer();
        GroupPermissionActions.loadSystemPermissions.defer();
    }

    componentWillUnmount() {

    }

    // TODO
    checkAlphaNumber(string) {
        const regex = /^([ \u00c0-\u01ffa-zA-Z'\-])+$/;
        return !regex.test(string);
    }

    cleangroupsForm() {
        this.setState(prevState => ({
            ...prevState,
            groupsForm: {
                id: '',
                name: '',
                description: '',
            },
            edit: false,
        }));
    }

    newGroup() {
        this.cleangroupsForm();
        this.showSideBar();
    }

    componentDidCatch(error, info) {
        console.log('componentDidCatch 1', error);
        console.log('componentDidCatch 2', info);
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
    }

    showSideBar() {
        this.setState({
            showSideBar: true,
        });
    }

    handleInput(e) {
        const { name, value } = e.target;
        this.setState(prevState => ({
            ...prevState,
            groupsForm: {
                ...prevState.groupsForm,
                [name]: value,
            },
        }));
    }

    handleCheckBox(e) {
        const { name } = e.target;
        const [action, typePermission] = name.split('.');
        this.setState(prevState => ({
            permissionsForm: {
                ...prevState.permissionsForm,
                [action]: {
                    ...prevState.permissionsForm[action],
                    [typePermission]: !prevState.permissionsForm[action][typePermission],
                },
            },
        }));
    }

    discard() {
        this.hideSideBar();
        this.cleangroupsForm();
    }

    formDataValidate() {
        const { groupsForm } = this.state;

        if ((groupsForm.name).trim().length <= 0) {
            toaster.warning('empty Name');
            return false;
        }

        if (this.checkAlphaNumber(groupsForm.name)) {
            toaster.warning('Invalid name.');
            return false;
        }

        if ((groupsForm.description).trim().length <= 0) {
            toaster.warning('empty des');
            return false;
        }

        return true;
    }

    save() {
        if (this.formDataValidate()) {
            this.hideSideBar();
            const { groupsForm, permissionsForm } = this.state;
            GroupActions.triggerSave(
                groupsForm,
                () => {
                    toaster.success('Group created.');
                    this.hideSideBar();
                },
                (group) => {
                    console.log(group);
                },
            );

            GroupActions.triggerSaveGroupPermissions(
                permissionsForm, groupsForm.id,
                () => {
                    toaster.success('Group created.');
                    this.hideSideBar();
                },
                (group) => {
                    console.log(group);
                },
            );


            this.cleangroupsForm();
            GroupActions.fetchGroups.defer();
        }
    }


    handleModalDelete(status) {
        this.setState(prevState => ({
            ...prevState,
            showDeleteModal: status,
        }));
    }


    handleUpdate(e) {
        e.preventDefault();
        this.showSideBar();
        this.cleangroupsForm();
        const { id: groupId } = e.currentTarget;
        const group = GroupActions.getGroupById(groupId);
        //const groupPermission =
        GroupPermissionActions.fetchPermissionsForGroups(group.name);
        console.log('group', group);

        this.setState(prevState => ({
            ...prevState,
            groupsForm: {
                id: group.id,
                name: group.name,
                description: group.description,
            },
            edit: true,
            permissionsForm: {
                groupPermission,
            },
        }));
    }

    delete() {
        const { groupsForm } = this.state;
        GroupActions.triggerRemoval(
            groupsForm.id,
            () => {
                toaster.success('Group Del.');
                this.hideSideBar();
            },
            (group) => {
                console.log(group);
            },
        );

        this.cleangroupsForm();
        this.handleModalDelete(false);
        GroupActions.fetchGroups.defer();
        this.hideSideBar();
    }

    render() {
        const {
            showSideBar, groupsForm, edit, showDeleteModal, permissionsForm,
        } = this.state;

        const buttonsFooter = [
            {
                label: <Trans i18nKey="groups.form.btn.discard.label"/>,
                click: this.discard,
                type: 'default',
            },
            {
                label: <Trans i18nKey="groups.form.btn.save.label"/>,
                click: this.save,
                type: 'primary',
            },
        ];

        if (edit) {
            buttonsFooter.push({
                label: <Trans i18nKey="groups.form.btn.remove.label"/>,
                click: this.handleModalDelete,
                type: 'secondary',
            });
        }
        return (
            <div id="groups-wrapper">
                <AltContainer store={GroupStore}>
                    <NewPageHeader title={<Trans i18nKey="groups.title"/>} icon="groups">
                        <OperationsHeader newGroup={this.newGroup}/>
                    </NewPageHeader>
                    <SideBarRight
                        title={edit ? <Trans i18nKey="groups.form.title.edit"/>
                            : <Trans i18nKey="groups.form.title.new"/>}
                        content={(
                            <Form
                                data={groupsForm}
                                permissionsForm={permissionsForm}
                                handleCharge={this.handleInput}
                                handleChangeCheckbox={this.handleCheckBox}
                            />
                        )}
                        visible={showSideBar}
                        buttonsFooter={buttonsFooter}
                    />
                    <GroupList handleUpdate={this.handleUpdate}/>
                    {showDeleteModal ? (
                        <RemoveModal
                            name="group"
                            remove={this.delete}
                            openModal={this.handleModalDelete}
                        />) : <div/>}
                </AltContainer>
            </div>
        );
    }
}

export default translate()(Groups);
