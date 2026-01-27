import { useContext } from "react";
import { MapContext } from "./MapContext";
import { TimeBlock } from "../types";
import ScheduleTimeBlock from "./components/ScheduleTimeBlock";
import "./styles/Map.css";


function NoClassesHere() {
	return (
		<div style={{
			padding: '5px',
			textAlign: 'center',
			color: 'var(--gold)',
			fontStyle: 'italic'
		}}>
			<p style={{ margin: 0 }}>No classes scheduled here on this day.</p>
		</div>
	)
}

export default function Schedule({ locationName }: { locationName: string }) {
	const ctx = useContext(MapContext);

	// if the building isnt normal (eg East Field, East Field House, etc), display the selectedBuilding (eg "Martial Arts", "Dance Studio")
	// otherwise, if its normal and has a building + room (eg Physical Sciences 114), display locationName and room number
	const title = ctx!.selectedRoom == "-1" ? ctx!.selectedBuilding : `${locationName} ${ctx!.selectedRoom}`;

	return (
		<div>
			<div style={{ marginBottom: '10px' }}>
				<strong style={{ marginTop: '0', color: "var(--gold)" }}>{title}</strong>
			</div>
			<div style={{ gap: '5px', display: 'flex', flexDirection: 'column' }}>
				{ctx!.selectedSchedule.length == 0 ? (
					<NoClassesHere />
				) : (
					ctx!.selectedSchedule.map((s: TimeBlock, index: number) => (
						<ScheduleTimeBlock
							key={index}
							timeBlock={s}
						/>
					))
				)}
			</div>
			<div style={{ display: 'flex', justifyContent: 'center' }}>
				<button
					className="mapGoldButton"
					onClick={(e) => {
						e.stopPropagation();
						ctx!.onScheduleBackButtonPress();
					}}>
					Back
				</button>
			</div>
		</div>
	)
}