import React, { Component } from 'react';
import { withNamespaces } from 'react-i18next';
import AltContainer from 'alt-container';
import { NewPageHeader } from 'Containers/full/PageHeader';
import NotificationsStore from 'Stores/NotificationStore';
import NotificationActions from 'Actions/NotificationActions';
import SocketIO from './SocketIONotification';
import CardNotification from './CardNotification';


const NotificationList = (props) => {
    const { notifications } = props;
    return (
        <ul>
            {notifications.map(notification => (
                <CardNotification
                    notification={notification}
                    /* i18n={i18n} */
                    key={Math.random()}
                />
            ))}
        </ul>
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
        const { t: i18n } = this.props;
        return (
            <div className="full-notification-area">
                <AltContainer store={NotificationsStore}>
                    <NewPageHeader
                        title={i18n('notifications:title')}
                        subtitle={i18n('notifications:subtitle')}
                        icon="alarm"
                    />
                    <NotificationList i18n={i18n}/>
                </AltContainer>
            </div>
        );
    }
}

export default withNamespaces()(Notifications);
