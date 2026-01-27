import { readFileSync, writeFileSync } from 'fs';
const data = JSON.parse(readFileSync('./temp3.json', 'utf8'));
const lookupData = JSON.parse(readFileSync('./buildingLookup.json', 'utf8'));

const buildingsToKeep = Object.keys(lookupData);
const temp4 = {
	"type": "FeatureCollection",
	"features": data.features.filter(f => buildingsToKeep.includes(f.properties.BUILDINGNAME))
}



writeFileSync('temp4.json', JSON.stringify(temp4));