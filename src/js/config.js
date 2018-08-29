import L from 'leaflet'

let offlinePin = L.divIcon({className: 'icon-marker bg-true-black'});
let grayPin = L.divIcon({className: 'icon-marker bg-medium-gray'});
let darkBluePin = L.divIcon({className: 'icon-marker bg-dark-blue'});
let lightBluePin = L.divIcon({className: 'icon-marker bg-light-blue'});
let greyishBluePin = L.divIcon({className: 'icon-marker bg-greyish-blue'});
let bluePin = L.divIcon({className: 'icon-marker bg-blue'});
let orangePin = L.divIcon({className: 'icon-marker bg-orange'});
let blackPin = L.divIcon({className: 'icon-marker bg-black'});
let redPin = L.divIcon({className: 'icon-marker bg-red'});


class Config {

    SinrSignalLevel(value) {
        if (value === undefined) {return grayPin;}
        if (value > 20){return darkBluePin;}
        if (value > 15){return lightBluePin;}
        if (value > 10){return greyishBluePin;}
        if (value > 5){return bluePin;}
        if (value > 2){return orangePin;}
        if (value > -1){return redPin;}
        if (value <= -1){return blackPin;}
    }

    getLayersData()
    {
        return [
            {
                'id':1,
                'MAP_HAS_OVERLAY_ENV': "false",
                'description':'First map',
                'overlay_data': {
                    'path' : "images/layers/combined.png",
                    'corner1' : 
                    {'lat':-20.90974,'lng':-48.83651},
                    'corner2':
                    {'lat':-21.80963,'lng':-47.11802}}
            },
            {
                'id': 2,
                'MAP_HAS_OVERLAY_ENV': "false",
                'description': 'Second map',
                'overlay_data': {
                    'path': "images/layers/combined2.png",
                    'corner1':
                        { 'lat': -21.91974, 'lng': -49.84651 },
                    'corner2':
                        { 'lat': -22.81963, 'lng': -48.12802 }
                }
            }  
        ];
    }
}

let config = new Config();
export default config;
