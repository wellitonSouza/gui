var alt = require('../alt');
var MenuActions = require('../actions/MenuActions');

class MenuStore {
  constructor() {

    this.leftSideBar = { open: true };

    this.bindListeners({
      toggleLeftSideBar: MenuActions.TOGGLE_LEFT
    });
  }

  toggleLeftSideBar() {
    this.leftSideBar.open = !this.leftSideBar.open;
  }
}

var _store =  alt.createStore(MenuStore, 'MenuStore');
export default _store;
