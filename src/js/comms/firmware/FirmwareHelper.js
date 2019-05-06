import i18n from 'i18next';
import {
    FW_RESULT_META_LABEL,
    FW_STATE_META_LABEL,
} from 'Comms/firmware/FirmwareMetasConst';

class FirmwareHelper {
    getNewParsedValueForAttrStateOrResult(metadata, listOfData) {
        if (metadata) {
            const result = metadata.filter(meta => meta.label === FW_RESULT_META_LABEL);
            const state = metadata.filter(meta => meta.label === FW_STATE_META_LABEL);
            if (result.length <= 0 && state.length <= 0) return null;

            let finalListOfData = [];

            if (result.length > 0) {
                finalListOfData = listOfData.map(data => ({
                    ...data,
                    value: typeof data.value === 'number' ? `${i18n.t(`firmware:result.${data.value}`)} (${data.value})` : data.value,
                }));
            } else if (state.length > 0) {
                finalListOfData = listOfData.map(data => ({
                    ...data,
                    value: typeof data.value === 'number' ? `${i18n.t(`firmware:state.${data.value}`)} (${data.value})` : data.value,
                }));
            }
            return finalListOfData;
        }
        return null;
    }
}

const fwHelper = new FirmwareHelper();
export default fwHelper;
