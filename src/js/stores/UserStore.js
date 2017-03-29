var alt = require('../alt');
var UserActions = require('../actions/UserActions');

import util from '../comms/util';

class UserStore {
  constructor() {
    this.users = [];
    this.error = null;

    this.bindListeners({
      handleUpdateUserList: UserActions.UPDATE_USERS,

      handleAddUser: UserActions.ADD_USER,
      handleInsertUser: UserActions.INSERT_USER,

      handleFetchUserList: UserActions.FETCH_USERS,
      handleFailure: UserActions.USERS_FAILED,

      handleTriggerUpdate: UserActions.TRIGGER_UPDATE,
      handleUpdateSingle: UserActions.UPDATE_SINGLE,

      handleTriggerRemoval: UserActions.TRIGGER_REMOVAL,
      handleRemoveSingle: UserActions.REMOVE_SINGLE
    });
  }

  handleUpdateUserList(users) {
    this.users = users;
    this.error = null;
  }

  handleUpdateSingle(user) {
    for (let i = 0; i < this.users.length; i++) {
      if (this.users[i].id == user.id) {
        let newUser = JSON.parse(JSON.stringify(user))
        this.users[i] = newUser;
      }
    }
  }

  handleTriggerUpdate(user) {
    // trigger handler for updateSingle
    this.error = null;
  }

  handleTriggerRemoval(user) {
    // trigger handler for updateSingle
    this.error = null;
  }

  handleRemoveSingle(id) {
    this.users = this.users.filter(function(e) {
      return e.id != id;
    })
  }

  handleInsertUser(user) {
    this.users.push(user);
    this.error = null;
  }

  handleAddUser(newUser) {
    // this is actually just a intermediary while addition happens asynchonously
    this.error = null;
  }

  handleFetchUserList() {
    this.users = [];
  }

  handleFailure(error) {
    this.error = error;
  }
}

var _store =  alt.createStore(UserStore, 'UserStore');
export default _store;
