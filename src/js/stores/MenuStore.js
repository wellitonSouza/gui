const alt = require('../alt');
const MenuActions = require('../actions/MenuActions');

class MenuStore {
    constructor() {
        this.leftSideBar = { open: true };

        this.bindListeners({
            toggleLeftSideBar: MenuActions.TOGGLE_LEFT,
        });
    }

    toggleLeftSideBar() {
        this.leftSideBar.open = !this.leftSideBar.open;
    }
}

const _store = alt.createStore(MenuStore, 'MenuStore');
export default _store;
