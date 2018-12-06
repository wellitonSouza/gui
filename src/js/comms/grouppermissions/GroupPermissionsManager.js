import util from '../util/util';
import MapPermissions from './MapPermissions.json';

class GroupPermissionsManager {
    constructor() {
        this.baseUrlPermissions = '/pap/permission';
        this.baseUrlGroupPermissions = '/pap/grouppermissions';
    }

    createPermission(permission, groupId) {
        const permissionId = MapPermissions[permission.action][permission.operation];
        return util.POST(`${this.baseUrlGroupPermissions}/${groupId}/${permissionId}`, '');
    }

    deletePermission(permission, groupId) {
        const permissionId = MapPermissions[permission.action][permission.operation];
        return util.DELETE(`${this.baseUrlGroupPermissions}/${groupId}/${permissionId}`);
    }

    loadAvaliablesSystemPermissons() {
        const typePermission = 'system';
        return util.GET(`${this.baseUrlPermissions}?${typePermission}`);
    }
}

const groupPermissionsManager = new GroupPermissionsManager();
export default groupPermissionsManager;
