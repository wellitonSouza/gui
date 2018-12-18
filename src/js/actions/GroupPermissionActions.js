import groupPermissionsManager from '../comms/grouppermissions/GroupPermissionsManager';
import toaster from '../comms/util/materialize';
import mapPermissions from '../comms/grouppermissions/MapPermissions';

const alt = require('../alt');

class GroupPermissionActions {
    constructor() {
        // Obj of permissions in a group
        this.groupPermissions = {};
        // Obj of permissions type system
        this.systemPermissions = {};
        // Aux Obj  of permissions in a group for keep state before update
        this._auxGroupPermissionBefore = {};
        // Aux Maps between alias, alias [action.method], to id of permission.
        this._auxMapPermIdToAlias = null;
        this._auxMapPermAliasToId = null;
        this._auxMapPermMergAliasToId = null;
        this.error = null;
    }

    updateGroupPermission(groupPermissions) {
        this.groupPermissions = groupPermissions;
        return this.groupPermissions;
    }

    /**
     *
     * @param groupId
     * @returns {Function}
     */
    fetchPermissionsForGroups(groupId) {
        return (dispatch) => {
            dispatch();
            groupPermissionsManager.loadSystemPermissions()
                .then((response) => {
                    this._loadSystemPermissions(response);
                    this._mapSystemPermissionsForUi();
                    this.groupPermissions = this.systemPermissions;
                    if (groupId) {
                        groupPermissionsManager.getGroupPermissions(groupId)
                            .then((response2) => {
                                this._mapGroupPermissionsForUi(response2);
                                this.updateGroupPermission(this.groupPermissions);
                                this._auxGroupPermissionBefore = JSON.parse(JSON.stringify(this.groupPermissions));
                            })
                            .catch((error) => {
                                this.failed(error);
                            });
                    }
                    this.updateGroupPermission(this.groupPermissions);
                })
                .catch((error) => {
                    this.failed(error);
                });
        };
    }

    _mapGroupPermissionsForUi(response) {
        return (dispatch) => {
            const { permissions } = response;
            permissions.forEach((item) => {
                const alias = this._auxMapPermIdToAlias.get(item.id);
                if (alias) {
                    this.groupPermissions[alias.action][alias.method] = true;
                    if (alias.method === 'modifier') {
                        this.groupPermissions[alias.action].viewer = true;
                    }
                }
            });
            this._auxGroupPermissionBefore = JSON.parse(JSON.stringify(this.groupPermissions));
            dispatch();
        };
    }

    /**
     *
     * @returns {Function}
     * @private
     */
    _mapSystemPermissionsForUi() {
        return (dispatch) => {
            dispatch();
            let systemPermissions = {};
            this._auxMapPermMergAliasToId.forEach((item, action) => {
                let methodObj = {};
                item.forEach((item2) => {
                    methodObj = Object.assign(methodObj, { [item2.method]: false });
                });
                const actionMethod = {
                    [action]: methodObj,
                };
                systemPermissions = Object.assign(systemPermissions, actionMethod);
            });
            this.systemPermissions = systemPermissions;
        };

    }

    /**
     *
     * @param action
     * @param method
     * @returns {V}
     */
    _getPermissionIdByActionMethod(action, method) {
        return this._auxMapPermAliasToId.get(`${action}.${method}`);
    }

    /**
     *
     * @param action
     * @param method
     * @param groupId
     * @param cb
     * @param errorCb
     * @returns {Function}
     */
    _createGroupPermission(action, method, groupId, cb, errorCb) {
        const permissionId = this._getPermissionIdByActionMethod(action, method);
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
     * @param action
     * @param method
     * @param groupId
     * @param cb
     * @param errorCb
     * @returns {Function}
     */
    _deleteGroupPermission(action, method, groupId, cb, errorCb) {
        const permissionId = this._getPermissionIdByActionMethod(action, method);
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
     * @param edit
     * @returns {Function}
     */
    triggerSaveGroupPermissions(groupPermission, groupId, cb, errorCb, edit = false) {
        Object.keys(groupPermission)
            .forEach((action) => {
                Object.keys(groupPermission[action])
                    .forEach((method) => {
                        if (!edit || (groupPermission[action][method] !== this._auxGroupPermissionBefore[action][method])) {
                            if (groupPermission[action][method]) {
                                this._createGroupPermission(action, method, groupId, cb, errorCb);
                            } else if (edit) {
                                this._deleteGroupPermission(action, method, groupId, cb, errorCb);
                            }
                        }
                    });
            });
    }

    /**
     *
     * @param response
     * @returns {Function}
     * @private
     */
    _loadSystemPermissions(response) {
        return (dispatch) => {
            dispatch();
            const { permissions } = response;
            this._auxMapPermMergAliasToId = new Map();
            this._auxMapPermIdToAlias = new Map();
            this._auxMapPermAliasToId = new Map();
            permissions.forEach((perm) => {
                if (mapPermissions[perm.path] && mapPermissions[perm.path][perm.method]) {
                    const aliasAction = mapPermissions[perm.path].action;
                    const aliasMethod = mapPermissions[perm.path][perm.method].method;
                    const actionMethod = {
                        action: aliasAction,
                        method: aliasMethod,
                    };
                    this._auxMapPermIdToAlias.set(perm.id, actionMethod);
                    this._auxMapPermAliasToId.set(`${aliasAction}.${aliasMethod}`, perm.id);
                    let item = [{
                        method: aliasMethod,
                        id: perm.id,
                    }];
                    if (this._auxMapPermMergAliasToId.get(aliasAction)) {
                        item = item.concat(this._auxMapPermMergAliasToId.get(aliasAction));
                    }
                    this._auxMapPermMergAliasToId.set(aliasAction, item);
                }
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
