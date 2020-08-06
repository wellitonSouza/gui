import { baseURL } from 'Src/config';
import util from '../util';

class CertificatesManager {
    async getCAChain() {
        const { caPem } = await util.GET(`${baseURL}x509/v1/ca`);
        return caPem;
    }

    async signCert(commonName, csrPEM) {
        const { certificatePem } = await util.POST(`${baseURL}x509/v1/certificates`, { csr: csrPEM });
        return certificatePem;
    }
}

const certificatesManager = new CertificatesManager();
export default certificatesManager;
