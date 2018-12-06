import util from '../util/util';
import mapPermissions from './MapPermissions.json';

class GroupPermissionsManager {
    constructor() {
        this.baseUrlPermissions = '/auth/pap/permission';
        this.baseUrlManagerGroupPermissions = '/auth/pap/grouppermissions';
        this.baseUrlListGroupPermissions = '/auth/pap/group';
    }

    /**
     * Search permissions associate with a group
     * @param groupName
     * @returns {*}
     */
    getGroupPermissions(groupName) {
        return util.GET(`${this.baseUrlListGroupPermissions}/${groupName}/permissions`);
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
    deletePermission(permissionId, groupId) {
        return util.DELETE(`${this.baseUrlManagerGroupPermissions}/${groupId}/${permissionId}`);
    }

    /**
     * Search defaults Permissions of system
     * @returns {*}
     */
    loadSystemPermissions() {
        const typePermission = 'system';
        const listPermissions = util.GET(`${this.baseUrlPermissions}?${typePermission}`);
        const mappedPermissions = JSON.parse(JSON.stringify(mapPermissions));

        listPermissions.forEach((perm) => {
            mappedPermissions[perm.path][perm.method].permissionId = perm.id;
        });

        return mappedPermissions;
    }
}

const groupPermissionsManager = new GroupPermissionsManager();
export default groupPermissionsManager;
