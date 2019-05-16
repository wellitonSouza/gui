Feature('User Management');

Before((login) => {
    login('admin');
});

const user_data = {
    id: null,
    name: 'john',
    full_name: 'John Obama',
    email: 'john@email.com',
    confirm_email: 'john@email.com',
    profile: 'user',
};

const admin_data = {
    id: null,
    name: 'admin',
    full_name: 'Admin (superuser)',
    email: 'admin@noemail.com',
    confirm_email: 'admin@noemail.com',
    profile: 'admin',
};

function checkingUser(I, data) {
    I.seeInputByNameAndValue('username', data.name);
    I.seeInputByNameAndValue('name', data.full_name);
    I.seeInputByNameAndValue('email', data.email);
    I.seeInputByNameAndValue('confirmEmail', data.confirm_email);
    I.seeSelectOptionByNameAndValue('profile', data.profile);
}

Scenario('Creating a new user', async (I, User, Commons) => {
    User.init(I);
    User.openUserPage();
    User.clickCreateNew();

    I.fillField('username', user_data.name);
    I.fillField('name', user_data.full_name);
    I.fillField('email', user_data.email);
    I.fillField('confirmEmail', user_data.confirm_email);
    I.fillSelectByName('profile', user_data.profile);
    User.clickSave('#create-footer');
    User.seeHasCreated();
});


Scenario('Updating an user', async (I, User, Commons) => {
    User.init(I);
    User.openUserPage();
    Commons.clickCardByName('John Obama');
    I.fillField('email', 'updatedemail@email.com');
    I.fillField('confirmEmail', 'updatedemail@email.com');
    User.clickSave('#edit-footer');
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
