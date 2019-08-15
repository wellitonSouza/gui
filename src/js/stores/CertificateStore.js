const alt = require('../alt');
const CertActions = require('../actions/CertificateActions');


class CertificateStore {
    constructor() {
        this.privateKey = null;
        this.crt = null;
        this.caCrt = null;


        this.loading = false;
        this.error = null;

        this.bindListeners({
            handleUpdatePrivateKey: CertActions.setStorePrivateKey,
            handleUpdateCRT: CertActions.setStoreCRT,
            handleUpdateCACRT: CertActions.setStoreCACRT,
            handleFailure: CertActions.failed,

        });
    }


    handleUpdatePrivateKey(privateKey) {
        this.privateKey = privateKey;
        this.error = null;
        this.loading = false;
    }

    handleUpdateCRT(crt) {
        this.crt = crt;
        this.error = null;
        this.loading = false;
    }


    handleUpdateCACRT(caCrt) {
        this.caCrt = caCrt;
        this.error = null;
        this.loading = false;
    }

    handleFailure(error) {
        this.error = error;
        this.loading = false;
    }
}

export default alt.createStore(CertificateStore, 'CertificateStore');
