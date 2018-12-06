import groupPermissionsManager from '../comms/grouppermissions/GroupPermissionsManager';
import toaster from '../comms/util/materialize';

const alt = require('../alt');

class GroupPermissionActions {

    constructor() {
        // Array of permissions of system
        this.systemPermissions = [];

        // Array of groups with your permissions
        this.groupPermissions = [];

        this.error = null;

        // Load all system permissions
        this.fetchAllSystemPermissions();
    }

    fetchAllSystemPermissions() {
        return (dispatch) => {
            dispatch();
            groupPermissionsManager.loadSystemPermissions()
                .then((response) => {
                    this.systemPermissions = response.permissions;
                })
                .catch((error) => {
                    this.failed(error);
                });
        };
    }

    fetchPermissionsByGroups(groupName) {
        return (dispatch) => {
            dispatch();
            groupPermissionsManager.getGroupPermissions(groupName)
                .then((response) => {
                    this.groupPermissions = response.permissions;
                })
                .catch((error) => {
                    this.failed(error);
                });
        };
    }

    triggerSaveGroupPermissions(permission, groupId, cb, errorCb) {
        return (dispatch) => {
            dispatch();
            groupPermissionsManager.createGroupPermission(permission, groupId)
                .then((response) => {
                    if (cb) {
                        cb(response);
                    }
                })
                .catch((error) => {
                    if (errorCb) {
                        errorCb(groupId);
                    }
                    this.failed(error);
                });
        };
    }

    triggerRemoveGroupPermissions(permission, groupId, cb, errorCb) {
        return (dispatch) => {
            dispatch();
            groupPermissionsManager.deletePermission(permission, groupId)
                .then((response) => {
                    if (cb) {
                        cb(response);
                    }
                })
                .catch((error) => {
                    if (errorCb) {
                        errorCb(groupId);
                    }
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
