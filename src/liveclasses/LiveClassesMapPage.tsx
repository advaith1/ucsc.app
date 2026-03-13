import { useContext } from "react"
import { Context } from "../Context";
import { TopBar as MobileTopBar } from "../components/navbar/mobile/TopBar";
import { TopBar as DesktopTopBar } from "../components/navbar/desktop/TopBar";
import { usePageMeta } from "../hooks/usePageMeta.tsx";
import Map from "./Map";


export default function LiveClassesMapPage() {
	const ctx = useContext(Context);

	usePageMeta({
		title: 'Live Classes Map',
		description: 'Find ongoing classes on UC Santa Cruz campus. View live class schedules and locations on our interactive map.',
		keywords: 'UCSC classes, class locations, campus map, class schedule',
		ogUrl: 'https://ucsc.app/liveclasses',
		canonical: 'https://ucsc.app/liveclasses',
	});

	return (
		<>
			{ctx!.mobile ? <MobileTopBar /> : <DesktopTopBar />}
			<Map />
		</>
	)
}
