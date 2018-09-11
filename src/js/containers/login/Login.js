/* eslint-disable */
import React, { Component } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import AltContainer from 'alt-container';

import LoginActions from '../../actions/LoginActions';
import LoginStore from '../../stores/LoginStore';

import { RecoveryPasswordModal } from '../../components/Modal';

class Content extends Component {
    constructor(props) {
        super(props);

        this.state = {
            login: {
                username: '',
                passwd: '',
            },
            invalid: {},
            error: '',
            show_password_modal: false,
        };

        this.login = this.login.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.validate = this.validate.bind(this);
        this.openPasswordModal = this.openPasswordModal.bind(this);
        this.handlePasswordModal = this.handlePasswordModal.bind(this);
        this.try_login = false;
    }

    validate(user, passwd) {
        const result = {};
        const invalid = {};
        const username = /^[a-z0-9_]+$/;
        if (user.trim().length == 0) {
            invalid.username = "This can't be empty";
        } else if (username.test(user) == false) {
            result.error = 'Authentication failed';
        }

        if (passwd.trim().length == 0) {
            invalid.passwd = "This can't be empty";
        }
        result.invalid = invalid;
        // if (Object.keys(invalid).length > 0) { result['invalid'] = invalid; }
        return result;
    }

    login(e) {
        e.preventDefault();
        this.try_login = true;
        const results = this.validate(this.state.login.username, this.state.login.passwd);
        if (Object.keys(results.invalid).length == 0) {
            LoginActions.authenticate(JSON.parse(JSON.stringify(this.state.login)));
        }
        this.setState(results);
    }

    handleChange(event) {
        const target = event.target;
        const state = this.state.login;
        state[target.name] = target.value;
        const results = this.validate(state.username, state.passwd);
        results.login = state;
        this.setState(results);
    }

    openPasswordModal(status) {
        this.setState({ show_password_modal: status });
    }

    handlePasswordModal() {
        this.setState({ show_password_modal: true });
    }

    render() {
        const state = this.state;
        const error = this.props.error;
        const try_login = this.try_login;

        // function getClass(field) {
        //   if (state.invalid.hasOwnProperty(field)) {
        //     return "react-validate invalid";
        //   } else {
        //     return "react-validate";
        //   }
        // }

        function checkUsername() {
            return state.invalid.hasOwnProperty('username') && try_login;
        }

        function checkPasswd() {
            return state.invalid.hasOwnProperty('passwd') && try_login;
        }

        function getError() {
            return state.error.length > 0 ? state.error : error;
        }

        return (
            <div className="row m0">
                <div className="login col s12 p0 bg-left">
                    <div className="col  s4 p0 left-side" />
                    <div className="col s8 login-area-right-side bg-right">
                        <div className="col s7">
                            <div className="row">
                                <div className="col s12  offset-m1">
                                    <div className="login-page-title">
                    [&nbsp;&nbsp;Login&nbsp;&nbsp;]
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col s12  offset-m2">
                                    <div className="login-page-subtitle">
                    Sign in to start your session
                                    </div>
                                </div>
                            </div>
                            { this.props.error && (
                                <div className="row">
                                    <div className="col s12 m8 offset-m2">
                                        <div className="login-page-error">
                                            {getError()}
                                            <i className="material-icons prefix">info_outline</i>
                                        </div>
                                    </div>
                                </div>)}
                            <form onSubmit={this.login}>
                                <div className="row">
                                    <div className="input-field col s12 m6 offset-m2">
                                        <input id="fld_user" type="text" name="username" onChange={this.handleChange} value={this.state.login.user} />
                                        <label htmlFor="fld_user" id="user_label">Username</label>
                                        <span
                                            className={
                                                `error-msgs-login ${
                                                    checkUsername() ? 'visible' : 'not-visible'}`
                                            }
                                        >
                                            {this.state.invalid.username}
                                        </span>
                                        <i className="material-icons prefix">account_circle</i>
                                    </div>
                                    <div className="input-field col s12 m6 offset-m2">
                                        <input id="fld_password" type="password" name="passwd" onChange={this.handleChange} value={this.state.login.password} />
                                        <label htmlFor="fld_password" id="pass_label">Password</label>
                                        <span
                                            className={
                                                `error-msgs-login ${
                                                    checkPasswd() ? 'visible'
                                                        : 'not-visible'}`
                                            }
                                        >
                                            {this.state.invalid.passwd}
                                        </span>
                                        <i className="material-icons prefix">lock_open</i>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="forget-password col s12 m6 offset-m3">
                                        <label onClick={this.handlePasswordModal}>
                      Forgot Password?
                                        </label>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col s12 m1 offset-m7">
                                        {this.props.loading ? (
                                            <button type="submit" className="red btn-flat">
                                                <i className="fa fa-circle-o-notch fa-spin fa-fw" />
                                            </button>
                                        ) : (
                                            <button type="submit" className="red btn-flat">
                        Login
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </form>
                        </div>
                        <div className="col s5 right-side">
                            <div className="dojot-logo">
                                <img src="images/dojot_white.png" />
                            </div>
                            <div className="slogan">
                                <b>Do IoT</b>
                                <br />
Easy to use
                                <br />
                Fast to develop
                                <br />
                                {' '}
Safe to deploy
                            </div>
                        </div>
                    </div>
                </div>
                {this.state.show_password_modal ? <RecoveryPasswordModal openPasswordModal={this.openPasswordModal} /> : <div />}
            </div>
        );
    }
}

class Login extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <ReactCSSTransitionGroup
                transitionName="first"
                transitionAppear
                transitionAppearTimeout={500}
                transitionEnterTimeout={500}
                transitionLeaveTimeout={500}
            >
                <AltContainer store={LoginStore}>
                    <Content />
                </AltContainer>
            </ReactCSSTransitionGroup>
        );
    }
}

export default Login;
