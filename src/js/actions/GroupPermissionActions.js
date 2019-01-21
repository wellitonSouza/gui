import { AbilityUtil } from 'Components/permissions/ability';
import groupPermissionsManager from '../comms/grouppermissions/GroupPermissionsManager';
import toaster from '../comms/util/materialize';
import Util from '../comms/util/util';

const alt = require('../alt');

class GroupPermissionActions {
    constructor() {
        this.error = null;
        // Permissions for a group
        this.groupPermissions = [];
        // System Permissions are the permissions default of the system, that will be available for user in gui
        this.systemPermissions = [];
    }

    /**
     * Update de obj permissions
     * Works like a trigger for Store keep to updated
     *
     * @param groupPermissions
     * @returns {*}
     */
    updateGroupPermission(groupPermissions) {
        this.groupPermissions = groupPermissions;
        return this.groupPermissions;
    }

    /**
     * Update de obj system permissions
     * Works like a trigger for Store keep to updated
     *
     * @returns {*}
     * @param systemPermissions
     */
    updateSystemPermission(systemPermissions) {
        this.systemPermissions = systemPermissions;
        return this.systemPermissions;
    }

    /**
     * Search permissions for a group
     * @param groupName
     * @returns {Function}
     */
    fetchGroupPermissions(groupName) {
        return (dispatch) => {
            dispatch();
            if (!groupName) {
                this.updateGroupPermission([]);
            } else {
                groupPermissionsManager.getGroupPermissions(groupName)
                    .then((response) => {
                        this.updateGroupPermission(response.data.permissions);
                    })
                    .catch((error) => {
                        this.failed(error);
                    });
            }
        };
    }

    /**
     *  Search System Permissions
     *  The system permissions are the permissions default of the system,
     *  that will be available for user in gui
     * @returns {Function}
     */
    fetchSystemPermissions() {
        return (dispatch) => {
            dispatch();
            groupPermissionsManager.getGroupPermissions()
                .then((response) => {
                    this.updateSystemPermission(response.data.permissions);
                })
                .catch((error) => {
                    this.failed(error);
                });
        };
    }

    /**
     * Save a change in permissions for a group
     * @param groupName
     * @param permissions
     * @param cb
     * @param errorCb
     * @returns {Function}
     */
    triggerSaveGroupPermissions(groupName, permissions, cb, errorCb) {
        return (dispatch) => {
            dispatch();
            groupPermissionsManager.saveGroupPermission(groupName, permissions)
                .then((response) => {
                    // if is the same user logged, update permissions on casl
                    if (Util.getUserLoggedInfo().profile === groupName) {
                        AbilityUtil.loginPermissions(permissions);
                    }
                    if (cb) {
                        cb(response);
                    }
                })
                .catch((error) => {
                    if (errorCb) {
                        errorCb(groupName);
                    }
                    this.failed(error);
                });
        };
    }

    /**
     * Just toast a error message
     * @param error
     * @returns {null}
     */
    failed(error) {
        this.error = error;
        toaster.error(this.error.message);
        return this.error;
    }
}

const groupPermissionActions = alt.createActions(GroupPermissionActions, exports);
export default groupPermissionActions;
