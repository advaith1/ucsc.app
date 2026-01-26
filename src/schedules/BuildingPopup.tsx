import { useState, useEffect } from "react";
import GetRooms from "./FetchRooms";
import buildingLookup from "./buildingLookup.json";
import { BuildingData, TimeBlock } from "../types";
import ScheduleTimeBlock from "./ScheduleTimeBlock";

interface RoomButtonProps {
	buildingData: BuildingData;
	shouldDisplayName: boolean;
	onButtonClick: (roomNumber: string) => void;
}

function RoomButtons({ buildingData, shouldDisplayName, onButtonClick }: RoomButtonProps) {
	return (
		<div>
			{shouldDisplayName && <p style={{ marginBottom: '4px' }}>{buildingData.name}</p>}
			<div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
				{buildingData.data.map((r: string, index: number) => (
					<button key={index} className="popup-button" onClick={(e) => { e.stopPropagation(); onButtonClick(r) }}>
						{r}
					</button>
				))}
			</div>
		</div>
	)
}

export default function BuildingPopup({ name, address }: { name: string; address: string }) {
	const [fetchRooms, scheduleData, setRoomData, loading] = GetRooms() as [(name: string) => void, Array<BuildingData>, (a: any) => void, boolean];
	const [selectedRoom, setSelectedRoom] = useState<string>("");
	const [selectedSchedule, setSelectedSchedule] = useState<Array<TimeBlock>>([]);

	// just checking if selected schedule length > 1 is not enough to determine if a room was selected
	// because a room can have no classes in it. i need a dedicated boolean to know if it was selected or not
	const [wasRoomSelected, setWasRoomSelected] = useState<boolean>(false);

	const onClick = (room: string) => {
		setSelectedRoom(room);
		setWasRoomSelected(true);
		const uriEncoded = encodeURIComponent(buildingLookup[name as keyof typeof buildingLookup]).replace(/%2F/g, '%252F');
		fetch(`http://10.0.0.89:8000/schedule/2260/${uriEncoded}/${room}/0`)
			.then(res => res.json())
			.then(res => {
				setSelectedSchedule(res);
			});
	}


	useEffect(() => {
		setRoomData([]);
		setSelectedRoom("");
		setSelectedSchedule([]);
		setWasRoomSelected(false);
		fetchRooms(name);

	}, [name, address]);

	return (
		!wasRoomSelected ? (
			<div style={{ height: 'auto', maxHeight: '200px', overflow: 'scroll', color: 'var(--gold)' }}>
				<strong>{name}</strong>
				<br />
				{address}
				<br />
				<div style={{ display: 'flex', flexDirection: 'column', width: '100%', gap: '0px' }}>
					{scheduleData && scheduleData.map(d => {
						return (
							<RoomButtons
								buildingData={d}
								shouldDisplayName={scheduleData.length > 1}
								onButtonClick={onClick}
							/>
						)
					})}
				</div>
			</div>
		) : (
			<div>
				<div style={{ marginBottom: '10px' }}>
					<strong style={{ marginTop: '0', color: "var(--gold)" }}>{name} {selectedRoom}</strong>
				</div>
				<div style={{ gap: '5px', display: 'flex', flexDirection: 'column' }}>
					{selectedSchedule.length == 0 ? (
						<div style={{ 
							padding: '5px', 
							textAlign: 'center', 
							color: 'var(--gold)', 
							fontStyle: 'italic' 
						}}>
							<p style={{ margin: 0 }}>No classes scheduled</p>
						</div>
					) : (
						selectedSchedule.map((s: TimeBlock, index: number) => (
							<ScheduleTimeBlock
								key={index}
								timeBlock={s}
							/>
						))
					)}
				</div>
				<div style={{ display: 'flex', justifyContent: 'center' }}>
					<button
						style={{
							marginTop: '10px',
							padding: '8px 16px',
							backgroundColor: 'var(--gold)',
							color: 'black',
							border: 'none',
							borderRadius: '4px',
							cursor: 'pointer',
							fontWeight: '500'
						}}
						onClick={(e) => {
							e.stopPropagation();
							setSelectedSchedule([]);
							setSelectedRoom("");
							setWasRoomSelected(false);
						}}>
						Back
					</button>
				</div>
			</div>
		)
	);
}