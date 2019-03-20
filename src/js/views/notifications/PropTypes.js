import {
    shape, string, any,
} from 'prop-types';

const notificationType = shape({
    date: string,
    time: string,
    message: string,
    metas: any,
});

export default notificationType;
