import {useState } from "react";
import { MapContainer, TileLayer, GeoJSON, Popup, useMapEvents } from "react-leaflet";
import { Layer, LatLng } from "leaflet";
import "leaflet/dist/leaflet.css";
import "./styles/Map.css";
import buildingsData from "./data/temp4.json";
import { Feature, Geometry } from "geojson";
import BuildingPopup from "./BuildingPopup";

interface BuildingProperties {
	BUILDINGNAME: string;
	ADDRESS: string;
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
						locationName={selectedFeature.properties.BUILDINGNAME}
						locationAddress={selectedFeature.properties.ADDRESS}
					/>
				</Popup>
			)}
			<MapClickHandler />
		</MapContainer>
	);
}