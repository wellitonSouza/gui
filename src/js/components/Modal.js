/* eslint-disable */
import React, { Component } from 'react';
import {
    DojotBtnClassic,
} from './DojotButton';
import LoginActions from '../actions/LoginActions';

class RemoveModal extends Component {
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
        const op_type = { label: 'Remove' };
        const title = `Remove ${this.props.name}`;
        const first_message = `You are about to remove this ${this.props.name}. Are you sure?`;
        return (
            <GenericModal title={title} first_message={first_message} openModal={this.openModal} click={this.remove} op_type={op_type} btnLabel="Remove" />
        );
    }
}

class RecoveryPasswordModal extends Component {
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
        const result = {};
        const invalid = {};
        const username = /^[a-z0-9_]+$/;
        if (user.trim().length == 0) {
            invalid.username = "This can't be empty";
        } else if (username.test(user) == false) {
            invalid.username = 'Please use only letters (a-z), numbers (0-9) and underscores (_).';
        }
        result.invalid = invalid;
        // if (Object.keys(invalid).length > 0) { result['invalid'] = invalid; }
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
        const state = this.state
        const results = this.validate(state.username);
        if (Object.keys(results.invalid).length == 0) {
        LoginActions.resetPassword(this.state.username);
        state.modalSentEmail = true
        }
        results.user = state
        this.setState(results);
    }

    render() {
        const state = this.state;
        function checkUsername() {
            return state.invalid.hasOwnProperty('username');
        }
        if (this.state.modalSentEmail) {
            return (
                <div className="row">
                    <div className="sent-email-message">
                        <div className="col s12 sent-email-message-title">
                            <div className="col s10">Sent Email</div>
                            <div className="col s2 modal-close-icon" onClick={this.dismiss}><i className="material-icons">close</i></div>
                        </div>
                        <div className="col s12 sent-email-message-body">
              We sent you an email with the instructions and the link for you to change the password
              (remember to check your spam box). If you do not receive the email, repeat the process.
                        </div>
                    </div>
                    <div className="modal-background" onClick={this.dismiss} />
                </div>
            );
        }
        return (
            <div className="login row">
                <div className="recovery-password-modal">
                    <div className="row">
                        <div className="recovery-password-title">[&nbsp;&nbsp;Forgot your password?&nbsp;&nbsp;]</div>
                    </div>
                    <div className="row">
                        <div className="recovery-password-body">
                            <div className="recovery-password-message">
                  Enter the username associated with your dojot account.
                            </div>
                            <div className="input-field-username col s12 m6">
                                <input name="username" type="text" value={this.state.username} onChange={this.handleChange} />
                                <span
                                    className={
                                        `error-msgs-login ${
                                            checkUsername() ? 'visible': 'not-visible'}`
                                        }
                                        >
                                        {this.state.invalid.username}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                    <div className="col s12 text-right">                      
                        <DojotBtnClassic is_secondary={false} onClick={this.recoveryPassword} label="Submit" title="Submit" />
                        <DojotBtnClassic is_secondary onClick={this.dismiss} label="Discard" title="Discard" />
                    </div>
                    </div>
                </div>
                <div className="modal-background" onClick={this.dismiss} />
            </div>
        );
    }
}

class ChangePasswordModal extends Component {
    constructor(props) {
        super(props);

        this.state = {
            password: '',
            confirmPassword: '',
            oldPassword: '',
            invalid: { confirm: '', password: '' },
        };

        this.dismiss = this.dismiss.bind(this);
        this.password = this.password.bind(this);
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

        if (this.state.password.trim().length < 8) {
            errorMessage.password = 'Password must be at least 8 characters';
            this.setState({ invalid: errorMessage });
            return false;
        }
        delete errorMessage.password;
        this.setState({ invalid: errorMessage });

        if (this.state.confirmPassword !== this.state.password) {
            errorMessage.confirm = 'Password mismatch';
            this.setState({ invalid: errorMessage });
            return false;
        }
        delete errorMessage.confirm;
        this.setState({ invalid: errorMessage });

        return true;
    }

    password(e) {
        e.preventDefault();

        if (this.validate()) {
            const password = { passwd: this.state.password, token: this.state.token };
            const passwordData = { oldpasswd: this.state.oldPassword, newpasswd: this.state.password };
            LoginActions.updatePassword(passwordData);
            this.dismiss();
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
                        <div className="confirm-password-title">[&nbsp;&nbsp;Change Password&nbsp;&nbsp;]</div>
                    </div>
                    <form onSubmit={this.password}>
                        <div className="row">
                            <div className="confirm-password-body">
                                <div className="input-field col s12 m12">
                                    <input
                                        id="fld_oldPassword"
                                        type="password"
                                        name="oldPassword"
                                        onChange={this.handleChange}
                                        value={this.state.oldPassword}
                                    />
                                    <label
                                        htmlFor="fld_oldPassword"
                                        data-success=""
                                        data-error={this.state.invalid.password}
                                    >
Old password
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
Password
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
Confirm your password
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col s12 m1 offset-m7">
                                <button type="submit" className="waves-effect waves-dark red btn-flat">
                  Save
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
                <div className="rightsidebar" onClick={this.dismiss} />
            </div>
        );
    }
}

class GenericModal extends Component {
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
        return (
            <div className="">
                <div className="row confirm-modal">
                    <div className="confirm-modal-head">
                        <div className="col s4 img-alert">
                            <div><i className="fa fa-exclamation-triangle fa-4x" /></div>
                        </div>
                        <div className="col s8 message">
                            <div className="message-title left">{this.props.title}</div>
                            <div className="message-subtitle left">{this.props.first_message}</div>
                        </div>
                    </div>
                    <div className="col s12 text-right">
                        <DojotBtnClassic is_secondary onClick={this.dismiss} label="Cancel" title="Cancel" />
                        <DojotBtnClassic is_secondary={false} onClick={this.primary_click} label={this.props.op_type.label} title={this.props.op_type.label} />
                    </div>
                </div>
                <div className="modal-background" onClick={this.dismiss} />
            </div>
        );
    }
}

export {
    GenericModal, RemoveModal, RecoveryPasswordModal, ChangePasswordModal,
};
