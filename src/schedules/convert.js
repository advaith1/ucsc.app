import { readFileSync, writeFileSync } from 'fs';
const data = JSON.parse(readFileSync('./temp.json', 'utf8'));

let fixed = {
	type: "FeatureCollection",
	features: data.features.map((feature) => ({
		type: "Feature",
		properties: feature.attributes,
		geometry: {
			type: "Polygon",
			coordinates: feature.geometry.rings.map((ring) =>
				ring.map((coord) => {
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
}

fixed = {
	type: "FeatureCollection",
	features: fixed.features.filter(f => {
		return f.properties.ZIPCODE == 95064
	})
}

writeFileSync('temp3.json', JSON.stringify(fixed));