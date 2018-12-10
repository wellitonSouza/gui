const alt = require('../alt');
const GroupPermissionActions = require('../actions/GroupPermissionActions');

class GroupPermissionStore {
    constructor() {
        this.groupPermissions = {};
        this.loading = false;
        this.error = null;

        this.bindListeners({
            handleUpdateGroupPermissions: GroupPermissionActions.UPDATE_GROUPS,
            handleFetchGroupPermissions: GroupPermissionActions.FETCH_PERMISSIONS_FOR_GROUPS,
            handleFailure: GroupPermissionActions.FAILED,
            handleTriggerSave: GroupPermissionActions.TRIGGER_SAVE_GROUP_PERMISSIONS,
            handleLoadTypeSystemPermissionsSave: GroupPermissionActions.LOAD_SYSTEM_PERMISSIONS,


        });
    }

    handleLoadTypeSystemPermissionsSave() {
        this.error = null;
        this.loading = true;
    }

    handleFetchGroupPermissions() {
        this.groupPermissions = {};
        this.loading = true;
    }

    handleUpdateGroupPermissions(groupPermissions) {
        this.groupPermissions = groupPermissions;
        this.error = null;
        this.loading = false;
    }

    handleTriggerSave() {
        // trigger handler for updateSingle
        this.error = null;
        this.loading = true;
    }

    handleFailure(error) {
        this.error = error;
        this.loading = false;
    }
}

/*
const _store = alt.createStore(GroupPermissionStore, 'GroupPermissionStore');
export default _store;
*/

