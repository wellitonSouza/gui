import React, { Component } from 'react';
import AltContainer from 'alt-container';
import TextTruncate from 'react-text-truncate';
import { translate, Trans } from 'react-i18next';
import RoleStore from '../../stores/RoleStore';
import RoleActions from '../../actions/RoleActions';
import SideBarRight from './SideBar';
import { NewPageHeader } from '../../containers/full/PageHeader';
import { DojotBtnLink } from '../../components/DojotButton';
import toaster from '../../comms/util/materialize';
import { RemoveModal } from '../../components/Modal';

function RoleCard(obj) {
    return (
        <div className="card-size card-hover lst-entry-wrapper z-depth-2 fullHeight"
             id={obj.group.id}
             onClick={obj.onclick}
             role="button">
            <div className="lst-entry-title col s12 ">
                <img className="title-icon" src="images/roles-icon.png" alt="Role"/>
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
                            <div className="subtitle"><Trans i18nKey="roles.description"/></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
}

function RoleList(param) {
    if (param.groups) {
        return (
            <div className="fill">
                {param.groups.map(obj => <RoleCard group={obj} key={obj.id}
                                                   onclick={param.handleUpdate}/>)}
            </div>);
    }
}

function OperationsHeader(param) {
    return (
        <div className="col s12 pull-right pt10">
            <DojotBtnLink
                responsive="true"
                onClick={param.newGroup}
                label={<Trans i18nKey="roles.btn.new.text"/>}
                alt="Create a new role"
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

function TableRolesPermiss(params) {

    const { handleChangeCheckbox, permissionsForm } = params;

    return (
        <table className="striped">
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
                label={<Trans i18nKey="roles.form.input.rolename.label"/>}
                name="name"
                maxLength={30}
                onChange={handleCharge}
                value={data.name}
                errorMessage={<Trans i18nKey="roles.form.input.rolename.error"/>}
            />
            <InputText
                label={<Trans i18nKey="roles.form.input.roledescription.label"/>}
                name="description"
                maxLength={254}
                onChange={handleCharge}
                value={data.description}
            />
            <TableRolesPermiss
                permissionsForm={permissionsForm}
                handleChangeCheckbox={handleChangeCheckbox}/>
        </form>
    );
}

class Roles extends Component {
    constructor(props) {
        super(props);

        this.state = {
            showSideBar: false,
            showDeleteModal: false,
            dataForm: {
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
        this.cleanDataForm = this.cleanDataForm.bind(this);
        this.discard = this.discard.bind(this);
        this.save = this.save.bind(this);
        this.delete = this.delete.bind(this);
        this.handleModalDelete = this.handleModalDelete.bind(this);
        this.handleUpdate = this.handleUpdate.bind(this);
        this.handleCheckBox = this.handleCheckBox.bind(this);
    }

    componentDidMount() {
        RoleActions.fetchGroups.defer();
    }

    componentWillUnmount() {

    }

    //TODO
    checkAlphaNumber(string) {
        const regex = /^([ \u00c0-\u01ffa-zA-Z'\-])+$/;
        return !regex.test(string);
    }

    cleanDataForm() {
        this.setState(prevState => ({
            ...prevState,
            dataForm: {
                id: '',
                name: '',
                description: '',
            },
            edit: false,
        }));
    }

    newGroup() {
        this.cleanDataForm();
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
            dataForm: {
                ...prevState.dataForm,
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
        this.cleanDataForm();
    }

    formDataValidate() {
        const { dataForm } = this.state;

        if ((dataForm.name).trim().length <= 0) {
            toaster.warning('empty Name');
            return false;
        }

        if (this.checkAlphaNumber(dataForm.name)) {
            toaster.warning('Invalid name.');
            return false;
        }

        if ((dataForm.description).trim().length <= 0) {
            toaster.warning('empty des');
            return false;
        }

        return true;
    }

    save() {
        if (this.formDataValidate()) {
            this.hideSideBar();
            const { dataForm } = this.state;
            RoleActions.triggerSave(
                dataForm,
                () => {
                    toaster.success('Group created.');
                    this.hideSideBar();
                },
                (group) => {
                    console.log(group);
                },
            );

            this.cleanDataForm();
            RoleActions.fetchGroups.defer();
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
        this.cleanDataForm();
        const { id } = e.currentTarget;
        const group = RoleActions.getGroupById(id);

        this.setState(prevState => ({
            ...prevState,
            dataForm: {
                id: group.id,
                name: group.name,
                description: group.description,
            },
            edit: true,
        }));
    }

    delete() {
        const { dataForm } = this.state;
        RoleActions.triggerRemoval(
            dataForm.id,
            () => {
                toaster.success('Group Del.');
                this.hideSideBar();
            },
            (group) => {
                console.log(group);
            },
        );

        this.cleanDataForm();
        this.handleModalDelete(false);
        RoleActions.fetchGroups.defer();
        this.hideSideBar();
    }

    render() {
        const {
            showSideBar, dataForm, edit, showDeleteModal, permissionsForm
        } = this.state;

        const buttonsFooter = [
            {
                label: <Trans i18nKey="roles.form.btn.discard.label"/>,
                click: this.discard,
                type: 'default',
            },
            {
                label: <Trans i18nKey="roles.form.btn.save.label"/>,
                click: this.save,
                type: 'primary',
            },
        ];

        if (edit) {
            buttonsFooter.push({
                label: <Trans i18nKey="roles.form.btn.remove.label"/>,
                click: this.handleModalDelete,
                type: 'secondary',
            });
        }
        return (
            <div id="roles-wrapper">
                <AltContainer store={RoleStore}>
                    <NewPageHeader title={<Trans i18nKey="roles.title"/>} icon="roles">
                        <OperationsHeader newGroup={this.newGroup}/>
                    </NewPageHeader>
                    <SideBarRight
                        title={edit ? <Trans i18nKey="roles.form.title.edit"/> :
                            <Trans i18nKey="roles.form.title.new"/>}
                        content={(
                            <Form
                                data={dataForm}
                                permissionsForm={permissionsForm}
                                handleCharge={this.handleInput}
                                handleChangeCheckbox={this.handleCheckBox}
                            />
                        )}
                        visible={showSideBar}
                        buttonsFooter={buttonsFooter}
                    />
                    <RoleList handleUpdate={this.handleUpdate}/>
                    {showDeleteModal ? (
                        <RemoveModal
                            name="role"
                            remove={this.delete}
                            openModal={this.handleModalDelete}
                        />) : <div/>}
                </AltContainer>
            </div>
        );
    }
}

export default translate()(Roles);
