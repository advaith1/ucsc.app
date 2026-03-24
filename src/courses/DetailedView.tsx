import { useContext } from "react";
import "./styles/DetailedView.css";
import BackIcon from "/icons/back-arrow.svg";
import { Context } from "../Context";
import { CourseContext } from "./Courses";
import ClassDetails from "./components/ClassDetails";
import ClassMeetings from "./components/ClassMeetings";
import ClassSections from "./components/ClassSections";
import Buttons from "./components/Buttons";


interface DetailedViewProps {
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

export default function DetailedView({ handleBack }: DetailedViewProps) {
	const ctx = useContext(Context);
	const courseCtx = useContext(CourseContext);
	const { details } = courseCtx!;

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
				<h2
					style={{ margin: "0px", marginBottom: "10px", marginTop: "10px" }}
				>
					{details.primary_section.subject}-{details.primary_section.catalog_nbr}:{" "}{details.primary_section.title_long}
				</h2>

				<div className={"ClassTools"}>
					<Buttons />
				</div>
			</div>


			<ClassDetails />

			<ClassInfoBlock title="Description" value={details.primary_section.description} />
			<ClassInfoBlock title="Requirements" value={details.primary_section.requirements} />
			<ClassInfoBlock title="Notes" value={details.notes} />

			<ClassMeetings />

			<ClassSections />

			{spacer}
		</div>
	);
};