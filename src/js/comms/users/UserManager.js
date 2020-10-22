import { baseURL } from 'Src/config';
import util from '../util';

class UserManager {
    getUsers() {
        return util.GET(`${baseURL}auth/user`);
    }

    getUser(id) {
        return util.GET(`${baseURL}auth/user/${id}`);
    }

    setUser(detail) {
        return util.PUT(`${baseURL}auth/user/${detail.id}`, detail);
    }

    addUser(d) {
        d.id = util.guid();
        return util.POST(`${baseURL}auth/user`, d);
    }

    deleteUser(id) {
        return util.DELETE(`${baseURL}auth/user/${id}`);
    }

    setIcon(id, icon) {
        const data = new FormData();
        data.append('icon', icon);
        const config = { method: 'put', body: data };
        return util._runFetch(`${baseURL}auth/user/user/${id}/icon`, config);
    }
}

const userManager = new UserManager();
export default userManager;
