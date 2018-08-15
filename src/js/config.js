import L from 'leaflet'
import DivIcon from 'react-leaflet-div-icon';

// @TODO Implement it

// let offlinePin = DivIcon({className: 'icon-marker bg-true-black'});
// let grayPin = DivIcon({className: 'icon-marker bg-medium-gray'});
// let darkBluePin = DivIcon({className: 'icon-marker bg-dark-blue'});
// let lightBluePin = DivIcon({className: 'icon-marker bg-light-blue'});
// let greyishBluePin = DivIcon({className: 'icon-marker bg-greyish-blue'});
// let bluePin = DivIcon({className: 'icon-marker bg-blue'});
// let orangePin = DivIcon({className: 'icon-marker bg-orange'});
// let blackPin = DivIcon({className: 'icon-marker bg-black'});
// let redPin = DivIcon({className: 'icon-marker bg-red'});


class Config {

    SinrSignalLevel(value) {
        return null;
        // if (value === undefined) {return grayPin;}
        // if (value > 20){return darkBluePin;}
        // if (value > 15){return lightBluePin;}
        // if (value > 10){return greyishBluePin;}
        // if (value > 5){return bluePin;}
        // if (value > 2){return orangePin;}
        // if (value > -1){return redPin;}
        // if (value <= -1){return blackPin;}
    }

}

let config = new Config();
export default config;