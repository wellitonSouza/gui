import groupPermissionsManager from '../comms/grouppermissions/GroupPermissionsManager';
import toaster from '../comms/util/materialize';
import mapPermissions from '../comms/grouppermissions/MapPermissions';

const alt = require('../alt');

class GroupPermissionActions {
    constructor() {
        // Array of groups with your permissions
        this.groupPermissions = {};
        this.groupId = null;
        this.error = null;

        // Maps between alias, action-method, to id of permission.
        this.mapAliasPermissionsToId = new Map();
        this.mapAliasIdToPermissions = new Map();

        // Obj for keep state  before update
        this.groupPermissionBefore = {};

        console.log('1_loadSystemPermissions');

        // load the system default permissions of system
        this.loadSystemPermissions();
    }

    updateGroups(groupPermissions) {
        this.groupPermissions = groupPermissions;
        return this.groupPermissions;
    }

    /**
     * Search permissions associate with a group
     * @returns {*}
     * @param permissions
     */
    _associateGroupPermissions(permissions) {
        console.log('mapAliasIdToPermissions', this.mapAliasIdToPermissions);
        console.log('mapAliasPermissionsToId', this.mapAliasPermissionsToId);
        console.log('_associateGroupPermissions', permissions);
        const groupPermission = {};
        this.mapAliasIdToPermissions.forEach((item, key) => {
            console.log('item key', item, key);
            const existPermission = (!!permissions[key] && permissions.permission === 'permit');
            groupPermission[item.action][item.method] = existPermission;
            this.groupPermissionBefore[item.action][item.method] = existPermission;
        });
        this.updateGroups(groupPermission);
        console.log('groupPermission', groupPermission);
    }

    /**
     *
     * @param groupId
     * @returns {Function}
     */
    fetchPermissionsForGroups(groupId) {
        console.log('fetchPermissionsForGroups');
        return (dispatch) => {
            dispatch();
            groupPermissionsManager.getGroupPermissions(groupId)
                .then((response) => {
               /*     const { permissions } = response;*/
                    this._associateGroupPermissions(response);
                })
                .catch((error) => {
                    this.failed(error);
                });
        };
    }

    /**
     *
     * @param listPermissions
     */
    _createMapIdToPermission(listPermissions) {
        console.log(listPermissions);
        this.mapAliasIdToPermissions = new Map();
        this.mapAliasPermissionsToId = new Map();

        listPermissions.forEach((perm) => {
            console.log('perm ', perm);
            const aliasAction = mapPermissions[perm.path].action;
            const aliasMethod = mapPermissions[perm.path][perm.method].method;
            console.log('aliasAction aliasMethod ', aliasAction, aliasMethod);
            const actionMethod = {
                action: aliasAction,
                method: aliasMethod,
            };
            this.mapAliasIdToPermissions.set(perm.id, actionMethod);
            this.mapAliasPermissionsToId.set(actionMethod, perm.id);
        });

        console.log('1mapAliasIdToPermissions', this.mapAliasIdToPermissions);
        console.log('1mapAliasPermissionsToId', this.mapAliasPermissionsToId);
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
        console.log('loadSystemPermissions');
        return (dispatch) => {
            dispatch();
            groupPermissionsManager.loadSystemPermissions()
                .then((response) => {
                    const { permissions } = response;
                    this._createMapIdToPermission(permissions);
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
