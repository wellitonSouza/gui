import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import backend from 'i18next-xhr-backend';
import { reactI18nextModule } from 'react-i18next';

i18n.use(LanguageDetector)
    .use(backend)
    .use(reactI18nextModule)
    .init({
        resGetPath: '__ns__-__lng__.json',
        load: 'currentOnly',
        preload: false,
        fallbackLng: 'en',
        lowerCaseLng: true,
        debug: true,
        nsSeparator: ':',
        ns: ['common', 'menu', 'groups', 'importExport'],
        interpolation: {
            escapeValue: false, // not needed for react!!
            formatSeparator: ',',
        },
        react: {
            wait: true,
        },
    });

export default i18n;
