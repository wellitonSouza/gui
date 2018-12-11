import groupPermissionsManager from '../comms/grouppermissions/GroupPermissionsManager';
import toaster from '../comms/util/materialize';
import mapPermissions from '../comms/grouppermissions/MapPermissions';

const alt = require('../alt');

class GroupPermissionActions {
    constructor() {
        // Array of groups with your permissions
        this.groupPermissions = [];
        // Array of permissions
        this.systemPermissions = [];
        this.error = null;

        // Maps between alias, action-method, to id of permission.
        this.mapAliasPermissionsToId = new Map();
        this.mapAliasIdToPermissions = new Map();

        // Array for keep state before update
        this.groupPermissionBefore = [];

        // load the system default permissions of system
        this.loadSystemPermissions();
    }

    updateGroupPermissions(groupPermissions) {
        this.groupPermissions = groupPermissions;
        return this.groupPermissions;
    }

    updateSystemPermissions(systemPermissions) {
        this.systemPermissions = systemPermissions;
        return this.systemPermissions;
    }

    /**
     *
     * @param groupId
     * @returns {Function}
     */
    fetchPermissionsForGroups(groupId) {
        return (dispatch) => {
            dispatch();
            groupPermissionsManager.getGroupPermissions(groupId)
                .then((permissions) => {
                    const groupPermission2 = [];
                    // Search permissions associate with a group
                    this.mapAliasIdToPermissions.forEach((item, key) => {

                        const existPermission = (!!permissions[key] && permissions.permission === 'permit');
                        const actionT = item.action;
                        const methodT = item.method;

                        const actionMethod = {
                            [actionT]: { [methodT]: existPermission },
                        };
                        groupPermission2.push(actionMethod);
                        this.groupPermissionBefore.push(actionMethod);
                    });

                    this.updateGroupPermissions(groupPermission2);
                })
                .catch((error) => {
                    this.failed(error);
                });
        };
    }

    getSystemPermissions() {
        return this.systemPermissions;
    }

    /**
     *
     */
    fetchSystemPermissions() {
        const systemPermissions = [];
        this.mapAliasPermissionsToId.forEach((item, key) => {
            console.log('item key', item, key);
            const actionT = key.action;
            const methodT = key.method;
            const actionMethod = {
                [actionT]: { [methodT]: true },
            };
            const method = {
                [methodT]: true,
            };
            systemPermissions.push(actionMethod);
        });
        console.log('fetchSystemPermissions', systemPermissions);
        this.updateSystemPermissions(systemPermissions);
        return systemPermissions;
    }

    /**
     *
     * @param _action
     * @param _method
     * @param groupId
     * @param cb
     * @param errorCb
     * @returns {Function}
     */
    _createGroupPermission(_action, _method, groupId, cb, errorCb) {
        const actionMethod = {
            action: _action,
            method: _method,
        };
        const permissionId = this.mapAliasPermissionsToId.get(actionMethod);
        return (dispatch) => {
            dispatch();
            groupPermissionsManager.createGroupPermission(permissionId, groupId)
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

    /**
     *
     * @param _action
     * @param _method
     * @param groupId
     * @param cb
     * @param errorCb
     * @returns {Function}
     */
    _deleteGroupPermission(_action, _method, groupId, cb, errorCb) {
        const actionMethod = {
            action: _action,
            method: _method,
        };
        const permissionId = this.mapAliasPermissionsToId.get(actionMethod);
        return (dispatch) => {
            dispatch();
            groupPermissionsManager.deleteGroupPermission(permissionId, groupId)
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

    /**
     *
     * @param groupPermission
     * @param groupId
     * @param cb
     * @param errorCb
     * @returns {Function}
     */
    triggerSaveGroupPermissions(groupPermission, groupId, cb, errorCb) {
        Object.keys(groupPermission)
            .forEach((action) => {
                Object.keys(groupPermission[action])
                    .forEach((method) => {
                        if (groupPermission[action][method] !== this.groupPermissionBefore) {
                            if (groupPermission[action][method]) {
                                this._createGroupPermission(action, method, groupId, cb, errorCb);
                            } else {
                                this._deleteGroupPermission(action, method, groupId, cb, errorCb);
                            }
                        }
                    });
            });
    }

    /**
     *
     * @returns {Function}
     */
    loadSystemPermissions() {
        return (dispatch) => {
            dispatch();
            groupPermissionsManager.loadSystemPermissions()
                .then((response) => {
                    const { permissions } = response;

                    this.mapAliasIdToPermissions = new Map();

                    this.mapAliasPermissionsToId = new Map();

                    permissions.forEach((perm) => {
                        const aliasAction = mapPermissions[perm.path].action;
                        const aliasMethod = mapPermissions[perm.path][perm.method].method;

                        const actionMethod1 = {
                            action: aliasAction,
                            method: [aliasMethod],
                        };
/*                        if (this.mapAliasIdToPermissions.get(perm.id)) {
                           const actionMethodAct =  this.mapAliasIdToPermissions.get(perm.id);
                        }*/
                        this.mapAliasIdToPermissions.set(perm.id, actionMethod1);

                        const actionMethod = {
                            action: aliasAction,
                            method: aliasMethod,
                        };
                        this.mapAliasPermissionsToId.set(actionMethod, perm.id);
                    });

                    const actionMethod1 = {
                        action: 'device',
                        method: 'viewer',
                    };
                    this.mapAliasIdToPermissions.set(2, actionMethod1);
                    this.mapAliasPermissionsToId.set(actionMethod1, 2);

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
