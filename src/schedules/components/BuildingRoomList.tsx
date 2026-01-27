import { RoomsInBuilding } from "../../types";
import React, { useContext } from "react";
import { MapContext } from "../MapContext";

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
				{buildingData.data.map((roomNumber: string, index: number) => (
					<button key={index} className="popup-button" onClick={(e) => onClick(e, roomNumber)}>
						{roomNumber}
					</button>
				))}
			</div>
		</div>
	)
}
