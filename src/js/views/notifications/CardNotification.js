import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withNamespaces } from 'react-i18next';
import SocketIO from './SocketIONotification';

const MetaNotification = (props) => {
    const {
        keyName, value,
    } = props;

    let finalValue = 'undefined';
    if (((typeof value) === 'boolean')) {
        finalValue = (value ? 'true' : 'false');
    } else if ((typeof value) === 'number' || (typeof value) === 'string') {
        finalValue = value;
    }
    return (
        <div className="meta-row">
            <div className="main">
                {finalValue}
            </div>
            <div className="sub">
                {keyName}
            </div>
        </div>
    );
};

class CardNotification extends Component {
    constructor(props) {
        super(props);

        this.state = {
            showMetas: false,
        };

        this.clickToggle = this.clickToggle.bind(this);
    }

    clickToggle() {
        this.setState(prevState => ({
            showMetas: !prevState.showMetas,
        }));
    }

    render() {
        const {
            notification: {
                date, time, message, metas, internalMetas,
            }, t: i18n,
        } = this.props;

        const { showMetas } = this.state;

        return (
            <li>
                <div className="dojot-collapsible-header" role="button" onClick={this.clickToggle}>
                    <div className="card-notification">
                        <div className="first-col-noti">
                            <i
                                className="fa fa-clock-o icon-clock "
                                aria-hidden="true"
                            />
                            <div className="datetime">
                                <div className="date">{date}</div>
                                <div className="time">
                                    {time}
                                </div>
                            </div>
                        </div>
                        <div className="second-col-noti">
                            <div className="info-row">
                                <div className="main">
                                    {message}
                                </div>
                                <div
                                    className="sub"
                                >
                                    {i18n('notifications:message')}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <hr />
                <div className={`dojot-collapsible-body${showMetas ? '-active' : ''}`}>
                    <div className="card-notification">
                        <div className="meta-body">
                            {Object.keys((metas))
                                .map(key => (
                                    <MetaNotification
                                        value={metas[key]}
                                        keyName={key}

                                    />
                                ))}
                            {Object.keys((internalMetas))
                                .map(key => (
                                    <MetaNotification
                                        value={internalMetas[key]}
                                        keyName={key}

                                    />
                                ))}
                        </div>
                    </div>
                    <hr />
                </div>
            </li>
        );
    }
}

export default withNamespaces()(CardNotification);
