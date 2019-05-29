import React, { Component } from 'react';
import { withNamespaces } from 'react-i18next';
import i18n from 'i18next';
import AltContainer from 'alt-container';
import PropTypes from 'prop-types';
import { NewPageHeader } from '../../containers/full/PageHeader';
import NotificationsStore from '../../stores/NotificationStore';
import NotificationActions from '../../actions/NotificationActions';
import SocketIO from './SocketIONotification';
import CardNotification from './CardNotification';
import notificationType from './PropTypes';


const NotificationList = (props) => {
    const { notifications } = props;

    console.log('notifications length', Notifications);

    return (
        <div>
            {notifications.length > 0 ?
                (<ul>
                    {notifications.map(notification => (
                        <CardNotification
                            notification={notification}
                            key={Math.random()}
                        />
                    ))}
                </ul>)
                : (<div className="valign-wrapper full-height background-info">
                    <div className="full-width center">{`${i18n.t('notifications:no_data_avaliable')}`}</div>
                </div>)
            }
        </div>
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
                    <NotificationList />
                </AltContainer>
            </div>
        );
    }
}

Notifications.propTypes = {
    t: PropTypes.func.isRequired,
};

NotificationList.propTypes = {
    notifications: PropTypes.arrayOf(notificationType),
};

NotificationList.defaultProps = {
    notifications: [],
};

export default withNamespaces()(Notifications);
