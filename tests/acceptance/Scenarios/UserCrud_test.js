const Utils = require('../Utils');

Feature('User Management');

Before((login) => {
    login('admin');
});

const user_data = {
    id: null,
    username: 'john',
    name: 'John Obama',
    email: `${Utils.sid()}@noemail.com`,
    profile: 'user',
};

const admin_data = {
    id: null,
    username: 'admin',
    name: 'Admin (superuser)',
    email: 'admin@noemail.com',
    profile: 'admin',
};


function checkingUser(I, data) {
    I.seeInputByNameAndValue('username', data.username);
    I.seeInputByNameAndValue('name', data.name);
    I.seeInputByNameAndValue('email', data.email);
    I.seeInputByNameAndValue('confirmEmail', data.email);
    I.seeSelectOptionByNameAndValue('profile', data.profile);
}

Scenario('Creating a new user', async (I, User) => {
    User.init(I);
    User.openUserPage();
    User.clickCreateNew();
    User.fillAndSave(user_data);
    User.seeHasCreated();
});


Scenario('Updating an user', async (I, User, Commons) => {
    User.init(I);
    User.openUserPage();
    Commons.clickCardByName('John Obama');
    User.fillEmailAndSave(`${Utils.sid()}@noemail.com`);
    User.seeHasUpdated();
});

Scenario('Checking the admin user', async (I, User, Commons) => {
    User.init(I);
    User.openUserPage();

    Commons.clickCardByName('Admin (superuser)');
    checkingUser(I, admin_data);
    Commons.clickDiscard();
});


Scenario('Removing an user', async (I, User, Commons) => {
    User.init(I);
    User.openUserPage();
    Commons.clickCardByName('john');
    Commons.clickRemove();
    User.confirmRemove();
    User.seeHasRemoved();
});
