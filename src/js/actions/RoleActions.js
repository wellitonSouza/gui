/* eslint-disable */
import roleManager from '../comms/roles/RoleManager';
import toaster from '../comms/util/materialize';

const alt = require('../alt');

class RoleActions {
    updateGroups(list) {
        return list;
    }

    insertGroup(group) {
        return group;
    }

    addGroup(group, cb, error_cb) {
        const newUser = user;
        return (dispatch) => {
        dispatch();
        roleManager.addGroup(newGroup)
            .then((response) => {
            // @bug: backend won't return full public record of the created user, so merge the
            //       server-side data (id) with the known record of the user.
/*             let updatedGroup = JSON.parse(JSON.stringify(newGroup));
            updatedGroup['id'] = response[0].groups.id;
            updatedGroup['passwd'] = ''; */
            this.insertGroup(newGroup);
            if(cb){
                cb(response);
            }
            })
            .catch((error) => {
            if(error_cb) {
                error_cb(newUser);
            }
            this.usersFailed(error);
            // error.data.json()
                // .then((data) => {
                //   if (error_cb) {
                //     error_cb(data);
                //   }
                // })
            })
        }
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

    triggerUpdate(user, cb, error_cb) {
        return (dispatch) => {
            dispatch();
            // special case (for now): allow edits to not repeat the password
            // if (user.passwd.trim().length === 0) {
            //   delete user.passwd;
            // }

            roleManager.setGroup(grup)
                .then((response) => {
                    this.updateSingle(grup);
                    if (cb) {
                        cb();
                    }
                })
                .catch((error) => {
                    this.groupsFailed(error);
                    // error.data.json()
                    //   .then((data) => {
                    //     if (error_cb) {
                    //       error_cb(data);
                    //     }
                    //   })
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
        return group;
    }

    removeSingle(group) {
        return group;
    }

    groupsFailed(error) {
        toaster.error(error.message);
        return error;
    }
}

const _role = alt.createActions(RoleActions, exports);
export default _role;
