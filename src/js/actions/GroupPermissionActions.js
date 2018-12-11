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
        this.mapAliasPermToId = new Map();
        this.actionMethodPermMap = new Map();

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
                    this.actionMethodPermMap.forEach((item, key) => {

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
        let systemPermissions = {};
        this.actionMethodPermMap.forEach((item, action) => {
            let methodObj = {};
            item.forEach((item2) => {
                methodObj = Object.assign(methodObj, { [item2.method]: true });
            });
            const actionMethod = {
                [action]: methodObj,
            };
            systemPermissions = Object.assign(systemPermissions, actionMethod);
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
        const permissionId = this.mapAliasPermToId.get(actionMethod);
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
        const permissionId = this.mapAliasPermToId.get(actionMethod);
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

                    this.actionMethodPermMap = new Map();

                    this.mapAliasPermToId = new Map();

                    permissions.forEach((perm) => {
                        const aliasAction = mapPermissions[perm.path].action;
                        const aliasMethod = mapPermissions[perm.path][perm.method].method;

                        const actionMethod = {
                            action: aliasAction,
                            method: aliasMethod,
                        };
                        this.mapAliasPermToId.set(actionMethod, perm.id);

                        let item = [{
                            method: aliasMethod,
                            id: perm.id,
                        }];
                        if (this.actionMethodPermMap.get(aliasAction)) {
                            item = item.concat(this.actionMethodPermMap.get(aliasAction));
                        }
                        this.actionMethodPermMap.set(aliasAction, item);
                    });

                    const actionMethod1 = {
                        action: 'device',
                        method: 'viewer',
                    };
                    this.mapAliasPermToId.set(actionMethod1, -2);

                    let item = [{
                        method: 'viewer',
                        id: -22,
                    }];

                    if (this.actionMethodPermMap.get('device')) {
                        item = item.concat(this.actionMethodPermMap.get('device'));
                    }
                    this.actionMethodPermMap.set('device', item);


                    let item2 = [{
                        method: 'viewer',
                        id: -223,
                    }];

                    if (this.actionMethodPermMap.get('alarms')) {
                        item2 = item2.concat(this.actionMethodPermMap.get('alarms'));
                    }
                    this.actionMethodPermMap.set('alarms', item2);

                    let item3 = [{
                        method: 'modifier',
                        id: -223,
                    }];

                    if (this.actionMethodPermMap.get('alarms')) {
                        item3 = item3.concat(this.actionMethodPermMap.get('alarms'));
                    }
                    this.actionMethodPermMap.set('alarms', item3);


                    console.log('actionMethodPermMap', this.actionMethodPermMap);

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
