/* eslint-disable */
import React, { Component } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import AltContainer from 'alt-container';
import LoginActions from '../../actions/LoginActions';
import LoginStore from '../../stores/LoginStore';
import toaster from '../../comms/util/materialize';

class Recovery extends Component {
    constructor(props) {
        super(props);

        this.state = {
            password: '',
            confirmPassword: '',
            invalid: { confirm: '', password: '' },
            token: '',
        };

        this.password = this.password.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.validate = this.validate.bind(this);
    }

    componentDidMount() {
        const test = window.location.hash.split('/');
        const temp = this.state;
        temp.token = test[test.length - 1];
        this.setState(temp);
        // console.log(temp);
    }

    validate() {
        const errorMsg = this.state.invalid;

        if (this.state.password.trim().length < 8) {
            errorMsg.password = 'Password must be at least 8 characters';
            this.setState({ invalid: errorMsg });
            return 1;
        }
        delete errorMsg.password;
        this.setState({ invalid: errorMsg });

        if (this.state.confirmPassword !== this.state.password) {
            errorMsg.confirm = 'Password mismatch';
            this.setState({ invalid: errorMsg });
            return 2;
        }
        delete errorMsg.confirm;
        this.setState({ invalid: errorMsg });

        return 0;
    }

    password(e) {
        e.preventDefault();
        let validate = this.validate();
        if (validate === 1) {
          toaster.error('Password must be at least 8 characters')
          this.setState({ invalid: {} });
        } else if(validate === 2){
            toaster.error('Password mismatch')
            this.setState({ invalid: {} });
        } else{
            const password = { passwd: this.state.password, token: this.state.token };
            LoginActions.setPassword(password);
        }
        
    }

    handleChange(event) {
        const target = event.target;
        const state = this.state;
        state[target.name] = target.value;
        this.setState(state);
        this.validate();
    }

    render() {
        const state = this.state;

        // const error = this.props.error;

        function getClass(field) {
            if (state.invalid.hasOwnProperty(field)) {
                return 'react-validate invalid';
            }
            return 'react-validate';
        }

        return (
            <div className="row m0">
                <div className="login col s12 p0 bg-left">
                    <div className="col  s4 p0 left-side" />
                    <div className="col s8 recovery-password-area-right-side bg-right">
                        <div className="col s7">
                            <div className="row">
                                <div className="col s12  offset-m1">
                                    <div className="recovery-password-page-title">
[&nbsp;&nbsp; New
                                        Password &nbsp;&nbsp;]
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col s12  offset-m2">
                                    <div className="recovery-password-page-subtitle">Type your password</div>
                                </div>
                            </div>
                            <form onSubmit={this.password}>
                                <div className="row">
                                    <div className="input-field col s12 m6 offset-m2">
                                        <input
                                            id="fld_password"
                                            type="password"
                                            name="password"
                                            className={getClass('password')}
                                            onChange={this.handleChange}
                                            value={this.state.password}
                                        />
                                        <label
                                            htmlFor="fld_password"
                                            data-success=""
                                            data-error={this.state.invalid.password}
                                        >
Password
                                        </label>
                                        <i className="material-icons prefix">lock</i>
                                    </div>
                                    <div className="input-field col s12 m6 offset-m2">
                                        <input
                                            id="fld_confirmPassword"
                                            type="password"
                                            name="confirmPassword"
                                            className={getClass('confirm')}
                                            onChange={this.handleChange}
                                            value={this.state.confirmPassword}
                                        />
                                        <label
                                            htmlFor="fld_confirmPassword"
                                            data-success=""
                                            data-error={this.state.invalid.confirm}
                                        >
Confirm your
                                            password
                                        </label>
                                        <i className="material-icons prefix">lock</i>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col s12 m1 offset-m7">
                                        <button type="submit" className="waves-effect waves-dark red btn-flat">
                                            Submit
                                        </button>
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
            </div>
        );
    }
}

class PasswordRecovery extends Component {
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
                    <Recovery />
                </AltContainer>
            </ReactCSSTransitionGroup>
        );
    }
}

export default PasswordRecovery;
