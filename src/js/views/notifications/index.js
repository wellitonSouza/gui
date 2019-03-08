import React, { Component, Fragment } from 'react';
import { withNamespaces } from 'react-i18next';
import AltContainer from 'alt-container';
import { NewPageHeader } from 'Containers/full/PageHeader';
import PropTypes from 'prop-types';
import NotificationsStore from 'Stores/NotificationStore';
import SocketIO from './SocketIONotification';

const CardNotification = (props) => {
    const {
        notification, i18n,
    } = props;

    const {
        date, time, message, device,
    } = notification;

    return (
        <div>
            <div className="card-notification">
                <div className="time-row">
                    <i className="fa fa-clock-o icon-clock " aria-hidden="true" />
                    <div className="datetime">
                        <div className="date">{date}</div>
                        <div className="time">{time}</div>
                    </div>
                </div>
                <div className="row-notification">
                    <div className="info-row">
                        <div className="main">
                            {message}
                        </div>
                        <div className="sub">{i18n('notifications:message')}</div>
                    </div>
                    <div className="name-row">
                        <div className="main">
                            {device}
                        </div>
                        <div className="sub">{i18n('notifications:device')}</div>
                    </div>
                </div>
            </div>
            <hr />
        </div>
    );
};


const NotificationList = (props) => {
    const { notifications, i18n } = props;
    return (
        <Fragment>
            {notifications.map(notification => (
                <CardNotification
                    notification={notification}
                    i18n={i18n}
                    key={Math.random()}
                />
            ))}
        </Fragment>
    );
};

class Notifications extends Component {
    componentDidMount() {
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

const notificationType = {
    date: PropTypes.string,
    time: PropTypes.string,
    message: PropTypes.string,
    device: PropTypes.string,
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
        device: '',
        message: '',
    },
};


export default withNamespaces()(Notifications);
