import React, { useState } from 'react';

import { Map, TileLayer, Popup, Marker } from 'react-leaflet';
import { LeafletMouseEvent, LatLng } from 'leaflet';

interface MapProps {
    onMark: Function;
    position: { latitude: number, longitude: number }
}

const MapComponent: React.FC<MapProps> = ({ onMark, position }) => {
    return <Map center={[position.latitude, position.longitude]} zoom={18} onclick={(e: LeafletMouseEvent) => {
        onMark(e.latlng.lat, e.latlng.lng);
    }}>
        <TileLayer
            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[position.latitude, position.longitude]} />
    </Map>
}

export default MapComponent