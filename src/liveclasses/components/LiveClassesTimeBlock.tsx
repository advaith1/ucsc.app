import { TimeBlock } from "../../types"
import "../styles/LiveClassesTimeBlock.css"

interface LiveClassesTimeBlockProps {
	timeBlock: TimeBlock
}

const d = new Date();
function formatTime(time: string) {
	d.setHours(...(time.split(':') as unknown as [number, number, number]))
	return d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
}

/*
0: class name
1: pisa link
2: professor name
3: start time
4: end time
*/

export default function LiveClassesTimeBlock({ timeBlock }: LiveClassesTimeBlockProps) {
	return (
		<div className="live-classes-time-block">
			<a
				className="stb-pisalink"
				href={`https://pisa.ucsc.edu/class_search/${timeBlock[1]}`}
				target="_blank"
				rel="noopener noreferrer"
			>
				{timeBlock[0]}
			</a>
			<p className="stb-instructor">
				{timeBlock[2].replaceAll(',', ', ')}
			</p>
			<p className="stb-time">{formatTime(timeBlock[3])} → {formatTime(timeBlock[4])}</p>
		</div>
	)
}
