import alt from '../../../alt';
import DeviceHandlerActions from './DeviceHandlerActions';

const FormActions = alt.createActions(DeviceHandlerActions);
const AttrActions = alt.generateActions('update');

export { FormActions, AttrActions };
