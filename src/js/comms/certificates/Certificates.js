import GeneralNames from 'pkijs/src/GeneralNames';
import GeneralName from 'pkijs/src/GeneralName';
import { arrayBufferToString, toBase64 } from 'pvutils';
import run from './run';

class Certificates {

    test() {
        const email = 'email.com';

        const names = new GeneralNames({
            names: [
                new GeneralName({
                    type: 1,
                    value: email || 'foo@example.com',
                }),
            ],
        });

        run(names).then((pkcs10Buffer) => {
            let resultString = '-----BEGIN CERTIFICATE REQUEST-----\r\n';
            resultString = `${resultString}${this.formatPEM(toBase64(arrayBufferToString(pkcs10Buffer)))}`;
            resultString = `${resultString}\r\n-----END CERTIFICATE REQUEST-----\r\n`;

            console.log(resultString);

            // const private_key_string = String.fromCharCode.apply(null, new Uint8Array(pkcs10Buffer.private));
            // let resultString2 = '\r\n-----BEGIN PRIVATE KEY-----\r\n';
            // resultString2 += formatPEM(window.btoa(private_key_string));
            // resultString2 = `${result_string}\r\n-----END PRIVATE KEY-----`;
            // context.privateKey = result_string;
            //
            // console.log(resultString2);
        });
    }

    formatPEM(pemString) {
        // / <summary>Format string in order to have each line with length equal to 63</summary>
        // / <param name="pemString" type="String">String to format</param>

        const stringLength = pemString.length;
        let resultString = '';

        for (let i = 0, count = 0; i < stringLength; i++, count++) {
            if (count > 63) {
                resultString = `${resultString}\r\n`;
                count = 0;
            }

            resultString = `${resultString}${pemString[i]}`;
        }

        return resultString;
    }

}


export default Certificates;
