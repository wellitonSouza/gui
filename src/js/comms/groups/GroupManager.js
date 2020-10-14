import { baseURL } from 'Src/config';
import util from '../util/util';

class GroupManager {
    getGroups() {
        return util.GET(`${baseURL}auth/pap/group`);
    }

    getGroup(id) {
        return util.GET(`${baseURL}auth/pap/group/${id}`);
    }

    setGroup(group) {
        // update
        if (group.id) return util.PUT(`${baseURL}auth/pap/group/${group.id}`, group);

        // create
        return util.POST(`${baseURL}auth/pap/group`, group);
    }

    deleteGroup(id) {
        return util.DELETE(`${baseURL}auth/pap/group/${id}`);
    }
}

const groupManager = new GroupManager();
export default groupManager;
