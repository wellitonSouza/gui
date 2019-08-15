import util from '../util';

class CertificatesManager {
    constructor() {
        this.baseUrl = '';
    }

    getCAChain(caName) {
        return util.GET(`${this.baseUrl}/ca/${caName}`);
    }


    signCert(commonName, csrPEM) {
        const req = {
            certificate: csrPEM,
            passwd: 'dojot',
        };
        return util.POST(`${this.baseUrl}/sign/${commonName}/pkcs10`, req);
    }


    revoke(serialNumber) {
        // {{HOST}}:8000/ca/CN=IOTmidCA,O=EJBCA IOT,C=SE/certificate/39089DCC589E2A3E/status
        // TO DO
    }
}

const certificatesManager = new CertificatesManager();
export default certificatesManager;
