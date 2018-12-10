import util from '../util/util';

class GroupPermissionsManager {
    constructor() {
        this.baseUrlPermissions = '/auth/pap/permission';
        this.baseUrlManagerGroupPermissions = '/auth/pap/grouppermissions';
        this.baseUrlListGroupPermissions = '/auth/pap/group';

        this.loadSystemPermissions();
    }

    /**
     * Search permissions associate with a group
     * @param groupName
     * @returns {*}
     */
    getGroupPermissions(groupName) {
        ///groupName will be groupId
        return util.GET(`${this.baseUrlListGroupPermissions}/${groupName}/permissions`);
    }


    /**
     * Create a group associate between group and permission
     *
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
        // const typePermission = 'system';
        // const listPermissions = util.GET(`${this.baseUrlPermissions}?${typePermission}`);
        return util.GET('http://localhost:8000/auth/pap/permission?path=/device/(.*)&method=(.*)&permission=permit');
    }

}

const groupPermissionsManager = new GroupPermissionsManager();
export default groupPermissionsManager;
