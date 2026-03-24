import { useContext } from "react";
import { Context } from "../../Context";
import { CourseContext } from "../Courses";

function ClassDetailsGridEntry(title: string, content: string) {
	return (
		<div style={{ display: "flex", flexDirection: "column" }}>
			<span
				style={{
					fontWeight: "500",
					// border: '5px solid green',
					color: "#6c757d",
					fontSize: "0.9rem",
				}}
			>
				{title}
			</span>
			<span style={{ fontSize: "1.1rem" }}>{content}</span>
		</div>
	);
}

export default function ClassDetails() {
	const ctx = useContext(Context);
	const courseCtx = useContext(CourseContext);
	
	const details = courseCtx!.details;
	const modality = courseCtx!.modality;

	if (!details.primary_section) return (<></>);
	const section = details.primary_section;
	
	const classDetailsGridStyle = ctx!.mobile ? { gridTemplateColumns: "repeat(2, 1fr)" } : {};
	return (
		<div className="classDetails">
			<h3 className="heading">Class Details</h3>
			<div className="classDetailsGridWrapper">
				<div
					className="classDetailsGrid"
					style={classDetailsGridStyle}
				>
					{ClassDetailsGridEntry("Status", section.enrl_status)}
					{ClassDetailsGridEntry("Enrolled", section.enrl_total + " / " + section.capacity)}
					{ClassDetailsGridEntry("Waitlist", section.waitlist_total + " / " + section.waitlist_capacity)}
					{ClassDetailsGridEntry("Credits", section.credits)}
					{ClassDetailsGridEntry("GenEd", section.gened || "None")}
					{ClassDetailsGridEntry("Modality", modality)}
					{ClassDetailsGridEntry("Class ID", section.class_nbr)}
					{ClassDetailsGridEntry("Career", section.acad_career)}
				</div>
			</div>
		</div>
	)
}