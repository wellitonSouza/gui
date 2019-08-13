import * as asn1js from 'asn1js';
import CertificationRequest from 'pkijs/src/CertificationRequest';
import Attribute from 'pkijs/src/Attribute';
import AttributeTypeAndValue from 'pkijs/src/AttributeTypeAndValue';
import Extension from 'pkijs/src/Extension';
import Extensions from 'pkijs/src/Extensions';
import GeneralName from 'pkijs/src/GeneralName';
import GeneralNames from 'pkijs/src/GeneralNames';
import { getCrypto, getAlgorithmParameters } from 'pkijs/src/common';
import { arrayBufferToString, toBase64 } from 'pvutils';

const HASH_ALGORITHM = 'SHA-256';
const SIGN_ALGORITHM = 'RSASSA-PKCS1-V1_5';
const DIGEST_ALGORITHM = 'SHA-1';
const DOMAIN = '';
const ORGANIZATION_UNIT = '';
const COUNTRY = '';
const STATE = '';
const CITY = '';
const ORGANIZATION = '';

class Certificates {
    constructor() {
        this.csrRaw = null;

        this.privateKey = null;
        this.publicKey = null;

        this.privateKeyString = null;

        this.csrPEM = null;
        this.privateKeyPEM = null;
    }

    /* Create PKCS#10 */
    _createCSR() {
        const email = 'email.com';

        const names = new GeneralNames({
            names: [
                new GeneralName({
                    type: 1,
                    value: email || 'foo@example.com',
                }),
            ],
        });

        return new Promise((resolve, reject) => {
            const crypto = getCrypto();
            if (!crypto) {
                reject(new Error('No crypto'));
            }

            const pkcs10 = new CertificationRequest();
            pkcs10.attributes = [];
            pkcs10.version = 0;

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

            pkcs10.subject.typesAndValues.push(new AttributeTypeAndValue({
                type: '2.5.4.3',
                value: new asn1js.Utf8String({
                    value: DOMAIN,
                }),
            }));

            /* Create a new key pair */
            const algorithm = getAlgorithmParameters(SIGN_ALGORITHM, 'generatekey');
            if ('hash' in algorithm.algorithm) {
                algorithm.algorithm.hash.name = HASH_ALGORITHM;
            }

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
                /* Export public key into the `subjectPublicKeyInfo` field of PKCS#10 */
                .then(() => crypto.digest({ name: DIGEST_ALGORITHM }, pkcs10.subjectPublicKeyInfo.subjectPublicKey.valueBlock.valueHex))
                .then((result) => {
                    console.log('result');
                    pkcs10.attributes.push(new Attribute({
                        type: '1.2.840.113549.1.9.14', // pkcs-9-at-extensionRequest
                        values: [(new Extensions({
                            extensions: [
                                new Extension({
                                    extnID: '2.5.29.14',
                                    critical: false,
                                    extnValue:
                                        (new asn1js.OctetString({
                                            valueHex: result,
                                        })).toBER(false),
                                }),
                                new Extension({
                                    extnID: '2.5.29.17',
                                    critical: false,
                                    extnValue: names.toSchema().toBER(false),
                                }),
                            ],
                        })).toSchema()],
                    }));
                })
                /* Sign the final PKCS#10 request */
                .then(() => pkcs10.sign(this.privateKey, HASH_ALGORITHM))
                .then(() => {
                    this.csrRaw = pkcs10.toSchema().toBER(false);
                    console.log('csrRaw');
                    resolve();
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }

    async createCSR() {
        await this._createCSR().then(() => {
            this.csrPEM = '-----BEGIN CERTIFICATE REQUEST-----\r\n';
            this.csrPEM = `${this.csrPEM}${Certificates._formatPEM(toBase64(arrayBufferToString(this.csrRaw)))}`;
            this.csrPEM = `${this.csrPEM}\r\n-----END CERTIFICATE REQUEST-----\r\n`;


            this.privateKeyPEM = '\r\n-----BEGIN PRIVATE KEY-----\r\n';
            this.privateKeyPEM += Certificates._formatPEM(toBase64((this.privateKeyString)));
            this.privateKeyPEM = `${this.privateKeyPEM}\r\n-----END PRIVATE KEY-----`;
        }).catch((error) => {
            console.log(error);
        });
    }

    /**
     *
     * @param pemString
     * @returns {null}
     * @private
     */
    static _formatPEM(pemString) {
        let resultString = null;
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
