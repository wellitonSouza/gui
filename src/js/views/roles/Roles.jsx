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

//TODO - create a component
function RoleCard(obj) {
    return (
        <div className="card-size card-hover lst-entry-wrapper z-depth-2 fullHeight" id={obj.group.id} onClick={obj.onclick} role="button" >
            <div className="lst-entry-title col s12 ">
                <img className="title-icon" src="images/roles-icon.png" alt="Role" />
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
                            <div className="subtitle"><Trans i18nKey="roles.description" /></div>
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
                {param.groups.map(obj => <RoleCard group={obj} key={obj.id} onclick={param.handleUpdate} />)}
            </div>);
    }
}


function OperationsHeader(param) {
    return (
        <div className="col s12 pull-right pt10">
            <DojotBtnLink
                responsive="true"
                onClick={param.newGroup}
                label={<Trans i18nKey="roles.btn.new.text" />}
                alt="Create a new role"
                icon="fa fa-plus"
                className="w130px"
            />
        </div>

    );
}

function InputCheckbox(params) {
    return (
        <div className="col s12">
            <label htmlFor={params.name}>
                {params.label}
            </label>
            {params.options.map(option => (
                <input
                    name={option.name}
                    id={option.name}
                    onChange={option.onChange ? option.onChange : null}
                    value={option.value}
                    className="filled-in"
                    type="checkbox"
                />
/*                 <label key={option.name} htmlFor={option.name}>
                    {option.label}
                </label>  */
            ))}
        </div>
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


function Form(params) {

    const { handleCharge, data } = params;

    const options = [
        {
            label: 'Modifer',
            name: 'Modifer',
            alt: 'Modifer',
            value: 'full',
        },
        {
            label: 'Viewer',
            name: 'Viewer',
            alt: 'Viewer',
            value: 'partial',
        },
    ];
    return (
        <form action="#">
            <InputText
                label={<Trans i18nKey="roles.form.input.rolename.label" />}
                name="name"
                maxLength={30}
                onChange={handleCharge}
                value={data.name}
                errorMessage={<Trans i18nKey="roles.form.input.rolename.error" />}
            />
            <InputText
                label={<Trans i18nKey="roles.form.input.roledescription.label" />}
                name="description"
                maxLength={254}
                onChange={handleCharge}
                value={data.description}
            />
            {/*             <InputCheckbox
                label={<Trans i18nKey="roles.form.input.roledescription.label" />}
                placeHolder={<Trans i18nKey="roles.form.input.roledescription.label" />}
                name="permissions.alarms"
                options={options}
             onChange={handleCharge} 
                            value={data.roleDescription} 
            /> */}
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
    }

    componentDidMount() {
        RoleActions.fetchGroups.defer();
    }

    componentWillUnmount() {

    }

    //TODO
    checkAlphaNumber(string) {
        const regex = /^([a-z0-9_])+$/;
        return !regex.test(string);
    }

    cleanDataForm() {
        this.setState({
            dataForm: {
                id: '',
                name: '',
                description: '',
            },
            edit: false,
        });
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
        this.setState(prevState => ({ showSideBar: !prevState.showSideBar }));
    }

    hideSideBar() {
        this.setState({ showSideBar: false });
    }

    showSideBar() {
        this.setState({ showSideBar: true });
    }

    handleInput(e) {

        /**
         *     if re.match(r'^[a-zA-Z0-9]+$', group['name']) is None:
            raise HTTPRequestError(400,
            'Invalid group name, only alphanumeric allowed')

            disable save
         */
        const { name, value } = e.target;
        this.setState(prevState => ({
            dataForm: {
                ...prevState.dataForm, [name]: value,
            },
        }));
    }
    /* 
        handleCheckBox(e) {
    
            const newSelection = e.target.value;
            let newSelectionArray;
    
            if (this.state.newUser.skills.indexOf(newSelection) > -1) {
                newSelectionArray = this.state.newUser.skills.filter(s => s !== newSelection)
            } else {
                newSelectionArray = [...this.state.newUser.skills, newSelection];
            }
    
            this.setState(prevState => ({
                newUser:
                    { ...prevState.newUser, skills: newSelectionArray }
            })
            )
        }
     */

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
        this.setState({ showDeleteModal: status });
    }


    handleUpdate(e) {
        e.preventDefault();
        this.showSideBar();
        this.cleanDataForm();
        const { id } = e.currentTarget;
        const group = RoleActions.getGroupById(id);

        this.setState({
            dataForm: {
                id: group.id,
                name: group.name,
                description: group.description,
            },
            edit: true,
        });
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
            showSideBar, dataForm, edit, showDeleteModal,
        } = this.state;

        const buttonsFooter = [
            {
                label: <Trans i18nKey="roles.form.btn.discard.label" />,
                alt: <Trans i18nKey="roles.form.btn.discard.alt" />,
                click: this.discard,
                color: 'gray',
            },
            {
                label: <Trans i18nKey="roles.form.btn.save.label" />,
                alt: <Trans i18nKey="roles.form.btn.save.alt" />,
                click: this.save,
                color: 'blue',
            },
        ];

        if (edit) {
            buttonsFooter.push({
                label: <Trans i18nKey="roles.form.btn.remove.label" />,
                alt: <Trans i18nKey="roles.form.btn.remove.alt" />,
                click: this.handleModalDelete,
                color: 'red',
            });
        }
        return (
            <div id="roles-wrapper">
                <AltContainer store={RoleStore}>
                    <NewPageHeader title={<Trans i18nKey="roles.title" />} icon="roles">
                        <OperationsHeader newGroup={this.newGroup} />
                    </NewPageHeader>
                    <SideBarRight
                        title={edit ? <Trans i18nKey="roles.form.title.edit" /> : <Trans i18nKey="roles.form.title.new" />}
                        content={<Form data={dataForm} handleCharge={this.handleInput} />}
                        visible={showSideBar}
                        buttonsFooter={buttonsFooter}
                    />
                    <RoleList handleUpdate={this.handleUpdate} />
                    {showDeleteModal ? (
                        <RemoveModal
                            name="role"
                            remove={this.delete}
                            openModal={this.handleModalDelete}
                        />) : <div />}
                </AltContainer>
            </div>
        );
    }
}


export default translate()(Roles);
