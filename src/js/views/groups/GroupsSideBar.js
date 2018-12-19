import React, { Component } from 'react';
import { translate, Trans } from 'react-i18next';
import GroupActions from '../../actions/GroupActions';
import GroupPermissionActions from '../../actions/GroupPermissionActions';
import SideBarRight from '../../components/SideBar';
import toaster from '../../comms/util/materialize';
import { RemoveModal } from '../../components/Modal';
import { InputCheckbox, InputText } from '../../components/DojotIn';

function TableGroupsPermissions(params) {
    const { handleChangeCheckbox, permissionsForm } = params;

    if (!permissionsForm) {
        return (<div/>);
    }

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
                .map(item => (
                    <tr>
                        <td>
                            {item}
                        </td>
                        <td>
                            <InputCheckbox
                                label=""
                                placeHolder=""
                                name={`${item}.modifier`}
                                checked={permissionsForm[item].modifier}
                                handleChangeCheckbox={handleChangeCheckbox}
                            />
                        </td>
                        <td>
                            <InputCheckbox
                                label=""
                                placeHolder=""
                                name={`${item}.viewer`}
                                checked={permissionsForm[item].viewer}
                                handleChangeCheckbox={handleChangeCheckbox}
                            />
                        </td>
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
        dataGroup,
        handleChangeCheckbox,
        dataPermissions,
    } = params;

    if (!dataGroup) {
        return (<div/>);
    }

    return (
        <form action="#">
            <InputText
                label={<Trans i18nKey="groups.form.input.groupname.label"/>}
                name="name"
                maxLength={30}
                onChange={handleCharge}
                value={dataGroup.name ? dataGroup.name : ''}
                errorMessage={<Trans i18nKey="groups.form.input.groupname.error"/>}
            />
            <InputText
                label={<Trans i18nKey="groups.form.input.groupdescription.label"/>}
                name="description"
                maxLength={254}
                onChange={handleCharge}
                value={dataGroup.description ? dataGroup.description : ''}
            />
            <TableGroupsPermissions
                permissionsForm={dataPermissions}
                handleChangeCheckbox={handleChangeCheckbox}
            />
        </form>
    );
}

class GroupsSideBar extends Component {
    constructor(props) {
        super(props);

        this.state = {
            showDeleteModal: false,
            group: undefined,
            grouppermissions: undefined,
            permissionsForm: {},
            edit: false,
        };

        this.handleInput = this.handleInput.bind(this);
        this.discard = this.discard.bind(this);
        this.save = this.save.bind(this);
        this.delete = this.delete.bind(this);
        this.handleModalDelete = this.handleModalDelete.bind(this);
        this.handleCheckBox = this.handleCheckBox.bind(this);
    }

    componentDidUpdate(prevProps, prevState) {
        if ((this.props.grouppermissions && !this.state.grouppermissions)
            || prevProps.grouppermissions !== this.props.grouppermissions) {
            this.setState({ grouppermissions: this.props.grouppermissions });
        }

        if ((this.props.group && !this.state.group) || prevProps.group !== this.props.group) {
            this.setState({ group: this.props.group });
        }
        if ((this.props.edit && !this.state.edit) || prevProps.edit !== this.props.edit) {
            this.setState({ edit: this.props.edit });
        }
    }

    componentWillUnmount() {
    }

    // TODO
    checkAlphaNumber(string) {
        const regex = /^([ \u00c0-\u01ffa-zA-Z'\-])+$/;
        return !regex.test(string);
    }

    componentDidCatch(error, info) {
        console.log('componentDidCatch 2', error);
        console.log('componentDidCatch 2', info);
    }

    handleInput(e) {
        const { name, value } = e.target;
        this.setState(prevState => ({
            ...prevState,
            group: {
                ...prevState.group,
                [name]: value,
            },
        }));
    }

    handleCheckBox(e) {
        const { name } = e.target;
        const [action, typePermission] = name.split('.');
        this.setState(prevState => ({
            grouppermissions: {
                ...prevState.grouppermissions,
                [action]: {
                    ...prevState.grouppermissions[action],
                    [typePermission]: !prevState.grouppermissions[action][typePermission],
                },
            },
        }));
    }

    hideSideBar() {
        this.props.handleHideSideBar();
    }

    showSideBar() {
        this.props.handleShowSideBar();
    }

    discard() {
        this.hideSideBar();
        this.cleanGroupsForm();
    }

    formDataValidate() {
        const { group } = this.state;
        if ((group.name).trim().length <= 0) {
            toaster.warning('empty Name');
            return false;
        }

        if (this.checkAlphaNumber(group.name)) {
            toaster.warning('Invalid name.');
            return false;
        }

        if ((group.description).trim().length <= 0) {
            toaster.warning('empty des');
            return false;
        }
        return true;
    }

    save() {
        if (this.formDataValidate()) {
            const { group, grouppermissions, edit } = this.state;
            const err = null;
            const e = null;
            GroupActions.triggerSave(
                group,
                (response) => {
                    GroupPermissionActions.triggerSaveGroupPermissions(
                        grouppermissions, response.id, err, e, edit,
                        () => {
                            toaster.success('Permission Associate.');
                            // this.hideSideBar();
                        }, (group) => {
                            console.log(group);
                        },
                    );
                    this.hideSideBar();
                },
                (group) => {
                    console.log(group);
                },
            );
            GroupActions.fetchGroups.defer();
        }
    }


    handleModalDelete(status) {
        this.setState(prevState => ({
            ...prevState,
            showDeleteModal: status,
        }));
    }


    delete() {
        const { group } = this.state;
        GroupActions.triggerRemoval(
            group.id,
            () => {
                toaster.success('Group Removed');
                this.hideSideBar();
            },
            (group) => {
                console.log(group);
            },
        );

        this.handleModalDelete(false);
        this.hideSideBar();
    }

    render() {
        console.log('render groupssideBar', this.props, this.state);
        const {
            group, edit, showDeleteModal, grouppermissions,
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
            <div>
                <SideBarRight
                    title={edit ? <Trans i18nKey="groups.form.title.edit"/>
                        : <Trans i18nKey="groups.form.title.new"/>}
                    content={(
                        <Form
                            dataGroup={group}
                            dataPermissions={grouppermissions}
                            handleCharge={this.handleInput}
                            handleChangeCheckbox={this.handleCheckBox}
                        />
                    )}
                    visible
                    buttonsFooter={buttonsFooter}
                />
                {showDeleteModal ? (
                    <RemoveModal
                        name="group"
                        remove={this.delete}
                        openModal={this.handleModalDelete}
                    />) : <div/>}
            </div>
        );
    }
}

export default translate()(GroupsSideBar);
