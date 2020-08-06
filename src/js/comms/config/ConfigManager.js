import configDate from './config.json';

class ConfigManager {
    getConfigDate() {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const didSucceed = true;
                didSucceed ? resolve(configDate) : reject('Error');
            }, 2000);
        });
    }
}

const configManager = new ConfigManager();
export default configManager;
