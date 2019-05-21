const mqtt = require('async-mqtt');
const request = require('sync-request');
const env = require('./env.conf');

module.exports = () => {
    let jwt;

    return actor({

        loginAdmin(I, clearDb) {
            I.amOnPage(env.dojot_host);
            I.setEnglishLanghage();
            I.refreshPage();
            I.see('Sign in');
            I.fillField('Username', 'admin');
            I.fillField('Password', 'admin');
            I.click('Login');
            I.wait(3);
            if (clearDb) { I.clearDatabase(); }
            I.refreshPage();
        },

        login(I, username, password, clearDb) {
            I.amOnPage(env.dojot_host);
            I.setEnglishLanghage();
            I.refreshPage();
            I.see('Sign in');
            I.fillField('Username', username);
            I.fillField('Password', password);
            I.click('Login');
            I.wait(3);
            if (clearDb) { I.clearDatabase(); }
            I.refreshPage();
        },

        seeInputByNameAndValue(name, value) {
            this.seeElement(locate('input')
                .withAttr({
                    name,
                    value,
                }));
        },

        seeSelectOptionByNameAndValue(name, value) {
            this.seeElement(locate('select')
                .withAttr({ name }), value);
        },

        fillSelectByName(name, value) {
            this.selectOption(locate('select')
                .withAttr({ name }), value);
        },

        async getJWT() {
            return this.executeScript(() => localStorage.getItem('jwt'));
        },

        async postJSON(resource, myJson, method = 'POST') {
            jwt = await this.executeScript(() => localStorage.getItem('jwt'));

            const response = request(method, `${env.dojot_host}/${resource}`, {
                headers: {
                    Authorization: `Bearer ${jwt}`,
                },
                json: myJson,
            });

            return JSON.parse(response.getBody('utf8'));
        },

        async deleteXHR(resource, querystring) {
            console.log(querystring);
            pause();
            jwt = await this.executeScript(() => localStorage.getItem('jwt'));

            const method = 'DELETE';
            const response = request(method, `${env.dojot_host}/${resource}?${querystring}`, {
                headers: {
                    Authorization: `Bearer ${jwt}`,
                },
                json: myJson,
            });

            return JSON.parse(response.getBody('utf8'));
        },


        async createTemplate(json) {
            return await this.postJSON('template', json);
        },

        async updateTemplate(json, templateID) {
            return await this.postJSON(`template/${templateID}`, json, 'PUT');
        },

        async createDevice(json) {
            return await this.postJSON('device', json);
        },

        async deleteUser(userId) {
            return await this.deleteXHR('auth/user', userId);
        },

        async createUser(json) {
            return await this.postJSON('auth/user', json);
        },


        async clearDatabase() {
            return await this.postJSON('import', {
                devices: [],
                templates: [],
                flows: [],
                flowRemoteNodes: [],
            });
        },

        async setEnglishLanghage() {
            return await this.executeScript(() => localStorage.setItem('i18nextLng', 'en'));
        },

        async sendMQTTMessage(deviceId, message, tenant = 'admin') {
            const client = await mqtt.connect(env.mqtt_host);
            await client.publish(`/${tenant}/${deviceId}/attrs`, message);
            await client.end();
        },

    });
};
