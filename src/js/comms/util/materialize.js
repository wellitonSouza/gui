import Materialize from 'materialize-css';

let _lastMsg = '';
let _enableTimeOut = true;
const _timeout = 4000;

class MaterialToast {
    success(message) {
        this.custom({
            className: 'toast-success',
            html: message,
            displayLength: 4000,
        });
    }

    error(message) {
        this.custom({
            className: 'toast-error',
            html: message,
            displayLength: 4000,
        });
    }

    warning(message) {
        this.custom({
            className: 'toast-warning',
            html: message,
            displayLength: 4000,
        });
    }

    critical(message) {
        this.custom({
            className: 'toast-critical',
            html: message,
            displayLength: 4000,
        });
    }

    custom(options) {
        // It helps to avoid repeated messages in a short time
        // if last msg was diff penult one or this msg was publicated >=5000 miles
        if (_lastMsg !== options.html) {
            Materialize.toast(options.html, options.displayLength, options.className);

            _lastMsg = options.html;

            if (_enableTimeOut) {
                _enableTimeOut = false;

                setTimeout(() => {
                    _lastMsg = '';
                    _enableTimeOut = true;
                }, _timeout);
            }
        }
    }
}

const toaster = new MaterialToast();
export default toaster;
