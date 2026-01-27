import { useContext } from "react"
import { Context } from "../Context";
import { TopBar as MobileTopBar } from "../components/navbar/mobile/TopBar";
import { TopBar as DesktopTopBar } from "../components/navbar/desktop/TopBar";
import Map from "./Map";

/* Keeping this hidden for now, so I won't add a link in the topbar to here */
/* It'll still be accessible from /schedules */

// function Selector({ label, options, onSelect, disabled }: { label: string, options: any[], onSelect: (a: any) => void, disabled: boolean }) {
// 	return (
// 		<>
// 			<p>{label}</p>
// 			<select
// 				// type="dropdown"
// 				// size={options.length}
// 				onChange={(e) => onSelect(e.target.value)}
// 				disabled={disabled}
// 			>
// 				<option value="">--Please choose an option--</option>
// 				{options.map((b, i) => (<option value={b} key={i}>{b}</option>))}
// 			</select>
// 		</>
// 	)
// }

// const days: { [key: string]: number } = {
// 	"Monday": 0,
// 	"Tuesday": 1,
// 	"Wednesday": 2,
// 	"Thursday": 3,
// 	"Friday": 4,
// 	"Saturday": 5,
// 	"Sunday": 6
// };

export default function Schedules() {
	const ctx = useContext(Context);
	const terms = [];
	for (let i = 2048; i <= 2260; i += 2)
		terms.push(i);

	return (
		<>
			{ctx!.mobile ? <MobileTopBar /> : <DesktopTopBar />}
			<Map />
		</>
	)
}