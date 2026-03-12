import { useContext } from "react"
import { MapContext } from "../MapContext";
import '../styles/DaySelector.css';

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

function DaySelectorButton({ icon, onClick }: { icon: string, onClick: () => void }) {
	return (
		<button
			className="mapGoldButton daySelectorButton"
			onClick={onClick}
		>
			<img src={icon} alt="Previous Day" style={{ width: '16px', height: '16px' }} />
		</button>
	)
}


export default function DaySelector() {
	const ctx = useContext(MapContext);

	return (
		<div className="daySelectorParent">
			<DaySelectorButton
				icon="/icons/arrow-back.svg"
				onClick={() => ctx!.setDay(d => (d + 6) % 7)}
			/>

			<p className="dayText">
				{days[ctx!.day]}
			</p>

			<DaySelectorButton
				icon="/icons/arrow-forward.svg"
				onClick={() => ctx!.setDay(d => (d + 1) % 7)}
			/>
		</div>
	)
}