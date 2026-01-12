import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import buildingsData from "./temp3.json";

// Convert Esri JSON to GeoJSON
function esriToGeoJSON(esriData: any) {
	return {
		type: "FeatureCollection",
		features: esriData.features.map((feature: any) => ({
			type: "Feature",
			properties: feature.attributes,
			geometry: {
				type: "Polygon",
				coordinates: feature.geometry.rings.map((ring: any) =>
					ring.map((coord: any) => {
						// Convert from Web Mercator (EPSG:3857) to WGS84 (EPSG:4326)
						const x = coord[0];
						const y = coord[1];
						const lng = (x * 180) / 20037508.34;
						const lat = (Math.atan(Math.exp((y * Math.PI) / 20037508.34)) * 360) / Math.PI - 90;
						return [lng, lat];
					})
				)
			}
		}))
	};
}

export default function Map() {
	const mapRef = useRef<HTMLDivElement>(null);
	const mapInstanceRef = useRef<L.Map | null>(null);

	useEffect(() => {
		if (mapRef.current && !mapInstanceRef.current) {
			const map = L.map(mapRef.current, {
				maxBounds: L.latLngBounds(
					L.latLng(36.9750, -122.0750),
					L.latLng(37.0050, -122.0450)
				),
				maxBoundsViscosity: 1.0,
				minZoom: 15,
				maxZoom: 19,
			}).setView([36.9914, -122.0609], 15);

			L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png', {
				attribution: '&copy; <a href="https://carto.com/attributions">CARTO</a>',
				subdomains: 'abcd',
				maxZoom: 20
			}).addTo(map);

			// L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.{ext}', {
			// 	minZoom: 0,
			// 	maxZoom: 20,
			// 	attribution: '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
			// 	ext: 'png'
			// }).addTo(map);

			// Convert and add buildings
			const geojson = buildingsData;//esriToGeoJSON(buildingsData);

			L.geoJSON(geojson, {
				style: {
					color: '#3388ff',
					weight: 2,
					opacity: 0.8,
					fillOpacity: 0.3
				},
				onEachFeature: (feature, layer) => {
					const props = feature.properties;
					layer.bindPopup(`
                        <strong>${props.BUILDINGNAME || props.LABELNAME}</strong><br>
                        ${props.ADDRESS || ''}<br>
                        ${props.DEPARTMENTS || ''}<br>
                        <a href="${props.BUILDINGURL}" target="_blank">More Info</a>
                    `);

					// Add click event
					layer.on('click', () => {
						console.log('Clicked building:', props.BUILDINGNAME);
					});
				}
			}).addTo(map);

			mapInstanceRef.current = map;
		}

		return () => {
			if (mapInstanceRef.current) {
				mapInstanceRef.current.remove();
				mapInstanceRef.current = null;
			}
		};
	}, []);

	return (
		<div ref={mapRef} style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 0 }} />
	)
}