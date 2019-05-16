let I = actor();

module.exports = {


    init(i) {
        I = i;
    },

    fillEmailAndSave(email) {
        I.fillField('email', email);
        I.fillField('confirmEmail', email);
        this.clickSave('#edit-footer');
    },

    fillAndSave(user) {
        I.fillField('username', user.username);
        I.fillField('name', user.name);
        I.fillField('email', user.email);
        I.fillField('confirmEmail', user.email);
        I.fillSelectByName('profile', user.profile);
        this.clickSave('#create-footer');
    },

    clickCreateNew() {
        I.waitForElement(locate('div').withAttr({ title: 'Create a new user' }));
        I.click(locate('div').withAttr({ title: 'Create a new user' }));
    },

    openUserPage() {
        I.wait(1);
        I.waitForElement(locate('a').withAttr({ href: '#/auth' }));
        I.click(locate('a').withAttr({ href: '#/auth' }));
    },

    clickSave(sidebar) {
        I.click(locate('#auth-save').inside(locate(sidebar)));
    },

    confirmRemove() {
        I.click(locate('button').withAttr({ title: 'Remove' }));
    },

    seeHasCreated() {
        I.waitForText('User created.', 20);
    },

    seeHasUpdated() {
        I.waitForText('User updated.', 20);
    },

    seeHasRemoved() {
        I.waitForText('User removed successfully.', 20);
    },

};
