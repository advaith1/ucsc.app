import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import buildingsData from "./temp3.json";
import buildingLookup from "./buildingLookup.json";
import { BASE_API_URL } from "../constants";

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
						<strong>${props.BUILDINGNAME}</strong><br>
						${props.ADDRESS || ''}<br>
					`);

					layer.on('click', (e) => {
						console.log('Coordinates:', e.latlng);
						const buildingName = feature.properties.BUILDINGNAME;
						let pisaName: string|string[] = buildingLookup[buildingName as keyof typeof buildingLookup];
						const pisaNames: string[] = Array.isArray(pisaName) ? pisaName : [pisaName];

						
						pisaNames.forEach((name: string) => {
							fetch(`${BASE_API_URL}/schedule/${name}`).then(res => res.json()).then(res => console.log(res));
						});
						}
					);
				}
			}).addTo(map);

			map.on('click', (e) => {
				console.log([e.latlng.lat, e.latlng.lng]);
			});

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