import { useContext } from "react";
import { MapContext } from "./MapContext";
import { TimeBlock } from "../types";
import ScheduleTimeBlock from "./components/ScheduleTimeBlock";

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

	return (
		<div>
			<div style={{ marginBottom: '10px' }}>
				<strong style={{ marginTop: '0', color: "var(--gold)" }}>{locationName} {ctx!.selectedRoom}</strong>
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
						ctx!.onScheduleBackButtonPress();
					}}>
					Back
				</button>
			</div>
		</div>
	)
}