/* eslint-disable */
import React, { Component } from 'react';
import { Link } from 'react-router';
import {
    TileLayer, Map, Marker, ImageOverlay, Tooltip, ScaleControl, Polyline,
} from 'react-leaflet';
import L from 'leaflet';
// import * as L from "leaflet";
import DivIcon from 'react-leaflet-div-icon';
import * as pins from '../../config'


const trackingPin = <DivIcon className="icon-marker bg-tracking-marker" />;
const listLatLngs = [];




class ContextMenu {
    constructor() {
        console.log("ContextMenu loaded.");
    }
    // context menu based at: https://codepen.io/devhamsters/pen/yMProm
    updateCurrentContextMenu(event,root) {
        console.log("updateCurrentContextMenu");
        const clickX = event.clientX;
        const clickY = event.clientY;
        const screenW = window.innerWidth;
        const screenH = window.innerHeight;
        const rootW = root.offsetWidth;
        const rootH = root.offsetHeight;
        const right = screenW - clickX > rootW;
        const left = !right;
        const top = screenH - clickY > rootH;
        const bottom = !top;
        if (right) root.style.left = `${clickX + 5}px`;
        if (left) root.style.left = `${clickX - rootW - 5}px`;
        if (top) root.style.top = `${clickY + 5}px`;
        if (bottom) root.style.top = `${clickY - rootH - 5}px`;
    }
}


class CustomMap extends Component {
    constructor(props) {
        super(props);
        this.map = null;
        this.clusters = {};
        this.updateClusters = this.updateClusters.bind(this);
        this.createCluster = this.createCluster.bind(this);
    }
    componentDidMount() {
        console.log("CustomMap: componentDidMount");
        // create map
        this.map = L.map("map", {
            zoom: 16,
            layers: [
                L.tileLayer("http://{s}.tile.osm.org/{z}/{x}/{y}.png", {
                    attribution:
                        '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                })
            ]
        });
        // add layer
        // this.layer = L.layerGroup().addTo(this.map);
        // this.updateMarkers(this.props.markersData);
        // this.clusters = {};
    }

    // updateClusters(clusterIndex, markersData) {
    //     console.log("updateClusters", clusterIndex, markersData);
    // }

    // createCluster(devicesData) {
    //     var markerList = [];
    //     for (var i = 0; i < devicesData.length; i++) {
    //         var dev = devicesData[i];
    //         //   var marker = L.marker(L.latLng(a[0], a[1]), {
    //         //       title: title
    //         //   });
    //         //   dev.lat, dev.lng
    //         var marker = L.marker(L.latLng(dev.pos), {
    //             title: dev.label
    //         });
    //         // marker.bindPopup(title);
    //         markerList.push(marker);
    //     }
    //     return L.markerClusterGroup({
    //         chunkedLoading: true
    //     }).addLayers(markerList);
    // }

    // componentDidUpdate() {
    //     console.log("componentDidUpdate: clustererData", this.props.clustererData);
    //     //   let markerList = markersData;
    //     //   if (markersData === undefined)
    //     //   {
    //     //   markerList = [];
    //     //   }
    //     //   clustererData
    //     this.clusters = {};
    //     this.props.clustererData.map((element, i1) => {
    //         this.clusters[element.index] = this.createCluster(element.devices);
    //         this.map.addLayer(this.clusters[element.index]);
    //     })
    //     // check if data has changed
    //     // if (this.props.markersData !== markersData) {
    //     //   this.updateMarkers(this.props.markersData);
    //     // }
    // }

    //   updateMarkers(markersData) {
    //     this.layer.clearLayers();
    //     markersData.forEach(marker => {
    //       L.marker(marker.latLng, { title: marker.title }).addTo(this.layer);
    //     });
    //   }


    render() {
        console.log("CustomMap - Render: ", this.props);
        return <div id="map" />;
    }
}



// BigPositionRenderer will use CustomMap instead react-leaflet-map implementation
class BigPositionRenderer extends Component {
  constructor(props) {
    super(props);
    this.state = {
        corners: { topLeft: 100, topRight: 100, bottomLeft: 0, bottomRight: 0 },
        contextMenuVisibity: false,
      layers: [],
      loadedLayers: false,
      center: this.props.config.mapCenter
        ? this.props.config.mapCenter
        : [-21.277057, -47.9590129],
      zoom: this.props.zoom
        ? this.props.zoom
        : this.props.config.mapZoom
          ? this.props.config.mapZoom
          : 7
    };

    this.handleContextMenu = this.handleContextMenu.bind(this);
    this.toggleLayer = this.toggleLayer.bind(this);
    this.contextMenu = new ContextMenu();
    this.layers = [];
  }

  componentDidMount() {
    if (!this.state.loadedLayers) {
      let layers = this.props.config.mapObj;
      for (let index in layers) {
        layers[index].isVisible = true;
      }
      this.setState({ loadedLayers: true, layers: layers });
    }
  }

  toggleLayer(id) {
    let layers = this.state.layers;
    for (let index in layers)
      if (layers[index].id === id)
        layers[index].isVisible = !layers[index].isVisible;
    this.setState({ layers: layers });
  }

    handleContextMenu(e, device_id) {
        let event = e.originalEvent;
        event.preventDefault();
        if (!this.props.allowContextMenu) {
            return false;
        }
        this.setState({
            contextMenuVisibity: true,
            selectedDeviceId: device_id
        });
        // this.refs.map.leafletElement.locate()
        this.contextMenu.updateCurrentContextMenu(event,this.root);
    };

  render() {
      console.log("BigPositionRenderer: Props: ", this.props);

    function getPin(device, config) {
      let varToMeasure = "_" + config.measureAttribute;

      if (device.hasOwnProperty("unique_key")) {
        return trackingPin;
      }
      if (device.hasOwnProperty(varToMeasure) && config.mapColorActive) {
        for (let index in config.range) {
          if (
            config.range.hasOwnProperty(index) &&
            config.range[index].value <= device[varToMeasure]["0"].value
          ) {
            let method = "mapPin" + config.range[index].pin;
            return pins[method];
          }
        }
      }
      return pins.mapPinBlack;
    }


    // Get list of positions for each device
    for (const k in this.props.listPositions) {
      listLatLngs[k] = [];
      for (const j in this.props.listPositions[k]) {
        listLatLngs[k].push(this.props.listPositions[k][j].position);
      }
    }

      return <CustomMap center={this.state.center} clustererData={this.props.clusterers} positionData={this.props.listPositions} deviceData={this.props.devices} zoom={this.state.zoom}>
      </CustomMap>;
  }
}



class SmallPositionRenderer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false, // is ctxMenu visible?
            selected_device_id: -1,
            isTerrain: true,
            selectedPin: true,
            layers: [],
            bounds: false,
            loadedLayers: false,
            zoom: (this.props.zoom ? this.props.zoom : this.props.config.mapZoom ? this.props.config.mapZoom : 7),
        };
        
        this.handleTracking = this.handleTracking.bind(this);
        this.handleContextMenu = this.handleContextMenu.bind(this);
        this.toggleLayer = this.toggleLayer.bind(this);
        this.layers = [];
        this.bounds = null;
        
        this.contextMenu = new ContextMenu();
        this.handleMapClick = this.handleMapClick.bind(this);
    }

    componentDidMount() {
        if (!this.state.loadedLayers) {
            if (this.leafletMap !== undefined) {
                // const mapLayer = L.tileLayer(
                //   "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
                //   {
                //     attribution:
                //       '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                //   }
                // ).addTo(this.leafletMap.leafletElement);

                var HERE_hybridDay = L.tileLayer('https://{s}.{base}.maps.cit.api.here.com/maptile/2.1/{type}/{mapID}/hybrid.day/{z}/{x}/{y}/{size}/{format}?app_id={app_id}&app_code={app_code}&lg={language}', {
                attribution: 'Map &copy; 1987-2014 <a href="http://developer.here.com">HERE</a>',
                subdomains: '1234',
                mapID: 'newest',
                app_id: '<your app_id>',
                app_code: '<your app_code>',
                base: 'aerial',
                maxZoom: 17,
                type: 'maptile',
                language: 'eng',
                format: 'png8',
                size: '256'
                });

                var OpenStreetMap_Mapnik = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    maxZoom: 17,
                    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                });

                var Esri_WorldImagery = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
                    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
                });

                L.control
                  .layers({
                    Map: OpenStreetMap_Mapnik,
                    Satelite: Esri_WorldImagery
                  })
                  .addTo(this.leafletMap.leafletElement);
            }
            let layers = this.props.config.mapObj;
            console.log("I got my layers! ", layers);
            for (let index in layers) {
                layers[index].isVisible = true;
            }

            
            this.setState({ loadedLayers: true, layers: layers });
        }
    }

    handleTracking(device_id) {
        console.log("handleTracking", device_id);
        this.props.toggleTracking(device_id);
        this.setState({ visible: false }); // closing ctxMenu
    }

    toggleLayer(id) {
        let layers = this.state.layers;
        for (let index in layers)
            if (layers[index].id === id)
                layers[index].isVisible = !layers[index].isVisible;
        this.setState({ layers: layers });
    }

    // context menu based at
    // https://codepen.io/devhamsters/pen/yMProm
    handleContextMenu(e, device_id) {
        if (!this.props.allowContextMenu) {
            return false;
        }
        const event = e.originalEvent;
        event.preventDefault();
        this.setState({ visible: true, selected_device_id: device_id });

        this.contextMenu.updateCurrentContextMenu(event, this.root);
    }

    handleMapClick(e)
    {
        if (!this.props.allowContextMenu) {
          return false;
        }

        console.log("handleMapClick");
        const event = e.originalEvent;
        event.preventDefault();
        if (this.state.visible)
            this.setState({ visible: false});
    }

    render() {
        console.log('PropsSmallPositionRenderer: ', this.props);
        function getPin(device, config) {
            let varToMeasure = "_" + config.measureAttribute;

            if (device.hasOwnProperty('unique_key')) {
                return trackingPin;
            }
            if (device.hasOwnProperty(varToMeasure) && config.mapColorActive) {
                for (let index in config.range) {
                    if (config.range.hasOwnProperty(index) && config.range[index].value <= device[varToMeasure]["0"].value) {
                        let method = "mapPin" + config.range[index].pin;
                        return pins[method];
                    }
                }
            }
            return pins.mapPinBlack;
        }


        const parsedEntries = this.props.devices.reduce((result, k) => {
            if (k.position !== undefined) {
                result.push({
                    id: k.id,
                    pos: k.position,
                    name: k.label,
                    pin: getPin(k, this.props.config),
                    timestamp: k.timestamp,
                    tracking: k.tracking,
                    key: (k.unique_key ? k.unique_key : k.id),
                });
            }

            return result;
        }, []);



        const contextMenu = this.state.visible ? (
            <div
                ref={(ref) => {
                    this.root = ref;
                }}
                className="contextMenu"
            >
                <Link to={`/device/id/${this.state.selected_device_id}/detail`} title="View details">
                    <div className="contextMenu--option cmenu">
                        <i className="fa fa-info-circle" />
                        Details
                    </div>
                </Link>
                <div
                    className="contextMenu--option cmenu"
                    onClick={() => {
                        this.handleTracking(this.state.selected_device_id);
                    }}
                >
                    <img src="images/icons/location.png" />
                    Toggle tracking
                </div>
            </div>
        ) : (
                null
            );

        // Get list of positions for each device
        for (const k in this.props.listPositions) {
            listLatLngs[k] = [];
            for (const j in this.props.listPositions[k]) {
                listLatLngs[k].push(this.props.listPositions[k][j].position);
            }
        }

        console.log("parsedEntries", parsedEntries);
        // set initial map center or boundaries
        let positionList = [];
        parsedEntries.map((element, index) => {
          positionList.push(L.latLng(element.pos[0], element.pos[1]));
        });
        if (positionList.length && !this.state.bounds && this.leafletMap !== undefined) {
            if (positionList.length > 1)
            {
                this.bounds = L.latLngBounds(positionList);
                this.leafletMap.leafletElement.fitBounds(this.bounds);
                this.setState({ bounds: true });
            }
            else
            {
                this.leafletMap.leafletElement.panTo(positionList[0]);
                this.setState({ bounds: true });
            }
        } 
        
        // set center
        // this.center = this.props.config.mapCenter ? this.props.config.mapCenter : positionList[0] ;
        // if (this.center == undefined) {
        //     this.center = [-20.90974, -48.83651];
        // }

        //  center={this.center}  bounds={this.bounds}
        return <Map zoom={this.state.zoom} ref={m => {
            this.leafletMap = m;
        }} onClick={this.handleMapClick}>
            <TileLayer
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
            />
            <div className="col s12 layer-box" >
                {
                    (this.props.showLayersIcons && this.state.layers.length) ?
                        this.state.layers.map(lyr => (
                            <LayerBox
                                key={lyr.id}
                                toggleLayer={this.toggleLayer}
                                config={lyr}
                            />
                        )) : null
                }
            </div>
            {contextMenu}
            {parsedEntries.map(k => {

                return <Marker onContextMenu={e => {
                    this.handleContextMenu(e, k.id);
                }} onClick={e => {
                    this.handleContextMenu(e, k.id);
                }} position={k.pos} key={k.key} icon={k.pin}>
                    <Tooltip direction='top' offset={[0, -40]}>
                        <span>
                            {k.name} : {k.timestamp}
                        </span>
                    </Tooltip>
                    {listLatLngs[k.id] && k.tracking && this.props.showPolyline ? <Polyline positions={listLatLngs[k.id]} color="#7fb2f9" dashArray="10,10" repeatMode={false} /> : null}
                </Marker>;
            })}
            <ScaleControl />
        </Map>;

    }
}


class LayerBox extends Component {
    constructor(props) {
        super(props);
        // this.state = { visible: true };
        this.toggleLayer = this.toggleLayer.bind(this);
    }

    toggleLayer() {
        console.log("layerbox: togglelayer: ", this.props.config.id);
        this.props.toggleLayer(this.props.config.id);
        // this.setState({visible: !this.state.visible});
    }

    render() {
        let corner1 = L.latLng(this.props.config.overlay_data.corner1.lat, this.props.config.overlay_data.corner1.lng);
        let corner2 = L.latLng(this.props.config.overlay_data.corner2.lat, this.props.config.overlay_data.corner2.lng);
        const layerMapBounds = L.latLngBounds(corner1, corner2);
        const layerOpacity = 0.3;
        const imageOverlay = this.props.config.isVisible ? <ImageOverlay opacity={layerOpacity} bounds={layerMapBounds} url={this.props.config.overlay_data.path} /> : null;
        console.log("imageOverlay", this.props.config);
        return <div className="layer-mr">
            <div title={this.props.config.description} className={"layer-div " + (this.props.config.isVisible ? "active-btn" : "")} onClick={this.toggleLayer}>
                <i className={"fa fa-map"} />
            </div>
            {imageOverlay}
        </div>;
    }
}


export { SmallPositionRenderer, BigPositionRenderer };
