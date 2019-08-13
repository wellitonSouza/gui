import * as asn1js from 'asn1js';
import CertificationRequest from 'pkijs/src/CertificationRequest';
import Attribute from 'pkijs/src/Attribute';
import AttributeTypeAndValue from 'pkijs/src/AttributeTypeAndValue';
import Extension from 'pkijs/src/Extension';
import Extensions from 'pkijs/src/Extensions';
import GeneralName from 'pkijs/src/GeneralName';
import GeneralNames from 'pkijs/src/GeneralNames';
import {getCrypto, getAlgorithmParameters} from 'pkijs/src/common';
import {arrayBufferToString, toBase64} from 'pvutils';

const HASH_ALGORITHM = 'SHA-256';
const SIGN_ALGORITHM = 'RSASSA-PKCS1-V1_5';
const HOSTNAME = '';
const ORGANIZATION_UNIT = '';
const COUNTRY = '';
const STATE = '';
const CITY = '';
const ORGANIZATION = '';

/* Create PKCS#10 */
function run(names) {
    const crypto = getCrypto();
    if (!crypto) return Promise.reject('No crypto');

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
            value: HOSTNAME,
        }),
    }));

    /* Create a new key pair */
    let publicKey;
    let privateKey;

    const algorithm = getAlgorithmParameters(SIGN_ALGORITHM, 'generatekey');
    if ('hash' in algorithm.algorithm) algorithm.algorithm.hash.name = HASH_ALGORITHM;

    return crypto.generateKey(algorithm.algorithm, true, algorithm.usages)
        .then((keyPair) => {
            publicKey = keyPair.publicKey;
            privateKey = keyPair.privateKey;
        }, err => Promise.reject(`Error during key generation: ${err}`))
        .then(() => pkcs10.subjectPublicKeyInfo.importKey(publicKey))

        /* Export public key into the `subjectPublicKeyInfo` field of PKCS#10 */
        .then(() => crypto.digest({name: 'SHA-1'}, pkcs10.subjectPublicKeyInfo.subjectPublicKey.valueBlock.valueHex))
        .then((result) => {
            pkcs10.attributes.push(new Attribute({
                type: '1.2.840.113549.1.9.14', // pkcs-9-at-extensionRequest
                values: [(new Extensions({
                    extensions: [
                        new Extension({
                            extnID: '2.5.29.14',
                            critical: false,
                            extnValue: (new asn1js.OctetString({valueHex: result})).toBER(false),
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
        .then(() => pkcs10.sign(privateKey, HASH_ALGORITHM), err => Promise.reject(`Error during exporting public key: ${err}`))
        .then(() => pkcs10.toSchema().toBER(false), err => Promise.reject(`Error signing PKCS#10: ${err}`));
}


export default run;
