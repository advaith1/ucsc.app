import { useState } from "react";
import { MapContainer, TileLayer, GeoJSON, Popup, useMapEvents } from "react-leaflet";
import { Layer, LatLng } from "leaflet";
import "leaflet/dist/leaflet.css";
import buildingsData from "./temp3.json";
import buildingLookup from "./buildingLookup.json";
import { BASE_API_URL } from "../constants";
import { Feature, Geometry } from "geojson";

interface BuildingProperties {
    BUILDINGNAME: string;
    ADDRESS: string;
}

function BuildingPopup({ name, address }: { name: string; address: string }) {
    const [scheduleData, setScheduleData] = useState<unknown>(null);
    const [loading, setLoading] = useState(false);

    const fetchSchedule = () => {
        setLoading(true);
        let pisaName: string | string[] = buildingLookup[name as keyof typeof buildingLookup];
        const pisaNames: string[] = Array.isArray(pisaName) ? pisaName : [pisaName];

        Promise.all(
            pisaNames.map((n: string) =>
                fetch(`${BASE_API_URL}/schedule/${n}`).then(res => res.json())
            )
        ).then(results => {
            setScheduleData(results);
            setLoading(false);
        });
    };

    return (
        <div>
            <strong>{name}</strong>
            <br />
            {address}
            <br />
            <button onClick={fetchSchedule} disabled={loading}>
                {loading ? "Loading..." : "View Schedule"}
            </button>
            {scheduleData && <pre>{JSON.stringify(scheduleData, null, 2)}</pre>}
        </div>
    );
}

// Component to handle map clicks
function MapClickHandler() {
    useMapEvents({
        click: (e) => {
            console.log([e.latlng.lng, e.latlng.lat]);
        }
    });
    return null;
}

export default function Map() {
    const [selectedFeature, setSelectedFeature] = useState<Feature<Geometry, BuildingProperties> | null>(null);
    const [popupPosition, setPopupPosition] = useState<LatLng | null>(null);

    const bounds: [[number, number], [number, number]] = [
        [36.9750, -122.0750],
        [37.0050, -122.0450]
    ];

    const onEachFeature = (feature: Feature<Geometry, BuildingProperties>, layer: Layer) => {
        layer.on('click', (e) => {
            console.log([e.latlng.lng, e.latlng.lat]);
            setSelectedFeature(feature);
            setPopupPosition(e.latlng);
        });
    };

    return (
        <MapContainer
            center={[36.9914, -122.0609]}
            zoom={15}
            maxBounds={bounds}
            maxBoundsViscosity={1.0}
            minZoom={15}
            maxZoom={30}
            style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 0 }}
        >
            <TileLayer
                url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png"
                attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
                subdomains="abcd"
                maxZoom={30}
            />
            <GeoJSON
                data={buildingsData as GeoJSON.GeoJsonObject}
                style={{
                    color: '#3388ff',
                    weight: 2,
                    opacity: 0.8,
                    fillOpacity: 0.3
                }}
                onEachFeature={onEachFeature}
            />
            {selectedFeature && popupPosition && (
                <Popup 
                    position={popupPosition}
                    eventHandlers={{
                        remove: () => setSelectedFeature(null)
                    }}
                >
                    <BuildingPopup
                        name={selectedFeature.properties.BUILDINGNAME}
                        address={selectedFeature.properties.ADDRESS}
                    />
                </Popup>
            )}
            <MapClickHandler />
        </MapContainer>
    );
}