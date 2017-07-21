import userManager from '../comms/users/UserManager';

var alt = require('../alt');

// TODO remove this
function fakeFetch() {
  return new Promise(function(resolve, reject) {
    setTimeout(function() {
      resolve();
    }, 250);
  });
}

class UserActions {

  updateUsers(list) {
    return list;
  }

  insertUser(user) {
    return user;
  }

  addUser(user) {
    const newUser = user;
    return (dispatch) => {
      dispatch();
      userManager.addUser(newUser)
        .then((response) => {
          this.insertUser(response.user);
        })
        .catch((error) => {
          this.usersFailed("Failed to add User to list");
        })
    }
  }

  fetchUsers() {
    return (dispatch) => {
      dispatch()
      userManager.getUsers()
        .then((userList) => {
          this.updateUsers(userList.users);
        })
        .catch((error) => {
          this.usersFailed(error);
        });
    }
  }

  triggerUpdate(user) {
    return (dispatch) => {
      dispatch()
      userManager.setUser(user)
        .then((response) => {
          this.updateSingle(user);
        })
        .catch((error) => {
          this.usersFailed("Failed to update given user");
        })
    }
  }

  triggerRemoval(user, cb) {
    return (dispatch) => {
      dispatch()
      userManager.deleteUser(user.id)
        .then((response) => {
          this.removeSingle(user.id);
          if(cb){
            cb(response);
          }
        })
        .catch((error) => {
          const msg = "Failed to remove given user";
          this.usersFailed(msg);
        })
    }
  }

  updateSingle(user) {
    return user;
  }

  removeSingle(user) {
    return user;
  }

  usersFailed(error) {
    return error;
  }
}

alt.createActions(UserActions, exports);
