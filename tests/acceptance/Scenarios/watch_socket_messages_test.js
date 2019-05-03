Feature('Watch socket messages');

Before((login) => {
    login('admin');
});

Scenario('Watching a simple message', async (I, Device) => {
    const template = await I.createTemplate({
        label: 'String Template',
        attrs: [
            {
                label: 'text',
                type: 'dynamic',
                value_type: 'string',
            },
        ],
    });

    const templateId = template.template.id;

    const device = await I.createDevice({
        templates: [
            templateId,
        ],
        label: 'String device',
    });

    const deviceId = device.devices[0].id;

    I.refreshPage();
    Device.change64QtyToShowPagination();

    await I.sendMQTTMessage(deviceId, '{"text": "my string"}');

    Device.clickDetailsDevice(deviceId);
    Device.selectAttr('text');
    I.wait(5);
    Device.shouldSeeMessage('my string');
});
