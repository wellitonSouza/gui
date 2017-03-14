var alt = require('../alt');

class MenuActions {
  toggleLeft() {
    return true;
  }
}

alt.createActions(MenuActions, exports);
