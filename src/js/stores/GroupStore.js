const alt = require('../alt');
const GroupActions = require('../actions/GroupActions');
const GroupPermissionActions = require('../actions/GroupPermissionActions');

const groupEmpty = ({
    name: '',
    description: '',
    id: null,
});

class GroupStore {
    constructor() {
        this.groups = [];
        this.group = groupEmpty;
        this.grouppermissions = {};

        this.loading = false;
        this.error = null;

        this.bindListeners({
            handleUpdateGroupList: GroupActions.UPDATE_GROUPS,
            handleFetchGroupList: GroupActions.FETCH_GROUPS,
            handleFailure: GroupActions.GROUPS_FAILED,
            handleTriggerSave: GroupActions.TRIGGER_SAVE,
            handleTriggerRemoval: GroupActions.TRIGGER_REMOVAL,
            handleGetGroup: GroupActions.getGroupById,

            handleFetchGroupPermissions: GroupPermissionActions.fetchPermissionsForGroups,
            handleTriggerSaveGroupPermissions: GroupPermissionActions.triggerSaveGroupPermissions,
            handleFailureGroupPermissions: GroupPermissionActions.failed,
            handleUpdateGroupPerm: GroupPermissionActions.updateGroupPermission,

        });
    }

    handleGetGroup(groupId) {
        if (groupId) {
            this.group = this.groups.find(g => g.id === Number(groupId));
        } else {
            this.group = groupEmpty;
        }
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

    handleFetchGroupPermissions(groupId) {
        this.grouppermissions = {};
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

    handleUpdateGroupPerm(grouppermissions) {
        this.grouppermissions = grouppermissions;
        this.error = null;
        this.loading = false;
    }
}

const _store = alt.createStore(GroupStore, 'GroupStore');
export default _store;
