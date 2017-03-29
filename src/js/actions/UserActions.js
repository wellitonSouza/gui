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
    // TODO: remove this
    return [
      {id: "0",  name: "Hermes", lastName: "Junior", email:"hjunior@cpqd.com.br", username:"hjunior", passwd:"111111", service:"path/file"},
      {id: "1",  name: "Francisco", lastName: "Angelo", email:"fangelo@cpqd.com.br", username:"fangelo", passwd:"111111", service:"path/file"},
      {id: "2",  name: "Matheus", lastName: "Magalhães", email:"matheusr@cpqd.com.br", username:"matheusr", passwd:"111111", service:"path/file"},
      {id: "3",  name: "Leonardo", lastName: "Mariote", email:"lmariote@cpqd.com.br", username:"lmariote", passwd:"111111", service:"path/file"},
      {id: "4",  name: "Francisco", lastName: "Angelo", email:"fangelo@cpqd.com.br", username:"fangelo", passwd:"111111", service:"path/file"},
      {id: "5",  name: "Matheus", lastName: "Magalhães", email:"matheusr@cpqd.com.br", username:"matheusr", passwd:"111111", service:"path/file"},
      {id: "6",  name: "Leonardo", lastName: "Mariote", email:"lmariote@cpqd.com.br", username:"lmariote", passwd:"111111", service:"path/file"},
      {id: "7",  name: "Francisco", lastName: "Angelo", email:"fangelo@cpqd.com.br", username:"fangelo", passwd:"111111", service:"path/file"},
      {id: "8",  name: "Matheus", lastName: "Magalhães", email:"matheusr@cpqd.com.br", username:"matheusr", passwd:"111111", service:"path/file"},
      {id: "9",  name: "Leonardo", lastName: "Mariote", email:"lmariote@cpqd.com.br", username:"lmariote", passwd:"111111", service:"path/file"},
      {id: "10", name: "Hermes", lastName: "Junior", email:"hjunior@cpqd.com.br", username:"hjunior", passwd:"111111", service:"path/file"},
      {id: "11", name: "Francisco", lastName: "Angelo", email:"fangelo@cpqd.com.br", username:"fangelo", passwd:"111111", service:"path/file"},
      {id: "12", name: "Matheus", lastName: "Magalhães", email:"matheusr@cpqd.com.br", username:"matheusr", passwd:"111111", service:"path/file"},
      {id: "13", name: "Leonardo", lastName: "Mariote", email:"lmariote@cpqd.com.br", username:"lmariote", passwd:"111111", service:"path/file"},
      {id: "14", name: "Francisco", lastName: "Angelo", email:"fangelo@cpqd.com.br", username:"fangelo", passwd:"111111", service:"path/file"},
      {id: "15", name: "Matheus", lastName: "Magalhães", email:"matheusr@cpqd.com.br", username:"matheusr", passwd:"111111", service:"path/file"},
      {id: "16", name: "Leonardo", lastName: "Mariote", email:"lmariote@cpqd.com.br", username:"lmariote", passwd:"111111", service:"path/file"},
      {id: "17", name: "Francisco", lastName: "Angelo", email:"fangelo@cpqd.com.br", username:"fangelo", passwd:"111111", service:"path/file"},
      {id: "18", name: "Matheus", lastName: "Magalhães", email:"matheusr@cpqd.com.br", username:"matheusr", passwd:"111111", service:"path/file"},
      {id: "19", name: "Leonardo", lastName: "Mariote", email:"lmariote@cpqd.com.br", username:"lmariote", passwd:"111111", service:"path/file"},
      {id: "20", name: "Hermes", lastName: "Junior", email:"hjunior@cpqd.com.br", username:"hjunior", passwd:"111111", service:"path/file"},
      {id: "21", name: "Francisco", lastName: "Angelo", email:"fangelo@cpqd.com.br", username:"fangelo", passwd:"111111", service:"path/file"},
      {id: "22", name: "Matheus", lastName: "Magalhães", email:"matheusr@cpqd.com.br", username:"matheusr", passwd:"111111", service:"path/file"},
      {id: "23", name: "Leonardo", lastName: "Mariote", email:"lmariote@cpqd.com.br", username:"lmariote", passwd:"111111", service:"path/file"},
      {id: "24", name: "Francisco", lastName: "Angelo", email:"fangelo@cpqd.com.br", username:"fangelo", passwd:"111111", service:"path/file"},
      {id: "25", name: "Matheus", lastName: "Magalhães", email:"matheusr@cpqd.com.br", username:"matheusr", passwd:"111111", service:"path/file"},
      {id: "26", name: "Leonardo", lastName: "Mariote", email:"lmariote@cpqd.com.br", username:"lmariote", passwd:"111111", service:"path/file"},
      {id: "27", name: "Francisco", lastName: "Angelo", email:"fangelo@cpqd.com.br", username:"fangelo", passwd:"111111", service:"path/file"},
      {id: "28", name: "Matheus", lastName: "Magalhães", email:"matheusr@cpqd.com.br", username:"matheusr", passwd:"111111", service:"path/file"}
    ]

    return list;
  }

  insertUser(user) {
    return user;
  }

  addUser(user) {
    const newUser = user;
    return (dispatch) => {

      // TODO remove this!
      dispath();

      // fakeFetch(newUser)
      // setTimeout(function() {
      //   this.insertUser(newUser);
      // }, 10);

      fakeFetch()
      // TODO add this back!
      // userManager.addUser(newUser)
        .then((response) => {
          this.insertUser(newUser);
        })
        .catch((error) => {
          this.usersFailed("Failed to add User to list");
        })
    }
  }

  fetchUsers() {
    return (dispatch) => {

      // TODO remove this!
      dispatch()

      // new Promise()
      // setTimeout(function () {
      //   this.updateUsers([]);
      // }, 10);


      // TODO add this back!
      // userManager.getUsers()
      fakeFetch()
        .then((userList) => {
          console.log("Users webservice done");
          this.updateUsers([]);
          // this.updateUsers(userList.users);
        })
        .catch((error) => {
          this.usersFailed(error);
        });
    }
  }

  triggerUpdate(user) {
    return (dispatch) => {
      // TODO remove this!
      dispatch()
      setTimeout(function () {
        this.updateSingle(user);
      }, 10);


      // TODO add this back!
      // userManager.setUser(user)
      //   .then((response) => {
      //     this.updateSingle(user);
      //   })
      //   .catch((error) => {
      //     console.log("Error!", error);
      //     this.usersFailed("Failed to update given user");
      //   })
    }
  }

  triggerRemoval(user) {
    return (dispatch) => {
      // TODO remove this!
      dispatch()
      setTimeout(function () {
        this.removeSingle(user.id);
      }, 10);


      // TODO add this back!
      // userManager.deleteUser(user.id)
      //   .then((response) => {
      //     this.removeSingle(user.id);
      //   })
      //   .catch((error) => {
      //     console.log("Error!", error);
      //     this.usersFailed("Failed to remove given user");
      //   })
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
