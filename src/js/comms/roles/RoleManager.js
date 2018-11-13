import util from '../util/util';

class RoleManager {
    constructor() {
        this.baseUrl = '/auth/pap/group';
    }

    getGroups() {
        return util.GET(this.baseUrl);
    }


    getGroup(id) {
        return util.GET(`${this.baseUrl}/${id}`);
    }

    setGroup(group) {
        // update
        if (group.id) return util.PUT(`${this.baseUrl}/${group.id}`, group);

        // create
        return util.POST(this.baseUrl, group);
    }

    deleteGroup(id) {
        return util.DELETE(`${this.baseUrl}/${id}`);
    }
}

const roleManager = new RoleManager();
export default roleManager;