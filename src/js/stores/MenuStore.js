/* eslint-disable */
const alt = require('../alt');
const MenuActions = require('../actions/MenuActions');

class MenuStore {
    constructor() {
    const width =
        window.innerWidth ||
        document.documentElement.clientWidth ||
        document.body.clientWidth;
        if (width>900) {
            this.leftSideBar = { open: true }; 
        } else {
            this.leftSideBar = { open: false };
        }       

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
