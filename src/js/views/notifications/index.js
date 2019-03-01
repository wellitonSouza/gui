import React, { Component, Fragment } from 'react';
import { withNamespaces } from 'react-i18next';
import AltContainer from 'alt-container';
import { NewPageHeader } from 'Containers/full/PageHeader';
import PropTypes from 'prop-types';
import NotificationsStore from 'Stores/NotificationStore';

const CardNotification = () => (
    <div>
        <div className="card-notification">
            <div className="time-row">
                {/* <div className="icon-clock" /> */}
                <i className="fa fa-clock-o icon-clock fa-10x" aria-hidden="true" />
                <div className="datetime">
                    <div className="date">7 Feb 2019</div>
                    <div className="time">08:36:46</div>
                </div>
            </div>
            <div className="info-row">
                <span>test</span>
            </div>
        </div>
    </div>
);

const NotificationList = () => (
    <Fragment>
        <CardNotification />
    </Fragment>
);


class Notifications extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { t } = this.props;
        return (
            <div className="full-notification-area">
                <AltContainer store={NotificationsStore}>
                    <NewPageHeader
                        title={t('notifications:title')}
                        subtitle={t('notifications:subtitle')}
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


export default withNamespaces()(Notifications);
