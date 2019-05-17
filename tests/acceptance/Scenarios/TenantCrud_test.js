const Utils = require('../Utils');

Feature('Tenant verification');

Before((login) => {
    login('admin');
});

const userA = {
    name: 'Allan Basic',
    username: `a${Utils.sid()}`,
    service: `a${Utils.sid()}`,
    email: `${Utils.sid()}@noemail.com`,
    profile: 'admin',
};

const userB = {
    name: 'Boris Basic',
    username: `b${Utils.sid()}`,
    service: `b${Utils.sid()}`,
    email: `${Utils.sid()}@noemail.com`,
    profile: 'admin',
};

const jsonTemplate = {
    label: 'String Template',
    attrs: [
        {
            label: 'text',
            type: 'dynamic',
            value_type: 'string',
        },
    ],
};


async function CreateTemplateAndDeviceByJSON(I, templ, dev) {
    const template = await I.createTemplate(templ);
    const templateId = template.template.id;
    const device = await I.createDevice({
        templates: [templateId],
        label: dev,
    });
    I.wait(1);
    return device.devices[0].id;
}

function checkMessage(I, Device, deviceId, msg) {
    I.amOnPage(`#/device/id/${deviceId}/detail`);
    I.wait(2);
    Device.selectAttr('text');
    I.wait(3);
    Device.shouldSeeMessage(msg);
}

function checkingTenant(I, tenant) {
    I.click(locate('div').withAttr({ title: 'Login details' }));
    I.seeElement(locate('.logout-page-info').withText(tenant));
    I.click(locate('div').withAttr({ title: 'Login details' }));
}

function logout(I) {
    I.click(locate('div').withAttr({ title: 'Login details' }));
    I.click('.btn-logout');
    I.wait(3);
}

function genericLogin(I, username, pass = 'temppwd') {
    logout(I);
    I.see('Sign in');
    I.fillField('Username', username);
    I.fillField('Password', pass);
    I.click('Login');
    I.wait(3);
}

/*
    This scenario checks if a new user inherits the parent's tenant. Besides that, checks when an admin changes the user metadata, the tenant still the same.
*/

Scenario('Checking child tenant equals parent tenant', async (I, Commons, User) => {
    // Create a user A using API with a different tenant
    // 1. create User A
    await I.createUser(userA);

    // Logout and Login user A
    genericLogin(I, userA.username);

    // Create via GUI user B
    User.init(I);
    User.openUserPage();
    User.clickCreateNew();
    User.fillAndSave(userB);
    User.seeHasCreated();

    // Logout and Login user B
    genericLogin(I, userB.username);

    // Check with user B has the same tenant than user A
    checkingTenant(I, userA.service);

    // Login admin
    genericLogin(I, 'admin', 'admin');

    // Edit user B
    User.openUserPage();
    Commons.clickCardByName(userB.name);
    User.fillEmailAndSave('updatedemail@email.com');
    User.seeHasUpdated();

    // Logout and Login user B
    genericLogin(I, userB.username);

    // Check with user B has the same tenant than user A
    checkingTenant(I, userA.service);
});



Scenario('Checking message in 2 tenants', async (I, Commons, Device) => {
    Device.init(I);
    const deviceA = 'device A';
    const deviceB = 'device B';
    let deviceId = 0;
    // 1. create User A
    await I.createUser(userA);

    // 2. create User B
    await I.createUser(userB);

    // 3 .Login user A
    genericLogin(I, userA.username);

    // 4. create Template and Device for User A
    const templateA = jsonTemplate;
    templateA.label = 'template A';
    deviceId = await CreateTemplateAndDeviceByJSON(I, templateA, deviceA);

    // 5. Checking devices
    Device.clickOpenDevicePage();
    I.refreshPage();
    Device.checkExistCard(deviceA);
    Device.checkNonExistCard(deviceB);

    // 6. Send Message in User A device, to go detail page and check the message
    await I.sendMQTTMessage(deviceId, '{"text": "data A"}', userA.service);
    checkMessage(I, Device, deviceId, 'data A');

    // 7. login User B
    genericLogin(I, userB.username);

    // 8. create Template and Device for User B
    const templateB = jsonTemplate;
    templateB.label = 'template B';
    deviceId = await CreateTemplateAndDeviceByJSON(I, templateB, deviceB);

    // 9. Checking devices
    Device.clickOpenDevicePage();
    I.refreshPage();
    Device.checkExistCard(deviceB);
    Device.checkNonExistCard(deviceA);

    // 10. Send Message in User B device, to go detail page and check the message
    await I.sendMQTTMessage(deviceId, '{"text": "data B"}', userB.service);
    checkMessage(I, Device, deviceId, 'data B');
});

