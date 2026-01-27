import { TimeBlock } from "../../types"
import "../styles/ScheduleTimeBlock.css"

interface ScheduleTimeBlockProps {
	timeBlock: TimeBlock
}

/*
0: class name
1: pisa link 
2: professor name
3: start time
4: end time
*/

export default function ScheduleTimeBlock({ timeBlock }: ScheduleTimeBlockProps) {
	return (
		<div className="schedule-time-block">
			<a
				className="stb-pisalink"
				href={`https://pisa.ucsc.edu/class_search/${timeBlock[1]}`}
				target="_blank"
				rel="noopener noreferrer"
			>
				{timeBlock[0]}
			</a>
			<p className="stb-instructor">
				{timeBlock[2]}
			</p>
			<p className="stb-time">{timeBlock[3].slice(0, -3)} → {timeBlock[4].slice(0, -3)}</p>
		</div>
	)
}