const alt = require('../alt');
const GroupActions = require('../actions/GroupActions');
const GroupPermissionActions = require('../actions/GroupPermissionActions');

class GroupStore {
    constructor() {
        this.groups = [];
        this.grouppermissions = [];
        this.systempermissions = [];
        this.loading = false;
        this.error = null;

        this.bindListeners({
            handleUpdateGroupList: GroupActions.UPDATE_GROUPS,
            handleFetchGroupList: GroupActions.FETCH_GROUPS,
            handleFailure: GroupActions.GROUPS_FAILED,
            handleTriggerSave: GroupActions.TRIGGER_SAVE,
            handleTriggerRemoval: GroupActions.TRIGGER_REMOVAL,

            handleUpdateGroupPermissions: GroupPermissionActions.updateGroupPermissions,
            handleUpdateSystemPermissions: GroupPermissionActions.updateSystemPermissions,
            handleFetchGroupPermissions: GroupPermissionActions.fetchPermissionsForGroups,
            handleFetchSystemPermissions: GroupPermissionActions.fetchSystemPermissions,
            handleTriggerSaveGroupPermissions: GroupPermissionActions.triggerSaveGroupPermissions,
            handleFailureGroupPermissions: GroupPermissionActions.failed,
            handleLoadSystemPermissions: GroupPermissionActions.loadSystemPermissions,

        });
    }

    handleUpdateGroupList(groups) {
        this.groups = groups;
        this.error = null;
        this.loading = false;
    }

    handleFetchGroupList() {
        this.groups = [];
        this.loading = true;
    }

    handleFailure(error) {
        this.error = error;
        this.loading = false;
    }

    handleTriggerSave() {
        // trigger handler for updateSingle
        this.error = null;
        this.loading = true;
    }

    handleTriggerRemoval() {
        // trigger handler for removeSingle
        this.error = null;
        this.loading = true;
    }

    /* *
     *  Permissions
     * */

    handleUpdateGroupPermissions(groupPermissions) {
        this.grouppermissions = groupPermissions;
        this.error = null;
        this.loading = false;
    }

    handleUpdateSystemPermissions(systemPermissions) {
        this.systempermissions = systemPermissions;
        this.error = null;
        this.loading = false;
    }

    handleFetchGroupPermissions() {
        this.grouppermissions = [];
        this.loading = true;
    }

    handleFetchSystemPermissions() {
        this.systempermissions = [];
        this.loading = true;
    }

    handleTriggerSaveGroupPermissions() {
        // trigger handler for updateSingle
        this.error = null;
        this.loading = true;
    }

    handleFailureGroupPermissions(error) {
        this.error = error;
        this.loading = false;
    }

    handleLoadSystemPermissions() {
        this.error = null;
        this.loading = true;
    }
}

const _store = alt.createStore(GroupStore, 'GroupStore');
export default _store;
