import { FormActions } from '../Actions';

class DeviceHandlerStore {
    constructor() {
        this.device = {};
        this.usedTemplates = {};
        this.showSidebarDevice = false;

        this.bindListeners({
            set: FormActions.SET,
            // updateDevice: FormActions.UPDATE,
            fetch: FormActions.FETCH,
            // setAttributes: AttrActions.UPDATE,
            handleToggleSidebarDevice: FormActions.TOGGLE_SIDEBAR_DEVICE,

            handleSelectTemplate: FormActions.SELECT_TEMPLATE,
        });
        this.set(null);
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
                attrs: [],
                configValues: [],
                dynamicValues: [],
                staticValues: [],
                actuatorValues: [],
                metadata: {},
            };
            this.usedTemplates = {};
        } else {
            const customDevice = { ...device };
            customDevice.configValues = device.attrs.filter(item => item.type === 'meta');
            customDevice.dynamicValues = device.attrs.filter(item => item.type === 'dynamic');
            customDevice.staticValues = device.attrs.filter(item => item.type === 'static');
            customDevice.actuatorValues = device.attrs.filter(item => item.type === 'actuator');
            customDevice.metadata = {};
            device.attrs.forEach((item) => {
                if (Object.prototype.hasOwnProperty.call(item, 'metadata')) {
                    customDevice.metadata[item.id] = [...item.metadata];
                }
            });

            this.device = customDevice;
            this.usedTemplates = device.templates;
            // this.loadAttrs();
        }
    }

    handleToggleSidebarDevice(value) {
        this.showSidebarDevice = value;
    }

    handleSelectTemplate(template) {
        this.device.configValues = template.attrs.filter(item => item.type === 'meta');
        this.device.dynamicValues = template.attrs.filter(item => item.type === 'dynamic');
        this.device.staticValues = template.attrs.filter(item => item.type === 'static');
        this.device.actuatorValues = template.attrs.filter(item => item.type === 'actuator');
        this.device.metadata = {};
        template.attrs.forEach((item) => {
            if (Object.prototype.hasOwnProperty.call(item, 'metadata')) {
                this.device.metadata[item.id] = [...item.metadata];
            }
        });
        this.device.templates.push(template.id);
        console.log(this.device);
    }
}

export default DeviceHandlerStore;
