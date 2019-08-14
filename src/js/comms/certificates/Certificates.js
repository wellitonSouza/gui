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
import { getAlgorithmParameters, getCrypto } from 'pkijs/src/common';
import { arrayBufferToString, toBase64 } from 'pvutils';
import certManager from './CertificatesManager';

const HASH_ALGORITHM = 'SHA-256';
const SIGN_ALGORITHM = 'RSASSA-PKCS1-V1_5';
const DIGEST_ALGORITHM = 'SHA-1';

const ORGANIZATION_UNIT = '';
const COUNTRY = '';
const STATE = '';
const CITY = '';
const ORGANIZATION = '';

const CA_NAME = 'IOTmidCA';

// ex ['localhost', 'localhost2']
const SUBJ_ALT_DNS_CSR = [];
// ex ['192.168.1.1', '192.168.1.2', '192.168.1.3']
const SUBJ_ALT_IP_CSR = [];
// ex ['email@address.com', 'email2@address.com']
const SUBJ_ALT_EMAIL_CSR = [];

class Certificates {
    constructor() {
        this.csrRaw = null;

        this.privateKey = null;
        this.publicKey = null;

        this.privateKeyString = null;

        this.csrPEM = null;
        this.privateKeyPEM = null;
        this.crtPEM = null;
        this.caCrtPEM = null;
    }

    /* Create PKCS#10 */
    _createCSR(commonName) {
        return new Promise((resolve, reject) => {
            const crypto = getCrypto();
            if (!crypto) {
                reject(new Error('No crypto'));
            }

            const pkcs10 = new CertificationRequest();
            pkcs10.attributes = [];
            pkcs10.version = 0;

            Certificates._optionsTypesAndValues(pkcs10);

            if (commonName) {
                pkcs10.subject.typesAndValues.push(new AttributeTypeAndValue({
                    type: '2.5.4.3',
                    value: new asn1js.Utf8String({
                        value: commonName,
                    }),
                }));
            }


            /* Create a new key pair */
            const algorithm = getAlgorithmParameters(SIGN_ALGORITHM, 'generatekey');
            if ('hash' in algorithm.algorithm) {
                algorithm.algorithm.hash.name = HASH_ALGORITHM;
            }


            this._setExtensions(pkcs10);

            return crypto.generateKey(algorithm.algorithm, true, algorithm.usages)
                .then((keyPair) => {
                    const { publicKey, privateKey } = keyPair;
                    this.publicKey = publicKey;
                    this.privateKey = privateKey;

                    return privateKey;
                }).then(privateKey => crypto.exportKey('pkcs8', privateKey)).then((exportPrivateKey) => {
                    this.privateKeyString = String.fromCharCode.apply(
                        null,
                        new Uint8Array(exportPrivateKey),
                    );

                    return pkcs10.subjectPublicKeyInfo.importKey(this.publicKey);
                })
                /* Sign the final PKCS#10 request */
                .then(() => pkcs10.sign(this.privateKey, HASH_ALGORITHM))
                .then(() => {
                    this.csrRaw = pkcs10.toSchema().toBER(false);
                    resolve();
                })
                .catch((error) => {
                    reject(error);
                });
        });
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
                    (new asn1js.BitString({ valueHex: bitArray })).toBER(false),
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
        if (!((SUBJ_ALT_EMAIL_CSR && SUBJ_ALT_EMAIL_CSR.length > 0)
            || (SUBJ_ALT_DNS_CSR && SUBJ_ALT_DNS_CSR.length > 0)
            || (SUBJ_ALT_IP_CSR && SUBJ_ALT_IP_CSR.length > 0))) {
            return null;
        }

        const emailAlt = SUBJ_ALT_EMAIL_CSR.map(email => new GeneralName({
            type: 1, // rfc822Name
            value: email,
        }));

        const dnsAlt = SUBJ_ALT_DNS_CSR.map(dns => new GeneralName({
            type: 2, // dNSName
            value: dns,
        }));

        const ipsAlt = SUBJ_ALT_IP_CSR.map(ip => new GeneralName({
            type: 7, // iPAddress
            value: new asn1js.OctetString({ valueHex: (new Uint8Array(ip.split('.'))).buffer }),
        }));


        return new GeneralNames({ names: [...emailAlt, ...dnsAlt, ...ipsAlt] });
    }

    static _optionsTypesAndValues(pkcs10) {
        if (COUNTRY) {
            pkcs10.subject.typesAndValues.push(new AttributeTypeAndValue({
                type: '2.5.4.6',
                value: new asn1js.PrintableString({
                    value: COUNTRY,
                }),
            }));
        }

        if (STATE) {
            pkcs10.subject.typesAndValues.push(new AttributeTypeAndValue({
                type: '2.5.4.8',
                value: new asn1js.Utf8String({
                    value: STATE,
                }),
            }));
        }

        if (STATE) {
            pkcs10.subject.typesAndValues.push(new AttributeTypeAndValue({
                type: '2.5.29.14',
                value: new asn1js.Utf8String({
                    value: STATE,
                }),
            }));
        }

        if (CITY) {
            pkcs10.subject.typesAndValues.push(new AttributeTypeAndValue({
                type: '2.5.4.7',
                value: new asn1js.Utf8String({
                    value: CITY,
                }),
            }));
        }

        if (ORGANIZATION) {
            pkcs10.subject.typesAndValues.push(new AttributeTypeAndValue({
                type: '2.5.4.11',
                value: new asn1js.Utf8String({
                    value: ORGANIZATION,
                }),
            }));
        }

        if (ORGANIZATION_UNIT) {
            pkcs10.subject.typesAndValues.push(new AttributeTypeAndValue({
                type: '2.5.4.10',
                value: new asn1js.Utf8String({
                    value: ORGANIZATION_UNIT,
                }),
            }));
        }
    }

    async createKeys() {
        const commonName = 'admin:431d2a';
        await this._createCSR(commonName).then(async () => {
            this._setCsrPEM();
            this._setPrivateKeyPEM();

            const responseSignCert = await certManager.signCert(commonName, this.csrPEM);
            const crtRaw = responseSignCert.status.data ? responseSignCert.status.data : null;
            this._setCrtPEM(crtRaw);

            const responseCAChain = await certManager.getCAChain(CA_NAME);
            const crtCARaw = responseCAChain.certificate ? responseCAChain.certificate : null;
            this._setCACrtPEM(crtCARaw);

            console.log(this.privateKeyPEM);
            console.log(this.csrPEM);
            console.log(this.crtPEM);
            console.log(this.caCrtPEM);
        }).catch((error) => {
            console.log(error);
        });
    }

    _setPrivateKeyPEM() {
        this.privateKeyPEM = '\r\n-----BEGIN PRIVATE KEY-----\r\n';
        this.privateKeyPEM += Certificates._formatPEM(toBase64((this.privateKeyString)));
        this.privateKeyPEM = `${this.privateKeyPEM}\r\n-----END PRIVATE KEY-----`;
    }

    _setCsrPEM() {
        this.csrPEM = '-----BEGIN CERTIFICATE REQUEST-----\r\n';
        this.csrPEM = `${this.csrPEM}${Certificates._formatPEM(toBase64(arrayBufferToString(this.csrRaw)))}`;
        this.csrPEM = `${this.csrPEM}\r\n-----END CERTIFICATE REQUEST-----\r\n`;
    }

    _setCrtPEM(crtRaw) {
        this.crtPEM = Certificates._formatCRTPEM(crtRaw);
    }

    _setCACrtPEM(crtRaw) {
        this.caCrtPEM = Certificates._formatCRTPEM(crtRaw);
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
