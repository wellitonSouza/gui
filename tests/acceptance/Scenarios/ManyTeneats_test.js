Feature('Para');

/*
Before((login) => {
    /!*login('admin');*!/
});
*/


const userObj = id => ({
    username: `user${id}`,
    service: `user${id}`,
    email: `user${id}@noemail.com`,
    name: `user${id}`,
    profile: 'admin',
});

const jsonTemplate = {
    label: 'String Template',
    attrs: [
        {
            label: 'text',
            type: 'dynamic',
            value_type: 'string',
        },
        {
            label: 'protocol',
            type: 'static',
            value_type: 'string',
            static_value: 'mqtt',
        },
    ],
};

/* const accounts = new DataTable(['username']); //
accounts.add([userObj('1').username]);
accounts.add([userObj('2').username]);
accounts.add([userObj('3').username]);

Data(accounts).Scenario('@adv: Watching a simple message', async (I, Device, current) => {
    await I.login(I, current.username, 'temppwd', false);

    const template = await I.createTemplate(jsonTemplate);
    const templateId = template.template.id;
    const device = await I.createDevice({
        templates: [
            templateId,
        ],
        label: 'String device',
    });
    const deviceId = device.devices[0].id;
    const msg = 'my string';

    await I.sendMQTTMessage(deviceId, `{"text": "${msg}"}`, current.username);

    I.amOnPage(`#/device/id/${deviceId}/detail`);
    I.wait(2);
    Device.selectAttr('text');
    I.wait(3);
    Device.shouldSeeMessage(msg);
}); */

const current = {
    username: process.env.USERNAME,
};

Scenario('@adv: Watching a simple message', async (I, Device) => {
    await I.login(I, current.username, 'admin', false);
    const template = await I.createTemplate(jsonTemplate);
    const templateId = template.template.id;
    const device = await I.createDevice({
        templates: [
            templateId,
        ],
        label: 'String device',
    });
    const deviceId = device.devices[0].id;
    const msg = 'my string';

    await I.sendMQTTMessage(deviceId, `{"text": "${msg}"}`);

    I.amOnPage(`#/device/id/${deviceId}/detail`);
    I.wait(2);
    Device.selectAttr('text');
    I.wait(3);
    Device.shouldSeeMessage(msg);
});
