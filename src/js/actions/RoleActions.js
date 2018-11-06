import roleManager from '../comms/roles/RoleManager';
import toaster from '../comms/util/materialize';

const alt = require('../alt');

class RoleActions {
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

    addGroup(group, cb, errorCb) {
        const newGroup = group;
        return (dispatch) => {
            dispatch();
            roleManager.addGroup(newGroup)
                .then((response) => {
                    this.insertGroup(newGroup);
                    if (cb) {
                        cb(response);
                    }
                })
                .catch((error) => {
                    if (errorCb) {
                        errorCb(newGroup);
                    }
                    this.groupsFailed(error);
                });
        };
    }

    fetchGroups() {
        return (dispatch) => {
            dispatch();
            roleManager.getGroups()
                .then((groupList) => {
                    this.updateGroups(groupList.groups);
                })
                .catch((error) => {
                    this.groupsFailed(error);
                });
        };
    }

    triggerUpdate(group, cb, errorCb) {
        return (dispatch) => {
            dispatch();
            roleManager.setGroup(group)
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

    triggerRemoval(group, cb) {
        return (dispatch) => {
            dispatch();
            roleManager.deleteGroup(group.id)
                .then((response) => {
                    this.removeSingle(group.id);
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

const roleAction = alt.createActions(RoleActions, exports);
export default roleAction;
