import Materialize from 'materialize-css';


class MaterialToast {

    success(message) {
        this.custom({ className: "toast-success", html: message, displayLength:4000 });
    }

    error(message) {
        this.custom({ className: "toast-error", html: message, displayLength: 4000 });
    }

    warning(message) {
        this.custom({ className: "toast-warning", html: message, displayLength: 4000 });
    }

    critical(message) {
        this.custom({ className: "toast-critical", html: message, displayLength: 4000 });
    }

    custom(options) {
        console.log("Materialize.toast", options);
        Materialize.toast(options.html, options.displayLength, options.className);
         //, completeCallback
    }

}

let toaster = new MaterialToast();
export default toaster;
// export default Filter;
// export { SimpleFilter };

