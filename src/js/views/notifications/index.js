import React, { Component, Fragment } from 'react';
import { withNamespaces } from 'react-i18next';
import AltContainer from 'alt-container';
import { NewPageHeader } from 'Containers/full/PageHeader';
import PropTypes from 'prop-types';
import NotificationsStore from 'Stores/NotificationStore';
import SocketIO from './socketIONotification';

const CardNotification = (props) => {
    const {
        date, time, message, device, i18n,
    } = props;
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
                    date={notification.date}
                    time={notification.time}
                    message={notification.message}
                    device={notification.device}
                    i18n={i18n}
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

Notifications.propTypes = {
    t: PropTypes.func.isRequired,
    notifications: PropTypes.shape(CardNotification),
};

Notifications.defaultProps = {
    notifications: [],
};

NotificationList.propTypes = {
    i18n: PropTypes.func.isRequired,
    notifications: PropTypes.shape(CardNotification).isRequired,
};

CardNotification.propTypes = {
    i18n: PropTypes.func.isRequired,
    date: PropTypes.string,
    time: PropTypes.string,
    message: PropTypes.string.isRequired,
    device: PropTypes.string,
};
CardNotification.defaultProps = {
    date: '',
    time: '',
    device: '',
};


export default withNamespaces()(Notifications);
