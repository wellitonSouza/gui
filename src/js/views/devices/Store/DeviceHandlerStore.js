import { FormActions, AttrActions } from '../Actions';

class DeviceHandlerStore {
    constructor() {
        this.device = {};
        this.usedTemplates = {};

        this.attrNames = {};
        this.attrError = '';
        this.fieldError = {};

        this.bindListeners({
            set: FormActions.SET,
            updateDevice: FormActions.UPDATE,
            fetch: FormActions.FETCH,
            setAttributes: AttrActions.UPDATE,
        });
        this.set(null);
    }


    loadAttrs() {
        // TODO: it actually makes for sense in the long run to use (id, key) for attrs which
        //       will allow name updates as well as better payload to event mapping.
        this.attrNames = {};
        if ((this.device === undefined) || (this.device === null)) {
            return;
        }

        for (const tmp_id in this.device.attrs) {
            for (const index in this.device.attrs[tmp_id]) {
                const att = this.device.attrs[tmp_id][index];
                if (String(att.type) === 'static') {
                    this.attrNames[att.id] = att.static_value;
                }
            }
        }
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
