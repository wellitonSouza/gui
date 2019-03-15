import PropTypes from 'prop-types';

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
