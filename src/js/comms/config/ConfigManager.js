import util from '../util';
import configDate from './config.json'

class ConfigManager {
    constructor() {
        this.baseUrl = ""
    }

    getConfigDate() {
        return new Promise((resolve, reject) => {
            setTimeout(function() {
                var didSucceed = true;
                didSucceed ? resolve(configDate) : reject('Error');
            }, 2000);
        });
    }
}

let configManager = new ConfigManager();
export default configManager;
