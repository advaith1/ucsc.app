import { useState } from "react";
import buildingLookup from "./buildingLookup.json";
import { BuildingData } from "../types";


export default function GetRooms() {
	const [scheduleData, setRoomData] = useState<Array<BuildingData>>([]);
	const [loading, setLoading] = useState(false);

	const fetchRooms = (name: string) => {
		setLoading(true);
		let pisaName: string | string[] = buildingLookup[name as keyof typeof buildingLookup];
		const pisaNames: string[] = Array.isArray(pisaName) ? pisaName : [pisaName];

		Promise.all(
			pisaNames.map((n: string) =>
				fetch(`http://10.0.0.89:8000/schedule/${encodeURIComponent(n).replace(/%2F/g, '%252F')}`)
					.then(res => res.json())
					.then(data => ({ name: n, data }))
			)
		).then(results => {
			console.log(results)
			setRoomData(results);
			setLoading(false);
		});
	};

	return [fetchRooms, scheduleData, setRoomData, loading];
}