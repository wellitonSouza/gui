import util from '../util/util';
import mapPermissions from './MapPermissions.json';

class GroupPermissionsManager {
    constructor() {
        this.baseUrlPermissions = '/auth/pap/permission';
        this.baseUrlManagerGroupPermissions = '/auth/pap/grouppermissions';
        this.baseUrlListGroupPermissions = '/auth/pap/group';

        // Maps between alias, action.method, to id of permission.
        this.mapAliasPermissionsToId = new WeakMap();
        this.mapAliasIdToPermissions = new WeakMap();

        // Obj for keep state  before update
        this.groupPermissionBefore = {};

        this.loadSystemPermissions();
    }

    /**
     * Search permissions associate with a group
     * @param groupName
     * @returns {*}
     */
    getGroupPermissions(groupName) {
        ///groupName will be groupId
        const permissionsGroupResponse = util.GET(`${this.baseUrlListGroupPermissions}/${groupName}/permissions`);
        const groupPermission = {};

        const { permissions } = permissionsGroupResponse;
        this.mapAliasIdToPermissions.forEach((item, key) => {
            const existPermission = !!(permissions[key] && permissions.permission === 'permit');
            groupPermission[item.action][item.method] = existPermission;
            this.groupPermissionBefore[item.action][item.method] = existPermission;
        });
        return groupPermission;
    }

    /**
     * Update all system permissions for a group
     * @param groupPermission
     * @param groupId
     */
    updateAllGroupPermissions(groupPermission, groupId) {
        Object.keys(groupPermission)
            .forEach((action) => {
                Object.keys(groupPermission[action])
                    .forEach((method) => {
                        if (groupPermission[action][method] !== this.groupPermissionBefore) {
                            if (groupPermission[action][method]) {
                                this.createGroupPermission(action, method, groupId);
                            } else {
                                this.deleteGroupPermission(action, method, groupId);
                            }
                        }
                    });
            });
    }

    /**
     * Create a group associate between group and permission
     *
     * @param _action
     * @param _method
     * @param groupId
     * @returns {*}
     */
    createGroupPermission(_action, _method, groupId) {
        const actionMethod = {
            action: _action,
            method: _method,
        };
        return util.POST(`${this.baseUrlManagerGroupPermissions}/${groupId}/${this.mapAliasPermissionsToId.get(actionMethod)}`, '');
    }

    /**
     * Remove a group associate between group and permission
     *
     * @param _action
     * @param _method
     * @param groupId
     * @returns {*}
     */
    deleteGroupPermission(_action, _method, groupId) {
        const actionMethod = {
            action: _action,
            method: _method,
        };
        return util.DELETE(`${this.baseUrlManagerGroupPermissions}/${groupId}/${this.mapAliasPermissionsToId.get(actionMethod)}`);
    }

    /**
     * Search defaults Permissions of system
     *
     * @returns {WeakMap<object, any>} Map between alias, action.method, to id of permission.
     */
    loadSystemPermissions() {
        // const typePermission = 'system';
        // const listPermissions = util.GET(`${this.baseUrlPermissions}?${typePermission}`);
        const listPermissions = util.GET('http://localhost:8000/auth/pap/permission?path=/device/(.*)&method=(.*)&permission=permit');

        this.createMapIdToPermission(listPermissions);
    }

    /**
     *
     * @param listPermissions
     */
    createMapIdToPermission(listPermissions) {
        const { permissions } = listPermissions;
        permissions.forEach((perm) => {
            const aliasAction = mapPermissions[perm.path].action;
            const aliasMethod = mapPermissions[perm.path][perm.method].method;
            /*            const alias = `${aliasAction}.${aliasMethod}`;
                        //this.mapAliasPermissionsToId.set(alias, perm.id); */
            const actionMethod = {
                action: aliasAction,
                method: aliasMethod,
            };
            this.mapAliasIdToPermissions.set(perm.id, actionMethod);
            this.mapAliasPermissionsToId.set(actionMethod, perm.id);
        });
    }
}

const groupPermissionsManager = new GroupPermissionsManager();
export default groupPermissionsManager;
