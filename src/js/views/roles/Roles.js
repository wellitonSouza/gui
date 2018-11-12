import React, { Component } from 'react';
import AltContainer from 'alt-container';
import TextTruncate from 'react-text-truncate';
import { translate, Trans } from 'react-i18next';
import RoleStore from '../../stores/RoleStore';
import RoleActions from '../../actions/RoleActions';
import SideBar from './SideBar';
import { NewPageHeader } from '../../containers/full/PageHeader';
import { DojotBtnLink } from '../../components/DojotButton';


function RoleCard(obj) {
    return (
        <div className="card-size card-hover lst-entry-wrapper z-depth-2 fullHeight">
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
                {param.groups.map(obj => <RoleCard group={obj} key={obj.id} />)}
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

function Form(params) {
    const { handleCharge, data } = params;
    return (
        <div>
            <div id="auth-icon" className="user-icon">
                <img src="images/generic-user-icon.png" />
            </div>
            <div id="auth-name" className="input-field icon-space">
                <input
                    value={data.roleName}
                    name="roleName"
                    /*      disabled={this.props.edit} */
                    onChange={handleCharge}
                    style={{ fontSize: '16px' }}
                    /*              className={
                                     `validate${this.state.isInvalid.username ? ' invalid' : ''}`
                                 } */
                    maxLength="40"
                    placeholder="TESTEEEEEE"
                />
                <label
                    htmlFor="roleName"
                    data-error={<Trans i18nKey="roles.form.input.rolename.error" />}
                    className="active"
                >
                    <Trans i18nKey="roles.form.input.rolename.label" />
                </label>
            </div>
            <div id="auth-usr" className="input-field">
                <input
                    value={data.roleDescription}
                    name="roleDescription"
                    onChange={handleCharge}
                    style={{ fontSize: '16px' }}
                    /*             className={
                                    `validate${this.state.isInvalid.name ? ' invalid' : ''}`
                                } */
                    maxLength="40"
                />
                <label
                    htmlFor="roleDescription"
                    data-error="Invalid name"
                    className="active"
                >
                    Descr
        </label>
            </div>
        </div>
    );
}

class Roles extends Component {
    constructor(props) {
        super(props);

        this.state = {
            showSideBar: false,
            dataForm: {
                roleId: ' ',
                roleName: ' ',
                roleDescription: ' ',
            },
        };

        this.newGroup = this.newGroup.bind(this);
        this.toggleSideBar = this.toggleSideBar.bind(this);
        this.hideSideBar = this.hideSideBar.bind(this);
        this.showSideBar = this.showSideBar.bind(this);
        this.handleInput = this.handleInput.bind(this);
        this.discard = this.discard.bind(this);
        this.save = this.save.bind(this);
    }

    componentDidMount() {
        RoleActions.fetchGroups.defer();
    }

    componentWillUnmount() {

    }

    newGroup() {
        this.toggleSideBar();
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
        const { name, value } = e.target;
        this.setState(prevState => ({
            dataForm: {
                ...prevState.dataForm, [name]: value,
            },
        }));
    }

    /**
     * fdsfsdfsdfsdf
     */
    discard() {
        //this.state
        //limpa state com info do form
        this.hideSideBar();
    }

    save() {
        console.log('Save');
        console.log(this.state);
        this.hideSideBar();
    }

    render() {
        const { showSideBar, dataForm } = this.state;

        const buttonsFooter = [
            {
                label: 'save',
                alt: 'clickToSave',
                click: this.save,
                color: 'red',
                modalConfirm: true,
                modalConfirmText: 'Ctz???',
            },
            {
                label: 'discard',
                alt: 'clickToSave',
                click: this.discard,
                color: 'red',
                modalConfirm: true,
                modalConfirmText: 'Ctz???',
            },
        ];

        return (
            <div id="roles-wrapper">
                <AltContainer store={RoleStore}>
                    <NewPageHeader title={<Trans i18nKey="roles.title" />} icon="roles">
                        <OperationsHeader newGroup={this.newGroup} />
                    </NewPageHeader>
                    <SideBar title={<Trans i18nKey="roles.form.title.new" />} content={<Form data={dataForm} handleCharge={this.handleInput} />} visible={showSideBar} buttonsFooter={buttonsFooter} />
                    <RoleList />
                </AltContainer>
            </div>
        );
    }
}


export default translate()(Roles);
