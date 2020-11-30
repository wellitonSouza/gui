import {
    shape, string, any, boolean,
} from 'prop-types';

const notificationType = shape({
    date: string,
    time: string,
    message: string,
    metas: any,
    format: boolean,
});

export default notificationType;
