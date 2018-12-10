const alt = require('../alt');
const GroupActions = require('../actions/GroupActions');
const GroupPermissionActions = require('../actions/GroupPermissionActions');

class GroupStore {
    constructor() {
        this.groups = [];
        this.loading = false;
        this.error = null;
        this.groupPermissions = {};

        this.bindListeners({
            handleUpdateGroupList: GroupActions.UPDATE_GROUPS,

            handleFetchGroupList: GroupActions.FETCH_GROUPS,
            handleFailure: GroupActions.GROUPS_FAILED,

            handleTriggerSave: GroupActions.TRIGGER_SAVE,

            handleTriggerRemoval: GroupActions.TRIGGER_REMOVAL,
            handleRemoveSingle: GroupActions.REMOVE_SINGLE,


            handleUpdateGroupPermissions: GroupPermissionActions.UPDATE_GROUPS,
            handleFetchGroupPermissions: GroupPermissionActions.FETCH_PERMISSIONS_FOR_GROUPS,
            handleFailure2: GroupPermissionActions.FAILED,
            handleTriggerSave2: GroupPermissionActions.TRIGGER_SAVE_GROUP_PERMISSIONS,
            handleLoadTypeSystemPermissionsSave: GroupPermissionActions.LOAD_SYSTEM_PERMISSIONS,
        });
    }

    handleUpdateGroupList(groups) {
        this.groups = groups;
        this.error = null;
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

    handleRemoveSingle(id) {
        this.loading = false;
        this.groups = this.groups.filter(e => e.id !== id);
    }

    handleInsertGroup(group) {
        this.groups.push(group);
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

    handleTriggerSave2() {
        // trigger handler for updateSingle
        this.error = null;
        this.loading = true;
    }

    handleFailure2(error) {
        this.error = error;
        this.loading = false;
    }
}

const _store = alt.createStore(GroupStore, 'GroupStore');
export default _store;
