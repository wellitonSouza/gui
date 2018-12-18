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

        // load the system default permissions of system
        this.loadSystemPermissions();
    }

    updateGroupPerm(groupPermissions) {
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
                    this.step1(response);
                    this.step2();
                    this.groupPermissions = this.systemPermissions;
                    if (groupId) {
                        groupPermissionsManager.getGroupPermissions(groupId)
                            .then((response2) => {
                                this.step3(response2);
                                this.updateGroupPerm(this.groupPermissions);
                                this._auxGroupPermissionBefore = JSON.parse(JSON.stringify(this.groupPermissions));
                            })
                            .catch((error) => {
                                this.failed(error);
                            });
                    }
                    this.updateGroupPerm(this.groupPermissions);
                })
                .catch((error) => {
                    this.failed(error);
                });
        };
    }

    step3(response) {
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

    step2() {
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
    getPermissionIdByActionMethod(action, method) {
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
        const permissionId = this.getPermissionIdByActionMethod(action, method);
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
        const permissionId = this.getPermissionIdByActionMethod(action, method);
        console.log('_deleteGroupPermission', permissionId);
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
        console.log('triggerSaveGroupPermissions', groupPermission, groupId);
        console.log('this._auxGroupPermissionBefore', this._auxGroupPermissionBefore);
        Object.keys(groupPermission)
            .forEach((action) => {
                Object.keys(groupPermission[action])
                    .forEach((method) => {
                        if (!edit || (groupPermission[action][method] !== this._auxGroupPermissionBefore[action][method])) {
                            if (groupPermission[action][method]) {
                                console.log('_createGroupPermission', action, method);
                                this._createGroupPermission(action, method, groupId, cb, errorCb);
                            } else {
                                console.log('_deleteGroupPermission', action, method);
                                if (edit) {
                                    this._deleteGroupPermission(action, method, groupId, cb, errorCb);
                                }
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
                    this.step1(response);

                })
                .catch((error) => {
                    this.failed(error);
                });
        };
    }

    step1(response) {
        return (dispatch) => {
            console.log('step1 begin');
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

            console.log('step1 end');
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
