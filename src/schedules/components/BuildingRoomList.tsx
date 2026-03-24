import { RoomsInBuilding } from "../../types";
import React, { useContext } from "react";
import { MapContext } from "../MapContext";
import "../styles/Map.css";

interface RoomButtonProps {
	buildingData: RoomsInBuilding;
	shouldDisplayName: boolean;
}

export default function BuildingRoomList({ buildingData, shouldDisplayName }: RoomButtonProps) {
	const ctx = useContext(MapContext);

	const onClick = (e: React.MouseEvent<HTMLButtonElement>, room: string) => {
		e.stopPropagation();
		ctx!.setSelectedBuilding(buildingData.name);
		ctx!.setSelectedRoom(room);
	}

	return (
		<div>
			{shouldDisplayName && <p style={{ marginBottom: '4px' }}>{buildingData.name}</p>}
			<div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
				{buildingData.data.length > 0 ? 
				buildingData.data.map((roomNumber: string, index: number) => (
					<button key={index} className="popup-button" onClick={(e) => onClick(e, roomNumber)}>
						{roomNumber}
					</button>
				)) : (
					<button
						className="mapGoldButton"
						onClick={(e) => onClick(e, "-1")}>
						View Schedule
					</button>
				)}
			</div>
		</div>
	)
}



/*

The API is very simple. Given the name of a location (as specified by Pisa, eg PhysSciences instead of "Physical Sciences Building")
return the rooms associated with that building. 
Then, given the location specified by Pisa and a building, return the schedule of classes for that room.

But what if a location doesn't have rooms? For instance, the East Field is a "building", but has no rooms, yet it offers classes there.

And what if a location has multiple buildings in it? For instance, on Pisa, "Dance Studio", "E FieldHouse", "Martial Arts", and "PE Activity Rm" are all 
different places. But all of them are in the same physical building (East Field House).

Only a handful of places are like this (and usually theyre athletic buildings). I don't think its worth rearchitecting the frontend to handle different flows of 
UI (eg building -> room list -> schedule, and building -> schedule, and building -> buildings -> schedule). It's easiest to just stick a "View Schedule"
button that sets the room number to be -1. 

This is my justification for why its like this. So anyone going "why didn't you do it like this? why didn't you do it like that?" can kill themselves.

*/