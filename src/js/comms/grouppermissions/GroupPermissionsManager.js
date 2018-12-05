import util from '../util/util';
import mapPermissions from './mapPermissions.json';

class GroupPermissionsManager {
    constructor() {
        this.baseUrl = '/pap/grouppermissions';
    }

    createPermission(permission, groupId) {
        const permissionId = mapPermissions[permission.action][permission.operation];

        return util.POST(`${this.baseUrl}/${groupId}/${permissionId}`, '');
    }

    deletePermission(permission, groupId) {
        const permissionId = mapPermissions[permission.action][permission.operation];
        return util.DELETE(`${this.baseUrl}/${groupId}/${permissionId}`);
    }
}

const groupPermissionsManager = new PermissionsManager();
export default groupPermissionsManager;
