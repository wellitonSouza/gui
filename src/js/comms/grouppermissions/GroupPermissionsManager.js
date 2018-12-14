import util from '../util/util';

class GroupPermissionsManager {
    constructor() {
        this.baseUrlPermissions = '/auth/pap/permission';
        this.baseUrlManagerGroupPermissions = '/auth/pap/grouppermissions';
        this.baseUrlListGroupPermissions = '/auth/pap/group';
    }

    /**
     * Search permissions associate with a group
     * @param groupId
     * @returns {*}
     */
    getGroupPermissions(groupId) {
        return util.GET(`${this.baseUrlListGroupPermissions}/${groupId}/permissions`);
    }


    /**
     * Create a group associate between group and permission
     * @param permissionId
     * @param groupId
     * @returns {*}
     */
    createGroupPermission(permissionId, groupId) {
        return util.POST(`${this.baseUrlManagerGroupPermissions}/${groupId}/${permissionId}`, '');
    }

    /**
     * Remove a group associate between group and permission
     *
     * @param permissionId
     * @param groupId
     * @returns {*}
     */
    deleteGroupPermission(permissionId, groupId) {
        return util.DELETE(`${this.baseUrlManagerGroupPermissions}/${groupId}/${permissionId}`);
    }

    /**
     * Search defaults Permissions of system
     *
     * @returns {WeakMap<object, any>} Map between alias, action.method, to id of permission.
     */
    loadSystemPermissions() {
        return util.GET(`${this.baseUrlPermissions}?type=system`);
    }
}

const groupPermissionsManager = new GroupPermissionsManager();
export default groupPermissionsManager;
