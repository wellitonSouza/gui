var alt = require('../alt');
var MeasureActions = require('../actions/MeasureActions');
var TrackingActions = require('../actions/TrackingActions');

import util from '../comms/util';

class MeasureStore {
  constructor() {
    //this.devices = {};
    this.data = {}
    this.tracking = {};
    this.error = null;

    this.bindListeners({
      handleAppendMeasures: MeasureActions.APPEND_MEASURES,
      handleUpdateMeasures: MeasureActions.UPDATE_MEASURES,
      handleFailure: MeasureActions.MEASURES_FAILED,
      //handleUpdatePosition: MeasureActions.UPDATE_POSITION,

      handleTrackingFetch: TrackingActions.FETCH,
      handleTrackingSet: TrackingActions.SET,
      handleTrackingDismiss: TrackingActions.DISMISS
    });
    // handleFetchMeansures: MeasureActions.FETCH_MEASURES,
  }


  handleTrackingFetch(){}
  handleTrackingSet(history){
    this.tracking[history.device_id] = history.data;
  }

  handleTrackingDismiss(device_id){
    if (this.tracking.hasOwnProperty(device_id)){
      delete this.tracking[device_id];
    }
  }

  handleUpdateMeasures(measureData) {
    if(measureData !== null || measureData !== undefined){
      this.data[measureData.id] = measureData;
    }
  }

  handleAppendMeasures(measureData){
    function parserPosition(position){
      if (position.toString().indexOf(",") > -1) {
        let parsedPosition = position.split(",");
        if(parsedPosition.length > 1){
          return [parseFloat(parsedPosition[0]), parseFloat(parsedPosition[1])];
        } 
      } else {
        return undefined;
      }
    }

    let now = new Date();
    for(let id in this.data){
      if(this.data[id].id == measureData.metadata.deviceid){
        for(let i in this.data[id].attrs){
          for(let j in this.data[id].attrs[i]){
            for(let label in measureData.attrs){
              if(this.data[id].attrs[i][j].label == label){
                let attrValue = {"device_id": this.data[id].id, "ts": now.toISOString(), "value":measureData.attrs[label], "attr": label };
                if(this.data[id].attrs[i][j].value_type == "geo:point"){
                  this.data[id].position = parserPosition(measureData.attrs[label]);
                  if(this.tracking[measureData.metadata.deviceid] !== undefined && this.tracking[measureData.metadata.deviceid] !== null){
                    let trackingStructure = {"device_id": measureData.metadata.deviceid, "position":parserPosition(measureData.attrs[label]), "timestamp":util.iso_to_date(now)}
                    this.tracking[measureData.metadata.deviceid] = this.tracking[measureData.metadata.deviceid].concat(trackingStructure);
                  }
                } else{
                  // attr is not geo
                  if(this.data[id]['_'+label] !== undefined){              
                    this.data[id]['_'+label] = this.data[id]['_'+label].concat(attrValue);
                    if(this.data[id]['_'+label].length > 10){
                      this.data[id]['_'+label].shift();
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }

   handleFetchMeasures(measureData) {
     if (! ('device' in measureData)) { console.error("Missing device id"); }
     if (! ('attr' in measureData)) { console.error("Missing attr id"); }

     if (! (measureData.device in this.devices)) {measureData;
       this.devices[measureData.device] = {}
     }

     this.devices[measureData.device][measureData.attr.name] = JSON.parse(JSON.stringify(measureData.attr));
     this.devices[measureData.device][measureData.attr.name].loading = true;
   }

  handleFailure(error) {
    this.error = error;
  }
}

var _store =  alt.createStore(MeasureStore, 'MeasureStore');
export default _store;
