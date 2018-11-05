const alt = require('../alt');
const RoleActions = require('../actions/RoleActions');

class RoleStore {
    constructor() {
        this.groups = [];
        this.loading = false;
        this.error = null;

        this.bindListeners({
            handleUpdateGroupList: RoleActions.UPDATE_GROUPS,

            handleAddGroup: RoleActions.ADD_GROUP,
            handleInsertGroup: RoleActions.INSERT_GROUP,

            handleFetchGroupList: RoleActions.FETCH_GROUPS,
            handleFailure: RoleActions.GROUPS_FAILED,

            handleTriggerUpdate: RoleActions.TRIGGER_UPDATE,
            handleUpdateSingle: RoleActions.UPDATE_SINGLE,

            handleTriggerRemoval: RoleActions.TRIGGER_REMOVAL,
            handleRemoveSingle: RoleActions.REMOVE_SINGLE,
        });
    }

    handleUpdateGroupList(groups) {
        this.groups = groups;
        this.error = null;
        this.loading = false;
    }

    handleUpdateSingle(group) {
        for (let i = 0; i < this.groups.length; i += 1) {
            if (this.groups[i].id === group.id) {
                const newGroup = JSON.parse(JSON.stringify(group));
                /*  newGroup.password = ''; */
                this.groups[i] = newGroup;
            }
        }
        this.loading = false;
    }

    handleTriggerUpdate() {
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
        /*         this.users = this.users.filter(e => e.id !== id); */
        this.groups = this.groups.filter(e => e.id !== id);
    }

    handleInsertGroup(group) {
        this.groups.push(group);
        this.error = null;
        this.loading = false;
    }

    handleAddGroup() {
        this.error = null;
        this.loading = true;
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

const roleStore = alt.createStore(RoleStore, 'RoleStore');
export default roleStore;
