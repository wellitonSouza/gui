import groupPermissionsManager from '../comms/grouppermissions/GroupPermissionsManager';
import toaster from '../comms/util/materialize';

const alt = require('../alt');

class GroupPermissionActions {
    constructor() {
        this.permissions = [];
        this.error = null;
        this.fetchPermissions();
    }

    fetchPermissions() {
        return (dispatch) => {
            dispatch();
            groupPermissionsManager.loadAvaliablesSystemPermissons()
                .then((response) => {
                    this.permissions = response.permissions;
                })
                .catch((error) => {
                    this.failed(error);
                });
        };
    }

    failed(error) {
        this.error = error;
        toaster.error(this.error.message);
        return this.error;
    }
}

const groupPermissionActions = alt.createActions(GroupPermissionActions, exports);
export default groupPermissionActions;
