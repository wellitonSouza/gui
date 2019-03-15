import React, { Component, Fragment } from 'react';
import { withNamespaces } from 'react-i18next';
import PropTypes from 'prop-types';
import AltContainer from 'alt-container';
import { NewPageHeader } from 'Containers/full/PageHeader';
import NotificationsStore from 'Stores/NotificationStore';
import NotificationActions from 'Actions/NotificationActions';
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

const CardNotification = (props) => {
    const {
        notification, i18n,
    } = props;

    const {
        date, time, message, metas, internalMetas,
    } = notification;

    return (
        <li>
            <div className="collapsible-header">
                <div className="card-notification">
                    <div className="first-col">
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
                    <div className="second-col">
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
            <div className="collapsible-body">
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
                                    key={Math.random()}
                                />
                            ))}
                    </div>
                </div>
            </div>
        </li>
    );
};


const NotificationList = (props) => {
    const { notifications, i18n } = props;
    return (
        <Fragment>
            <ul className="collapsible expandable">
                {notifications.map(notification => (
                    <CardNotification
                        notification={notification}
                        i18n={i18n}
                        key={Math.random()}
                    />
                ))}
            </ul>
        </Fragment>
    );
};

class Notifications extends Component {
    componentDidMount() {
        NotificationActions.fetchNotificationsFromHistory('user_notification');
        SocketIO.connect();
    }

    componentWillUnmount() {
        SocketIO.disconnect();
    }

    render() {
        const { t: i18n, notifications } = this.props;
        return (
            <div className="full-notification-area">
                <AltContainer store={NotificationsStore}>
                    <NewPageHeader
                        title={i18n('notifications:title')}
                        subtitle={i18n('notifications:subtitle')}
                        icon="alarm"
                    />
                    <NotificationList notifications={notifications} i18n={i18n} />
                </AltContainer>
            </div>
        );
    }
}


MetaNotification.propTypes = {
    keyName: PropTypes.string,
    value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
        PropTypes.bool,
    ]),
};

const notificationType = {
    date: PropTypes.string,
    time: PropTypes.string,
    message: PropTypes.string,
    metas: PropTypes.shape(MetaNotification),
    internalMetas: PropTypes.shape(MetaNotification),
};

Notifications.propTypes = {
    t: PropTypes.func.isRequired,
    notifications: PropTypes.arrayOf(PropTypes.shape(notificationType)),
};

Notifications.defaultProps = {
    notifications: [],
};

NotificationList.propTypes = {
    i18n: PropTypes.func.isRequired,
    notifications: PropTypes.arrayOf(PropTypes.shape(notificationType)).isRequired,
};

CardNotification.propTypes = {
    i18n: PropTypes.func.isRequired,
    notification: PropTypes.shape(notificationType),
};

CardNotification.defaultProps = {
    notification: {
        date: '',
        time: '',
        message: '',
    },
};


MetaNotification.defaultProps = {
    keyName: 'key',
    value: 'undefined',
};

export default withNamespaces()(Notifications);
