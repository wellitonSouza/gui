import React from 'react';
import { Map as LeafletMap, TileLayer, Marker } from 'react-leaflet';
import PropTypes from 'prop-types';

const LeafMap = ({ point }) => (
    <LeafletMap
        center={point}
        zoom={14}
        attributionControl
        zoomControl
        doubleClickZoom
        scrollWheelZoom
        dragging
        animate
        easeLinearity={0.35}
    >
        <TileLayer
            url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"
        />
        <Marker position={point} />
    </LeafletMap>
);

LeafMap.propTypes = {
    point: PropTypes.shape({}).isRequired,
};


export default LeafMap;
