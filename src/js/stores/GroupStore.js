const alt = require('../alt');
const GroupActions = require('../actions/GroupActions');

class GroupStore {
    constructor() {
        this.groups = [];
        this.loading = false;
        this.error = null;

        this.bindListeners({
            handleUpdateGroupList: GroupActions.UPDATE_GROUPS,

            handleFetchGroupList: GroupActions.FETCH_GROUPS,
            handleFailure: GroupActions.GROUPS_FAILED,

            handleTriggerSave: GroupActions.TRIGGER_SAVE,

            handleTriggerRemoval: GroupActions.TRIGGER_REMOVAL,
            handleRemoveSingle: GroupActions.REMOVE_SINGLE,
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
}

const groupStore = alt.createStore(GroupStore, 'GroupStore');
export default groupStore;
