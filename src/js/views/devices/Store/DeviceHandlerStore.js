import { FormActions, AttrActions } from '../Actions';

class DeviceHandlerStore {
    constructor() {
        this.device = {};
        this.usedTemplates = {};

        this.bindListeners({
            set: FormActions.SET,
            updateDevice: FormActions.UPDATE,
            fetch: FormActions.FETCH,
            setAttributes: AttrActions.UPDATE,
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
            };
            this.usedTemplates = {};
        } else {
            this.device = device;
            this.usedTemplates = device.templates;
            this.loadAttrs();
        }
    }
}

export default DeviceHandlerStore;
