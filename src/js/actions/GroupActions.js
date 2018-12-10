import groupManager from '../comms/groups/GroupManager';
import toaster from '../comms/util/materialize';

const alt = require('../alt');

class GroupActions {
    constructor() {
        this.groups = [];
        this.group = null;
        this.error = null;
    }

    updateGroups(groups) {
        this.groups = groups;
        return this.groups;
    }

    insertGroup(group) {
        this.group = group;
        return group;
    }

    fetchGroups() {
        return (dispatch) => {
            dispatch();
            groupManager.getGroups()
                .then((groupList) => {
                    this.updateGroups(groupList.groups);
                })
                .catch((error) => {
                    this.groupsFailed(error);
                });
        };
    }

    getGroupById(groupId) {
        return this.groups.find(g => g.id === Number(groupId));
    }

    triggerSave(group, cb, errorCb) {
        return (dispatch) => {
            dispatch();
            groupManager.setGroup(group)
                .then((response) => {
                    this.updateSingle(group);
                    if (cb) {
                        cb(response);
                    }
                })
                .catch((error) => {
                    if (errorCb) {
                        errorCb(group);
                    }
                    this.groupsFailed(error);
                });
        };
    }

    triggerRemoval(groupId, cb) {
        return (dispatch) => {
            dispatch();
            groupManager.deleteGroup(groupId)
                .then((response) => {
                    this.removeSingle(groupId);
                    if (cb) {
                        cb(response);
                    }
                })
                .catch((error) => {
                    this.groupsFailed(error);
                });
        };
    }

    updateSingle(group) {
        this.group = group;
        return group;
    }

    removeSingle(group) {
        this.group = group;
        return group;
    }

    groupsFailed(error) {
        this.error = error;
        toaster.error(this.error.message);
        return this.error;
    }
}

const groupAction = alt.createActions(GroupActions, exports);
export default groupAction;
