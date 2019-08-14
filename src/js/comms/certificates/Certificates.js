/* eslint no-bitwise: "error" */
import * as asn1js from 'asn1js';
import CertificationRequest from 'pkijs/src/CertificationRequest';
import Attribute from 'pkijs/src/Attribute';
import AttributeTypeAndValue from 'pkijs/src/AttributeTypeAndValue';
import Extension from 'pkijs/src/Extension';
import Extensions from 'pkijs/src/Extensions';
import GeneralName from 'pkijs/src/GeneralName';
import GeneralNames from 'pkijs/src/GeneralNames';
import BasicConstraints from 'pkijs/src/BasicConstraints';
import {getAlgorithmParameters, getCrypto} from 'pkijs/src/common';
import {arrayBufferToString, toBase64} from 'pvutils';
import certManager from './CertificatesManager';


class Certificates {
    constructor() {
        this.hashAlgorithm = 'SHA-256';
        this.signAlgorithm = 'RSASSA-PKCS1-V1_5';

        this.caName = 'IOTmidCA';

        this.subjAltCSR = {
            // ex ['localhost', 'localhost2']
            dns: [],
            // ex ['192.168.1.1', '192.168.1.2', '192.168.1.3']
            ip: [],
            // ex ['email@address.com', 'email2@address.com']
            email: [],
        };

        this.typesAndValues = {
            organizationUnit: '',
            country: '',
            state: '',
            locality: '',
            organization: '',
        };

        this._privateKeyPkcs8 = null;
        this._publicKeyPkcs8 = null;

        this._csrPEM = null;
        this._privateKeyPEM = null;
        this._crtPEM = null;
        this._caCrtPEM = null;
    }

    /* Create PKCS#10 */
    async _createCSR(commonName) {
        const crypto = getCrypto();
        if (!crypto) {
            console.log('No crypto');
        }

        const pkcs10 = new CertificationRequest();
        pkcs10.attributes = [];
        pkcs10.version = 0;

        this._optionsTypesAndValues(pkcs10);

        if (commonName) {
            pkcs10.subject.typesAndValues.push(new AttributeTypeAndValue({
                type: '2.5.4.3',
                value: new asn1js.Utf8String({
                    value: commonName,
                }),
            }));
        }


        /* Create a new key pair */
        const algorithm = getAlgorithmParameters(this.signAlgorithm, 'generatekey');
        if ('hash' in algorithm.algorithm) {
            algorithm.algorithm.hash.name = this.hashAlgorithm;
        }

        this._setExtensions(pkcs10);


        const keyPair = await crypto.generateKey(algorithm.algorithm, true, algorithm.usages);
        const {publicKey, privateKey} = keyPair;
        this._publicKeyPkcs8 = publicKey;
        this._privateKeyPkcs8 = privateKey;

        const privateKeyString = await Certificates._extractPrivateKeyString(crypto, privateKey);
        this._setPrivateKeyPEM(privateKeyString);

        await pkcs10.subjectPublicKeyInfo.importKey(this._publicKeyPkcs8);
        await pkcs10.sign(this._privateKeyPkcs8, this.hashAlgorithm);
        const _csrRaw = pkcs10.toSchema().toBER(false);
        this._setCsrPEM(_csrRaw);
    }

    static async _extractPrivateKeyString(crypto, privateKey) {
        const exportPrivateKey = await crypto.exportKey('pkcs8', privateKey);
        return String.fromCharCode.apply(
            null,
            new Uint8Array(exportPrivateKey),
        );
    }

    _setExtensions(pkcs10) {
        const bitArray = new ArrayBuffer(1);
        const bitView = new Uint8Array(bitArray);
        // eslint-disable-next-line no-bitwise
        bitView[0] |= 0x0020; // Key usage "KeyEncipherment" flag
        // eslint-disable-next-line no-bitwise
        bitView[0] |= 0x0040; // Key usage "NonRepudiation" flag
        // eslint-disable-next-line no-bitwise
        bitView[0] |= 0x0080; // Key usage "DigitalSignature" flag

        // region "BasicConstraints" extension
        const basicConstr = new BasicConstraints({
            cA: false,
        });

        const extensions = [
            new Extension({
                extnID: '2.5.29.15', // KeyUsage
                critical: false,
                extnValue:
                    (new asn1js.BitString({valueHex: bitArray})).toBER(false),
            }),
            new Extension({
                extnID: '2.5.29.19', // BasicConstraints
                critical: false,
                extnValue: basicConstr.toSchema().toBER(false),
                // Parsed value for well-known extensions
                parsedValue: basicConstr,
            }),
        ];

        const altNames = this._subjectAltName();
        if (altNames) {
            extensions.push(new Extension({
                extnID: '2.5.29.17', // subjectAltName
                critical: false,
                extnValue: altNames.toSchema().toBER(false),
                parsedValue: altNames,
            }));
        }

        pkcs10.attributes.push(new Attribute({
            type: '1.2.840.113549.1.9.14', // pkcs-9-at-extensionRequest
            values: [(new Extensions({
                extensions,
            })).toSchema()],
        }));
    }

    _subjectAltName() {
        if (!((this.subjAltCSR.email && this.subjAltCSR.email.length > 0)
            || (this.subjAltCSR.dns && this.subjAltCSR.dns.length > 0)
            || (this.subjAltCSR.ip && this.subjAltCSR.ip.length > 0))) {
            return null;
        }

        const emailAlt = this.subjAltCSR.email.map(email => new GeneralName({
            type: 1, // rfc822Name
            value: email,
        }));

        const dnsAlt = this.subjAltCSR.dns.map(dns => new GeneralName({
            type: 2, // dNSName
            value: dns,
        }));

        const ipsAlt = this.subjAltCSR.ip.map(ip => new GeneralName({
            type: 7, // iPAddress
            value: new asn1js.OctetString({valueHex: (new Uint8Array(ip.split('.'))).buffer}),
        }));


        return new GeneralNames({names: [...emailAlt, ...dnsAlt, ...ipsAlt]});
    }

    _optionsTypesAndValues(pkcs10) {
        if (this.typesAndValues.country) {
            pkcs10.subject.typesAndValues.push(new AttributeTypeAndValue({
                type: '2.5.4.6',
                value: new asn1js.PrintableString({
                    value: this.typesAndValues.country,
                }),
            }));
        }

        if (this.typesAndValues.state) {
            pkcs10.subject.typesAndValues.push(new AttributeTypeAndValue({
                type: '2.5.4.8',
                value: new asn1js.Utf8String({
                    value: this.typesAndValues.state,
                }),
            }));
        }

        if (this.typesAndValues.locality) {
            pkcs10.subject.typesAndValues.push(new AttributeTypeAndValue({
                type: '2.5.4.7',
                value: new asn1js.Utf8String({
                    value: this.typesAndValues.locality,
                }),
            }));
        }

        if (this.typesAndValues.organization) {
            pkcs10.subject.typesAndValues.push(new AttributeTypeAndValue({
                type: '2.5.4.11',
                value: new asn1js.Utf8String({
                    value: this.typesAndValues.organization,
                }),
            }));
        }

        if (this.typesAndValues.typesAndValues.organizationUnit) {
            pkcs10.subject.typesAndValues.push(new AttributeTypeAndValue({
                type: '2.5.4.10',
                value: new asn1js.Utf8String({
                    value: this.typesAndValues.typesAndValues.organizationUnit,
                }),
            }));
        }
    }

    async retrieveCA() {
        const responseCAChain = await certManager.getCAChain(this.caName);
        const crtCARaw = responseCAChain.certificate ? responseCAChain.certificate : null;
        this._setCACrtPEM(crtCARaw);
        console.log(this._caCrtPEM);
        return this._caCrtPEM;
    }

    async createKeys() {
        const commonName = 'admin:431d2a';
        await this._createCSR(commonName);

        const responseSignCert = await certManager.signCert(commonName, this._csrPEM);
        const crtRaw = responseSignCert.status.data ? responseSignCert.status.data : null;
        this._setCrtPEM(crtRaw);

        console.log(this._privateKeyPEM);
        console.log(this._csrPEM);
        console.log(this._crtPEM);

        return {
            privateKey: this._privateKeyPEM,
            csrPEM: this._csrPEM,
            crtPEM: this._crtPEM,
        };
    }

    _setPrivateKeyPEM(privateKeyString) {
        this._privateKeyPEM = '\r\n-----BEGIN PRIVATE KEY-----\r\n';
        this._privateKeyPEM += Certificates._formatPEM(toBase64((privateKeyString)));
        this._privateKeyPEM = `${this._privateKeyPEM}\r\n-----END PRIVATE KEY-----`;
    }

    _setCsrPEM(csrRaw) {
        this._csrPEM = '-----BEGIN CERTIFICATE REQUEST-----\r\n';
        this._csrPEM = `${this._csrPEM}${Certificates._formatPEM(toBase64(arrayBufferToString(csrRaw)))}`;
        this._csrPEM = `${this._csrPEM}\r\n-----END CERTIFICATE REQUEST-----\r\n`;
    }

    _setCrtPEM(crtRaw) {
        this._crtPEM = Certificates._formatCRTPEM(crtRaw);
    }

    _setCACrtPEM(crtRaw) {
        this._caCrtPEM = Certificates._formatCRTPEM(crtRaw);
    }

    static _formatCRTPEM(crtRaw) {
        let crtPEM = '-----BEGIN CERTIFICATE-----\r\n';
        crtPEM = `${crtPEM}${crtRaw}`;
        crtPEM = `${crtPEM}\r\n-----END CERTIFICATE-----\r\n`;
        return crtPEM;
    }

    /**
     *
     * @param pemString
     * @returns {string}
     * @private
     */
    static _formatPEM(pemString) {
        let resultString = '';
        if (pemString) {
            for (let i = 0, count = 0; i < pemString.length; i += 1, count += 1) {
                if (count > 63) {
                    resultString = `${resultString}\r\n`;
                    count = 0;
                }
                resultString = `${resultString}${pemString[i]}`;
            }
        }
        return resultString;
    }
}


export default Certificates;
