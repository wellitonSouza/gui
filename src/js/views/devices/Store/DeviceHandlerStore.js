import { FormActions } from '../Actions';

class DeviceHandlerStore {
    constructor() {
        this.device = {};
        this.usedTemplates = {};
        this.showSidebarDevice = false;
        this.isNewDevice = false;

        this.bindListeners({
            set: FormActions.SET,

            fetch: FormActions.FETCH,

            handleToggleSidebarDevice: FormActions.TOGGLE_SIDEBAR_DEVICE,

            handleTriggerInsertion: FormActions.ADD_DEVICE,

            handleTriggerUpdate: FormActions.TRIGGER_UPDATE,

            handleUpdateSingle: FormActions.UPDATE_SINGLE,

            handleRemoveSingle: FormActions.TRIGGER_REMOVAL,
        });
    }

    fetch(id) {
    }

    set(device) {
        if (device === null || device === undefined) {
            this.device = {
                label: '',
                id: '',
                protocol: 'MQTT',
                templates: [],
                tags: [],
                attrs: {},
                configValues: [],
                dynamicValues: [],
                staticValues: [],
                actuatorValues: [],
                metadata: {},
            };
            this.usedTemplates = {};
            this.isNewDevice = true;
        } else {
            const customDevice = { ...device };
            device.templates.forEach((id) => {
                customDevice.configValues = device.attrs[id].filter(item => item.type === 'meta');
                customDevice.dynamicValues = device.attrs[id].filter(item => item.type === 'dynamic');
                customDevice.staticValues = device.attrs[id].filter(item => item.type === 'static');
                customDevice.actuatorValues = device.attrs[id].filter(item => item.type === 'actuator');
                customDevice.metadata = {};
                device.attrs[id].forEach((item) => {
                    if (Object.prototype.hasOwnProperty.call(item, 'metadata')) {
                        customDevice.metadata[item.id] = [...item.metadata];
                    }
                });
            });

            this.device = customDevice;
            this.usedTemplates = device.templates;
            this.isNewDevice = false;
        }
        this.showSidebarDevice = true;
    }

    handleTriggerUpdate(device) {
        this.device = device;
        this.showSidebarDevice = false;
    }

    handleUpdateSingle(device) {
        this.device = device;
        this.showSidebarDevice = false;
    }

    handleToggleSidebarDevice(value) {
        this.showSidebarDevice = value;
    }

    handleTriggerInsertion() {
        this.showSidebarDevice = false;
        this.device = {};
    }

    handleRemoveSingle() {
        this.showSidebarDevice = false;
        this.device = {};
    }
}

export default DeviceHandlerStore;
