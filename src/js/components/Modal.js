/* eslint-disable */
import React, { Component } from 'react';
import {
    DojotBtnClassic,
} from './DojotButton';
import LoginActions from '../actions/LoginActions';
import toaster from '../comms/util/materialize';
import { withNamespaces } from 'react-i18next';

class RemoveModalComponent extends Component {
    constructor(props) {
        super(props);

        this.openModal = this.openModal.bind(this);
        this.remove = this.remove.bind(this);
    }

    openModal(statusModal) {
        this.props.openModal(statusModal);
    }

    remove(event) {
        event.preventDefault();
        this.props.remove(event);
    }

    render() {
        const { t } = this.props;
        const op_type = { label: t('remove.label') };
        const title = `${t('remove.label')} ${this.props.name}`;
        const first_message = t('qst_remove', { label: this.props.name });
        return (
            <GenericModal title={title} first_message={first_message} openModal={this.openModal}
                          click={this.remove} op_type={op_type} btnLabel={t('remove.label')}/>
        );
    }
}

class RecoveryPasswordModalComponent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            username: '',
            modalSentEmail: false,
            invalid: {},
        };

        this.dismiss = this.dismiss.bind(this);
        this.recoveryPassword = this.recoveryPassword.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.validate = this.validate.bind(this);
    }

    validate(user) {
        const { t } = this.props;
        const result = {};
        const invalid = {};
        const username = /^[a-z0-9_]+$/;
        if (user.trim().length == 0) {
            invalid.username = t('cant_empty');
        } else if (username.test(user) == false) {
            invalid.username = t('only_letter_number');
        }
        result.invalid = invalid;
        return result;
    }

    dismiss() {
        this.props.openPasswordModal(false);
    }

    handleChange(event) {
        const target = event.target;
        const state = this.state;
        state[target.name] = target.value;
        const results = this.validate(state.username);
        results.user = state;
        this.setState(results);
    }

    recoveryPassword() {
        const state = this.state;
        const results = this.validate(state.username);
        if (Object.keys(results.invalid).length == 0) {
            LoginActions.resetPassword(this.state.username);
            state.modalSentEmail = true;
        }
        results.user = state;
        this.setState(results);
    }

    render() {
        const state = this.state;

        function checkUsername() {
            return state.invalid.hasOwnProperty('username');
        }

        const { t } = this.props;

        if (this.state.modalSentEmail) {
            return (
                <div className="row">
                    <div className="sent-email-message">
                        <div className="col s12 sent-email-message-title">
                            <div className="col s10">{t('login:sent_email')}</div>
                            <div className="col s2 modal-close-icon" onClick={this.dismiss}><i
                                className="material-icons">   {t('close.label')}</i></div>
                        </div>
                        <div className="col s12 sent-email-message-body">
                            {t('login:email_message_body')}
                        </div>
                    </div>
                    <div className="modal-background" onClick={this.dismiss}/>
                </div>
            );
        }
        return (
            <div className="login row">
                <div className="recovery-password-modal">
                    <div className="row">
                        <div
                            className="recovery-password-title">[&nbsp;&nbsp;{t('login:forgot_password')}&nbsp;&nbsp;]
                        </div>
                    </div>
                    <div className="row">
                        <div className="recovery-password-body">
                            <div className="recovery-password-message">
                                {t('login:assoc_username')}
                            </div>
                            <div className="input-field-username col s12 m6">
                                <input name="username" type="text" value={this.state.username}
                                       onChange={this.handleChange}/>
                                <span
                                    className={
                                        `error-msgs-login ${
                                            checkUsername() ? 'visible' : 'not-visible'}`
                                    }
                                >
                                        {this.state.invalid.username}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col s12 text-right">
                            <DojotBtnClassic is_secondary={false} onClick={this.recoveryPassword}
                                             label={t('submit.label')} title={t('submit.label')}/>
                            <DojotBtnClassic is_secondary onClick={this.dismiss}
                                             label={t('discard.label')}
                                             title={t('discard.label')}/>
                        </div>
                    </div>
                </div>
                <div className="modal-background" onClick={this.dismiss}/>
            </div>
        );
    }
}

class ChangePasswordModalComponent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            password: '',
            confirmPassword: '',
            oldPassword: '',
            invalid: {
                confirm: '',
                password: '',
                oldPassword: ''
            },
        };

        this.dismiss = this.dismiss.bind(this);
        this.sendUpdatePassword = this.sendUpdatePassword.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.validate = this.validate.bind(this);
    }

    dismiss() {
        this.props.openChangePasswordModal(false);
        this.props.toggleSidebar();
    }

    componentWillMount() {
        this.setState({ username: this.props.username });
    }

    validate() {
        const errorMessage = this.state.invalid;
        const { t } = this.props;

        if (this.state.password.trim().length < 8) {
            errorMessage.password = t('login:alerts.least_8');
            this.setState({ invalid: errorMessage });
            return false;
        }
        delete errorMessage.password;
        this.setState({ invalid: errorMessage });

        if (this.state.confirmPassword !== this.state.password) {
            errorMessage.confirm = t('login:alerts.password_mismatch');
            this.setState({ invalid: errorMessage });
            return false;
        }
        delete errorMessage.confirm;
        this.setState({ invalid: errorMessage });

        return true;
    }

    sendUpdatePassword(e) {
        e.preventDefault();
        const { t } = this.props;
        const {
            invalid: errorMsg,
            oldPassword,
            password,
            confirmPassword
        } = this.state;
        if (this.validate()) {
            const passwordData = {
                oldpasswd: oldPassword,
                newpasswd: password
            };
            LoginActions.updatePassword(passwordData);
            this.dismiss();
        } else {

            if (oldPassword.trim().length <= 0 ||
                password.trim().length <= 0 ||
                confirmPassword.trim().length <= 0) {
                errorMsg.confirm = t('login:alerts.empty');
            } else if (password.trim() !== confirmPassword.trim()) {
                errorMsg.confirm = t('login:alerts.password_mismatch');
            }

            this.setState({ invalid: errorMsg });
            toaster.error(this.state.invalid.password);
            toaster.error(this.state.invalid.confirm);
        }
    }

    handleChange(event) {
        const inputValue = event.target;
        const stateValue = this.state;
        stateValue[inputValue.name] = inputValue.value;
        this.setState(stateValue);
        this.validate();
    }

    render() {
        const state = this.state;
        const { t } = this.props;

        function getClass(field) {
            if (state.invalid.hasOwnProperty(field)) {
                return 'react-validate invalid';
            }
            return 'react-validate';
        }

        return (
            <div className="row">
                <div className="confirm-password-modal">
                    <div className="row">
                        <div
                            className="confirm-password-title">[&nbsp;&nbsp;{t('text.change_password')}&nbsp;&nbsp;]
                        </div>
                    </div>
                    <div className="row">
                        <div className="confirm-password-body">
                            <div className="input-field col s12 m12">
                                <input
                                    id="fld_oldPassword"
                                    type="password"
                                    name="oldPassword"
                                    className={getClass('oldPassword')}
                                    onChange={this.handleChange}
                                    value={this.state.oldPassword}
                                />
                                <label
                                    htmlFor="fld_oldPassword"
                                    data-success=""
                                    data-error={this.state.invalid.password}
                                >
                                    {t('login:old_password')}
                                </label>
                            </div>
                            <div className="input-field col s12 m12">
                                <input
                                    id="fld_newPassword"
                                    type="password"
                                    name="password"
                                    className={getClass('password')}
                                    onChange={this.handleChange}
                                    value={this.state.password}
                                />
                                <label
                                    htmlFor="fld_newPassword"
                                    data-success=""
                                    data-error={this.state.invalid.password}
                                >
                                    {t('login:password.label')}
                                </label>
                            </div>
                            <div className="input-field col s12 m12">
                                <input
                                    id="fld_confirmPassword"
                                    type="password"
                                    name="confirmPassword"
                                    className={getClass('confirm')}
                                    onChange={this.handleChange}
                                    value={this.state.confirm}
                                />
                                <label
                                    htmlFor="fld_confirmPassword"
                                    data-success=""
                                    data-error={this.state.invalid.confirm}
                                >
                                    {t('login:confirm_pass')}
                                </label>
                            </div>
                        </div>

                        <div className="col s12 text-right">
                            <DojotBtnClassic is_secondary={false}
                                             onClick={this.sendUpdatePassword}
                                             label={t('save.label')}
                                             title={t('save.label')}/>
                            <DojotBtnClassic is_secondary onClick={this.dismiss}
                                             label={t('discard.label')}
                                             title={t('discard.label')}/>
                        </div>
                    </div>
                </div>
                <div className="rightsidebar" onClick={this.dismiss}/>
            </div>
        );
    }
}

class GenericModalComponent extends Component {
    constructor(props) {
        super(props);

        this.dismiss = this.dismiss.bind(this);
        this.primary_click = this.primary_click.bind(this);
    }

    dismiss() {
        this.props.openModal(false);
    }

    primary_click(event) {
        event.preventDefault();
        this.props.click(event);
    }

    render() {
        const { t } = this.props;
        return (
            <div className="">
                <div className="row confirm-modal">
                    <div className="confirm-modal-head">
                        <div className="col s4 img-alert">
                            <div><i className="fa fa-exclamation-triangle fa-4x"/></div>
                        </div>
                        <div className="col s8 message">
                            <div className="message-title left">{this.props.title}</div>
                            <div className="message-subtitle left">{this.props.first_message}</div>
                        </div>
                    </div>
                    <div className="col s12 text-right">
                        <DojotBtnClassic type="secondary" onClick={this.dismiss}
                                         label={t('cancel.label')}
                                         title={t('cancel.label')}/>
                        <DojotBtnClassic color="blue" type="primary" onClick={this.primary_click}
                                         label={this.props.op_type.label}
                                         title={this.props.op_type.label}/>
                    </div>
                </div>
                <div className="modal-background" onClick={this.dismiss}/>
            </div>
        );
    }
}

const GenericModal = withNamespaces()(GenericModalComponent);
const RemoveModal = withNamespaces()(RemoveModalComponent);
const RecoveryPasswordModal = withNamespaces()(RecoveryPasswordModalComponent);
const ChangePasswordModal = withNamespaces()(ChangePasswordModalComponent);
export {
    GenericModal, RemoveModal, RecoveryPasswordModal, ChangePasswordModal,
};
