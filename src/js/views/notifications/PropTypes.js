import {
    shape, number, string, oneOfType, bool,
} from 'prop-types';

export const metaNotificationType = shape({
    keyName: string,
    value: oneOfType([
        string,
        number,
        bool,
    ]),
});

export const notificationType = shape({
    date: string,
    time: string,
    message: string,
    metas: metaNotificationType,
    internalMetas: metaNotificationType,
});
