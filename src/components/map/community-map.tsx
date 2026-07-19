"use client";

import { useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const GARDENS = [
    { id: 1, name: "Horta do Bosque Alemão", lat: -25.4177, lng: -49.2915 },
    { id: 2, name: "Jardim Comunitário Batel", lat: -25.4372, lng: -49.2871 },
    { id: 3, name: "Praça Verde Água Verde", lat: -25.4453, lng: -49.2793 },
    { id: 4, name: "Horta Escolar Centro Cívico", lat: -25.4166, lng: -49.2685 },
    { id: 5, name: "Coletivo Jardim das Américas", lat: -25.4514, lng: -49.2359 },
    { id: 6, name: "Reflorestamento Barigui", lat: -25.4225, lng: -49.3079 },
];

function useMarkerIcon() {
    return useMemo(
        () =>
            L.divIcon({
                className: "reflora-marker",
                html: `<span class="reflora-marker-dot"></span>`,
                iconSize: [14, 14],
                iconAnchor: [7, 7],
            }),
        []
    );
}

export function CommunityMap() {
    const icon = useMarkerIcon();

    return (
        <MapContainer
            center={[-25.4284, -49.2733]}
            zoom={12}
            scrollWheelZoom={false}
            className="h-full w-full"
        >
            <TileLayer
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
            />
            {GARDENS.map((garden) => (
                <Marker key={garden.id} position={[garden.lat, garden.lng]} icon={icon}>
                    <Popup>{garden.name}</Popup>
                </Marker>
            ))}
        </MapContainer>
    );
}