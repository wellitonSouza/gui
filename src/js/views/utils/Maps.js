/* eslint-disable */
import React, { Component } from 'react';
import { Link } from 'react-router';
import {
    Map, Marker, ImageOverlay, Tooltip, ScaleControl, Polyline,
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
    updateCurrentContextMenu(event) {
        console.log("updateCurrentContextMenu");
        const clickX = event.clientX;
        const clickY = event.clientY;
        const screenW = window.innerWidth;
        const screenH = window.innerHeight;
        const rootW = this.root.offsetWidth;
        const rootH = this.root.offsetHeight;
        const right = screenW - clickX > rootW;
        const left = !right;
        const top = screenH - clickY > rootH;
        const bottom = !top;
        if (right) this.root.style.left = `${clickX + 5}px`;
        if (left) this.root.style.left = `${clickX - rootW - 5}px`;
        if (top) this.root.style.top = `${clickY + 5}px`;
        if (bottom) this.root.style.top = `${clickY - rootH - 5}px`;
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
            center: [49.8419, 24.0315],
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
    updateClusters(clusterIndex, markersData) {
        console.log("updateClusters", clusterIndex, markersData);
    }
    createCluster(devicesData) {
        var markerList = [];
        for (var i = 0; i < devicesData.length; i++) {
            var dev = devicesData[i];
            //   var marker = L.marker(L.latLng(a[0], a[1]), {
            //       title: title
            //   });
            //   dev.lat, dev.lng
            var marker = L.marker(L.latLng(dev.pos), {
                title: dev.label
            });
            // marker.bindPopup(title);
            markerList.push(marker);
        }
        return L.markerClusterGroup({
            chunkedLoading: true
        }).addLayers(markerList);
    }
    componentDidUpdate() {
        console.log("componentDidUpdate: clustererData", this.props.clustererData);
        //   let markerList = markersData;
        //   if (markersData === undefined)
        //   {
        //   markerList = [];
        //   }
        //   clustererData
        this.clusters = {};
        this.props.clustererData.map((element, i1) => {
            this.clusters[element.index] = this.createCluster(element.devices);
            this.map.addLayer(this.clusters[element.index]);
        })
        // check if data has changed
        // if (this.props.markersData !== markersData) {
        //   this.updateMarkers(this.props.markersData);
        // }
    }
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

    this.setTiles = this.setTiles.bind(this);
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
        this.contextMenu.updateCurrentContextMenu(event);
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
            loadedLayers: false,
            center: (this.props.config.mapCenter ? this.props.config.mapCenter : [-21.277057, -47.9590129]),
            zoom: (this.props.zoom ? this.props.zoom : this.props.config.mapZoom ? this.props.config.mapZoom : 7),
        };

        this.setTiles = this.setTiles.bind(this);
        this.handleTracking = this.handleTracking.bind(this);
        this.handleContextMenu = this.handleContextMenu.bind(this);
        this.handleCenter = this.handleCenter.bind(this);
        this.toggleLayer = this.toggleLayer.bind(this);
        this.layers = [];
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
                maxZoom: 20,
                type: 'maptile',
                language: 'eng',
                format: 'png8',
                size: '256'
                });

                var OpenMapSurfer_Roads = L.tileLayer('https://korona.geog.uni-heidelberg.de/tiles/roads/x={x}&y={y}&z={z}', {
                    maxZoom: 20,
                    attribution: 'Imagery from <a href="http://giscience.uni-hd.de/">GIScience Research Group @ University of Heidelberg</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                });


                L.control
                  .layers({
                      Map: OpenMapSurfer_Roads,
                     Hybrid: HERE_hybridDay
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
        this.props.toggleTracking(device_id);

        // closing ctxMenu
        this.setState({ visible: false });
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

        // this.refs.map.leafletElement.locate()
        const clickX = event.clientX;
        const clickY = event.clientY;
        const screenW = window.innerWidth;
        const screenH = window.innerHeight;
        const rootW = this.root.offsetWidth;
        const rootH = this.root.offsetHeight;

        const right = (screenW - clickX) > rootW;
        const left = !right;
        const top = (screenH - clickY) > rootH;
        const bottom = !top;
        if (right) this.root.style.left = `${clickX + 5}px`;
        if (left) this.root.style.left = `${clickX - rootW - 5}px`;
        if (top) this.root.style.top = `${clickY + 5}px`;
        if (bottom) this.root.style.top = `${clickY - rootH - 5}px`;
    }

    // resize() {
    //     if (this.leafletMap !== undefined) {
    //         this.leafletMap.leafletElement.invalidateSize();
    //     }
    // }

    setTiles(isMap) {
        this.setState({ isTerrain: isMap });
    }

    handleCenter() {
        if (this.props.center) {
            this.setState({ center: this.props.center });
        } else {
            this.setState({ center: [-21.277057, -47.9590129] });
        }
    }

    render() {
        // console.log('PropsSmallPositionRenderer: ', this.props);
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


        return <Map center={this.props.center ? this.props.center : this.state.center} zoom={this.state.zoom} ref={m => {
            this.leafletMap = m;
        }}>
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
        console.log("LayerBox: render.");
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
