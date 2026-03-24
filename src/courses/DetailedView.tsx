import { useContext } from "react";
import "./styles/DetailedView.css";
import ExternalLinkIcon from "/icons/external-link.svg";
import GoogleCalendarIcon from "/icons/Google_Calendar_icon.png";
import DownloadIcon from "/icons/downlaod2.png";
import BackIcon from "/icons/back-arrow.svg";
import { generateIcs, generateIcsForSection } from "./generateIcs";
import { generateGoogleCalendarLink } from "./generateIcs";
import { DetailedClassInfo } from "../types";
import { Context } from "../Context";
import ClassDetails from "./components/ClassDetails";
import ClassMeetings from "./components/ClassMeetings";
import ClassSections from "./components/ClassSections";


interface DetailedViewProps {
	details: DetailedClassInfo;
	modality: string;
	link: string;
	term: string;
	handleBack: () => void;
}

function ClassInfoBlock({ title, value }: { title: string, value: string | string[] }) {
	if (!value) return (<></>);

	return (
		<div className="description classDetails">
			<h3 className="heading">{title}</h3>
			<p>{value}</p>
		</div>
	)
}

export default function DetailedView({ details, link, term, handleBack }: DetailedViewProps) {
	const ctx = useContext(Context);
	if (Object.keys(details).length === 0 || Object.values(details).some(v => v === null)) return (<></>);
	const spacer = <div style={{ height: "0px", margin: "20px 0" }}></div>;

	const containerStyle = ctx!.mobile ? {
		maxHeight: "100vh",
		overflowY: "auto" as const,
		width: "100%",
		padding: "0 0px",
		margin: "0px 0px",
	} : {};

	return (
		<div className="detailsParent" style={containerStyle}>
			{spacer}

			<div className="titleAndButtonParent">
				{ctx!.mobile && (
					<button
						onClick={handleBack}
						className="pisaButton"
						style={{ backgroundColor: "#007bff" }}
					>
						<img
							src={BackIcon}
							alt="Back"
							width="20px"
							height="20px"
							style={{ verticalAlign: "middle" }}
						/>
					</button>
				)}
				<div>
					<h3
						style={ctx!.mobile ? {
							fontSize: "1.2rem",
							paddingLeft: "8px",
							paddingRight: "8px",
						} : {}
						}
					>
						{details.primary_section.subject}-{details.primary_section.catalog_nbr}:{" "}{details.primary_section.title_long}
					</h3>
				</div>

				<div className={ctx!.mobile ? "ClassToolsMobile" : "ClassTools"}>
					<button
						onClick={() => {
							const ics = generateIcs(details, term);
							const blob = new Blob([ics], {
								type: "text/calendar",
							});
							const url = URL.createObjectURL(blob);
							const a = document.createElement("a");
							a.href = url;
							a.download = `${details.primary_section.subject}-${details.primary_section.catalog_nbr}.ics`;
							a.click();
							URL.revokeObjectURL(url);
						}}
						className="pisaButton"
						title="Download calendar file"
					>
						<img
							src={DownloadIcon}
							alt="Download calendar icon"
							width="30"
							height="30"
							style={{ verticalAlign: "middle" }}
						/>
						Download Calendar .ics
					</button>

					<button
						onClick={() => {
							const meeting = details.meetings?.[0];
							if (!meeting) return;

							const link = generateGoogleCalendarLink(
								details.primary_section.subject,
								details.primary_section.catalog_nbr,
								details.primary_section.title_long,
								details.primary_section.class_nbr,
								meeting,
								term,
								"Lecture",
							);

							window.open(link, "_blank");
						}}
						className="pisaButton"
					>
						<img
							src={GoogleCalendarIcon}
							alt="Add to Google Calendar icon"
							width="30"
							height="30"
						/>
						Add to Google Calendar
					</button>

					<button
						onClick={() => window.open(link, "_blank")}
						className="pisaButton"
					>
						<img
							src={ExternalLinkIcon}
							alt="Open source page in new window"
							width="30"
							height="30"
							style={{ verticalAlign: "middle" }}
						/>
						View Source
					</button>
				</div>
			</div>




			<ClassDetails />

			<ClassInfoBlock title="Description"  value={details.primary_section.description} />
			<ClassInfoBlock title="Requirements" value={details.primary_section.requirements} />
			<ClassInfoBlock title="Notes"        value={details.notes} />

			<ClassMeetings />

			<ClassSections />
			
			{spacer}
		</div> 
	);
};