/* eslint-disable */
import util from '../util';
import { baseURL } from 'Src/config';

class DeviceManager {
    getDevices(params) {
        if (params) {
            const qs = Object.keys(params)
                .map(key => `${key}=${params[key]}`)
                .join('&');
            return util.GET(`${baseURL}device?${qs}`);
        } return util.GET(`${baseURL}device?page_size=1000`);
    }

    // @TODO probably here isn't a good place to handle stats
    getStats() {
        return util.GET(`${baseURL}metric/admin/metrics/`);
    }

    getLastDevices(field) {
        return util.GET(`${baseURL}device?limit=10&sortDsc=${field}`);
    }

    getDevice(id) {
        return util.GET(`${baseURL}device/${id}`);
    }

    getDevicesWithPosition(params) {
        let corners = {
            "filterType": "geo",
            "value": [
                {
                    "latitude": 0,
                    "longitude": 0
                },
                {
                    "latitude": 0,
                    "longitude": "1.1"
                },
                {
                    "latitude": "1.1",
                    "longitude": "1.1"
                },
                {
                    "latitude": "1.1",
                    "longitude": 0
                }
            ]
        }
        let qs = Object.keys(corners)
            .map(key => key + "=" + corners[key])
            .join("&");
        return util.GET(`${baseURL}device/geo?${qs}`);
        // return Promise.resolve({ ok: true, json: clusterData });
    }

    getDeviceByTemplateId(templateId, params) {
        if (params) {
            const qs = Object.keys(params)
                .map(key => `${key}=${params[key]}`)
                .join('&');
            return util.GET(`${baseURL}device/template/${templateId}?${qs}`);
        }
        return util.GET(`${baseURL}device/template/${templateId}`);
    }

    sendActuator(deviceId, attrs) {
        return util.PUT(`${baseURL}device/${deviceId}/actuate`, attrs);
    }

    setDevice(detail) {
        return util.PUT(`${baseURL}device/${detail.id}`, detail);
    }

    addDevice(d) {
        d.id = util.sid();
        return util.POST(`${baseURL}device`, d);
    }

    deleteDevice(id) {
        return util.DELETE(`${baseURL}device/${id}`);
    }


    getTemplateGQL(list) {
        const req = {
            query: GQLTEMPLATE(list.toString()),
        };
        return util.POST(`${baseURL}graphql/`, req);
    }

}

const deviceManager = new DeviceManager();
export default deviceManager;


const GQLTEMPLATE = (templateList) => `
{
    templatesHasImageFirmware(templatesId: [${templateList}])
    {
        key
        value
    }
}
`;
