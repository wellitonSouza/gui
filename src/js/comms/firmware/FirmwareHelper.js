import i18n from 'i18next';
import {
    FW_RESULT_META_LABEL,
    FW_STATE_META_LABEL,
} from 'Comms/firmware/FirmwareMetasConst';

class FirmwareHelper {

    getNewParsedValueForAttrStateOrResult(attr, newValue) {
        if (attr.metadata) {
            const result = attr.metadata.filter(meta => meta.label === FW_RESULT_META_LABEL);
            const state = attr.metadata.filter(meta => meta.label === FW_STATE_META_LABEL);
            if (result.length <= 0 && state.length <= 0) return null;
            let finalValue = newValue;
            if (result.length > 0) {
                finalValue = `${i18n.t(`firmware:state.${result}`)} (${result})`;
            } else if (state.length > 0) {
                finalValue = `${i18n.t(`firmware:result.${state}`)} (${state})`;
            }
            return finalValue;
        }
        return null;
    }
}

const fwHelper = new FirmwareHelper();
export default fwHelper;
