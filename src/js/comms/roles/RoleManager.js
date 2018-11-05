/* eslint-disable */
import util from '../util/util';

class RoleManager {
    constructor() {
        this.baseUrl = '/auth/pap/group';
    }

    getGroups() {
        return util.GET(this.baseUrl);
    }

/*     getGroups(name) {
        return util.GET(`${this.baseUrl}?name=${name}`);
    } */

    getGroup(id) {
        return util.GET(`${this.baseUrl}/${id}`);
    }

    setGroup(detail) {
        return util.PUT(`${this.baseUrl}/${detail.id}`, detail);
    }

    addGroup(d) {
        d.id = util.guid();
        return util.POST(this.baseUrl, d);
    }

    deleteGroup(id) {
        return util.DELETE(`${this.baseUrl}/${id}`);
    }
}

const roleManager = new RoleManager();
export default roleManager;
