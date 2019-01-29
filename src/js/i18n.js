import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import backend from 'i18next-xhr-backend';

i18n.use(LanguageDetector)
    .use(backend)
    .init({
        resGetPath: '__ns__-__lng__.json',
        load: 'All',
        fallbackLng: {
            pt: ['pt-br'],
            'pt-pt': ['pt-br'],
            default: ['en'],
        },
        lowerCaseLng: true,
        debug: true,
        nsSeparator: ':',
        ns: ['common', 'menu', 'groups', 'importExport', 'users'],
        fallbackNS: 'common',
        interpolation: {
            escapeValue: false, // not needed for react
            formatSeparator: ',',
        },
        react: {
            wait: true,

        },
    });

export default i18n;
