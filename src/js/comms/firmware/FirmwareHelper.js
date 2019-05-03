import i18n from 'i18next';
import {
    FW_RESULT_META_LABEL,
    FW_STATE_META_LABEL,
} from 'Comms/firmware/FirmwareMetasConst';

class FirmwareHelper {
    getNewParsedValueForAttrStateOrResult(metadata, newValue) {
        if (metadata) {
            const result = metadata.filter(meta => meta.label === FW_RESULT_META_LABEL);
            const state = metadata.filter(meta => meta.label === FW_STATE_META_LABEL);

            console.log('getNewParsedValueForAttrStateOrResult result', result);
            console.log('getNewParsedValueForAttrStateOrResult state', state);

            if (result.length <= 0 && state.length <= 0) return null;
            let finalValue = newValue;

            if (result.length > 0) {
                const resultValue = result[0].static_value;
                finalValue = `${i18n.t(`firmware:result.${resultValue}`)} (${resultValue})`;
            } else if (state.length > 0) {
                const stateValue = state[0].static_value;
                finalValue = `${i18n.t(`firmware:state.${stateValue}`)} (${stateValue})`;
            }
            return finalValue;
        }
        return null;
    }
}

const fwHelper = new FirmwareHelper();
export default fwHelper;
